from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.session import get_db
from app.models.all_models import (
    User, Student, Faculty, Department,
    AccountActivationToken, PasswordResetToken
)
from app.schemas.all_schemas import (
    LoginRequest, TokenResponse, UserOut,
    ActivateAccountRequest, TokenVerifyResponse,
    ForgotPasswordRequest, ResetPasswordRequest,
    ChangePasswordRequest, ProfileUpdate
)
from app.core.security import (
    verify_password, get_password_hash, create_access_token,
    validate_password_strength, generate_secure_token, hash_token
)
from app.services.email_service import (
    send_password_reset_email
)
from app.services.audit_service import log_audit
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")
    ident = payload.get_login_identifier().lower()

    if not ident:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="College ID or email is required."
        )

    # Search user by email or user_code
    user = db.query(User).filter(
        or_(
            User.email.ilike(ident),
            User.user_code.ilike(ident)
        )
    ).first()

    # Rate limiting / lockout check
    now = datetime.utcnow()
    if user and user.locked_until and user.locked_until > now:
        log_audit(db, action="LOGIN_LOCKED_BLOCKED", user_id=user.id, ip_address=ip, user_agent=ua)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Unable to sign in. Account temporarily locked due to multiple failed attempts. Please try again later."
        )

    # Validate existence & password
    if not user or not verify_password(payload.password, user.password_hash):
        if user:
            user.failed_attempts = (user.failed_attempts or 0) + 1
            if user.failed_attempts >= 5:
                user.locked_until = now + timedelta(minutes=15)
            db.commit()
            log_audit(db, action="LOGIN_FAILED", user_id=user.id, ip_address=ip, user_agent=ua, details=f"Failed attempt {user.failed_attempts}")
        else:
            log_audit(db, action="LOGIN_FAILED", ip_address=ip, user_agent=ua, details=f"Identifier: {ident}")
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to sign in. Please verify your credentials or try again later."
        )

    # Check Account Status
    if user.status == "INVITED":
        log_audit(db, action="LOGIN_ATTEMPT_INVITED", user_id=user.id, ip_address=ip, user_agent=ua)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please activate your account before logging in."
        )
    if user.status == "SUSPENDED":
        log_audit(db, action="LOGIN_ATTEMPT_SUSPENDED", user_id=user.id, ip_address=ip, user_agent=ua)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been temporarily suspended. Please contact the college administration."
        )
    if user.status == "DEACTIVATED":
        log_audit(db, action="LOGIN_ATTEMPT_DEACTIVATED", user_id=user.id, ip_address=ip, user_agent=ua)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is no longer active. Please contact the college administration."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive. Please contact the college administration."
        )

    # Credentials valid -> Reset failed attempts & record last_login
    user.failed_attempts = 0
    user.locked_until = None
    user.last_login = now
    db.commit()

    log_audit(db, action="LOGIN_SUCCESS", user_id=user.id, ip_address=ip, user_agent=ua)

    access_token = create_access_token(subject=user.id, role=user.role)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email,
        user_code=user.user_code,
        status=user.status,
        first_login=bool(user.first_login)
    )


@router.post("/logout")
def logout(request: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")
    log_audit(db, action="LOGOUT", user_id=current_user.id, ip_address=ip, user_agent=ua)
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    dept_name = None
    if current_user.department_id:
        dept = db.query(Department).filter(Department.id == current_user.department_id).first()
        if dept:
            dept_name = dept.name

    student_data = None
    faculty_data = None

    if current_user.role == "STUDENT":
        stud = db.query(Student).filter(Student.user_id == current_user.id).first()
        if stud:
            student_data = {
                "student_id": stud.student_id or stud.roll_number,
                "roll_number": stud.roll_number,
                "year": stud.year,
                "semester": stud.semester,
                "section": stud.section,
                "admission_year": stud.admission_year,
                "cgpa": stud.cgpa,
                "credits_earned": stud.credits_earned,
                "phone": stud.phone,
                "address": stud.address,
            }
    elif current_user.role == "FACULTY":
        fac = db.query(Faculty).filter(Faculty.user_id == current_user.id).first()
        if fac:
            faculty_data = {
                "employee_id": fac.employee_id,
                "designation": fac.designation,
                "joining_year": fac.joining_year,
                "cabin": getattr(fac, "cabin_number", "CS-304"),
                "specialization": fac.specialization,
            }

    return UserOut(
        id=current_user.id,
        user_code=current_user.user_code,
        email=current_user.email,
        full_name=current_user.full_name,
        name=current_user.full_name,
        role=current_user.role,
        status=current_user.status,
        department_id=current_user.department_id,
        department_name=dept_name,
        mobile=current_user.mobile,
        first_login=bool(current_user.first_login),
        email_verified=bool(current_user.email_verified),
        last_login=current_user.last_login,
        created_at=current_user.created_at,
        avatar_url=current_user.avatar_url,
        is_active=current_user.is_active,
        student_details=student_data,
        faculty_details=faculty_data
    )


@router.get("/verify-activation-token", response_model=TokenVerifyResponse)
def verify_activation_token(token: str, db: Session = Depends(get_db)):
    if not token:
        return TokenVerifyResponse(valid=False, message="Activation token is required.")

    thash = hash_token(token)
    act_token = db.query(AccountActivationToken).filter(
        AccountActivationToken.token_hash == thash,
        AccountActivationToken.used_at.is_(None),
        AccountActivationToken.expires_at > datetime.utcnow()
    ).first()

    if not act_token:
        return TokenVerifyResponse(
            valid=False,
            message="This activation link is invalid, expired, or has already been used. Please contact the administrator."
        )

    user = db.query(User).filter(User.id == act_token.user_id).first()
    if not user:
        return TokenVerifyResponse(valid=False, message="Associated user account not found.")

    return TokenVerifyResponse(
        valid=True,
        user_id=user.id,
        user_code=user.user_code,
        name=user.full_name,
        email=user.email,
        role=user.role,
        message="Token is valid."
    )


@router.post("/activate")
def activate_account(payload: ActivateAccountRequest, request: Request, db: Session = Depends(get_db)):
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")

    if payload.password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    valid, err_msg = validate_password_strength(payload.password)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg
        )

    thash = hash_token(payload.token)
    act_token = db.query(AccountActivationToken).filter(
        AccountActivationToken.token_hash == thash,
        AccountActivationToken.used_at.is_(None),
        AccountActivationToken.expires_at > datetime.utcnow()
    ).first()

    if not act_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid, expired, or previously used activation link. Please request a new activation link."
        )

    user = db.query(User).filter(User.id == act_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found."
        )

    # Hash new password
    user.password_hash = get_password_hash(payload.password)
    user.status = "ACTIVE"
    user.first_login = False
    user.email_verified = True
    user.updated_at = datetime.utcnow()

    # Mark token used
    act_token.used_at = datetime.utcnow()

    db.commit()
    db.refresh(user)

    log_audit(db, action="ACCOUNT_ACTIVATED", user_id=user.id, ip_address=ip, user_agent=ua)

    return {
        "success": True,
        "message": "Your account has been activated successfully.",
        "user_code": user.user_code,
        "name": user.full_name,
        "role": user.role
    }


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, request: Request, db: Session = Depends(get_db)):
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")
    ident = payload.identifier.strip().lower()

    # Generic response regardless of existence to prevent enumeration
    generic_msg = "If an account matches the information provided, a password reset link has been sent to your registered email."

    user = db.query(User).filter(
        or_(
            User.email.ilike(ident),
            User.user_code.ilike(ident)
        )
    ).first()

    if not user or user.status == "DEACTIVATED":
        log_audit(db, action="PASSWORD_RESET_ATTEMPT_UNKNOWN", ip_address=ip, user_agent=ua, details=f"Target: {ident}")
        return {"message": generic_msg}

    # Generate secure reset token valid for 1 hour
    raw_token, thash = generate_secure_token()
    now = datetime.utcnow()
    reset_record = PasswordResetToken(
        user_id=user.id,
        token_hash=thash,
        expires_at=now + timedelta(hours=1),
        created_at=now
    )
    db.add(reset_record)
    db.commit()

    # Dispatch email
    send_password_reset_email(
        email=user.email,
        name=user.full_name,
        reset_token=raw_token
    )
    log_audit(db, action="RESET_LINK_SENT", user_id=user.id, ip_address=ip, user_agent=ua)

    return {"message": generic_msg, "dev_token": raw_token}


@router.get("/verify-reset-token", response_model=TokenVerifyResponse)
def verify_reset_token(token: str, db: Session = Depends(get_db)):
    if not token:
        return TokenVerifyResponse(valid=False, message="Reset token is required.")

    thash = hash_token(token)
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == thash,
        PasswordResetToken.used_at.is_(None),
        PasswordResetToken.expires_at > datetime.utcnow()
    ).first()

    if not reset_token:
        return TokenVerifyResponse(
            valid=False,
            message="This password reset link is invalid, expired, or has already been used."
        )

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        return TokenVerifyResponse(valid=False, message="User not found.")

    return TokenVerifyResponse(
        valid=True,
        user_id=user.id,
        user_code=user.user_code,
        name=user.full_name,
        email=user.email,
        role=user.role,
        message="Token is valid."
    )


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, request: Request, db: Session = Depends(get_db)):
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")

    if payload.password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    valid, err_msg = validate_password_strength(payload.password)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg
        )

    thash = hash_token(payload.token)
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == thash,
        PasswordResetToken.used_at.is_(None),
        PasswordResetToken.expires_at > datetime.utcnow()
    ).first()

    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token. Please request a new password reset link."
        )

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found."
        )

    # Hash new password
    user.password_hash = get_password_hash(payload.password)
    user.updated_at = datetime.utcnow()
    reset_token.used_at = datetime.utcnow()

    db.commit()
    log_audit(db, action="PASSWORD_RESET", user_id=user.id, ip_address=ip, user_agent=ua)

    return {
        "success": True,
        "message": "Your password has been reset successfully. Please log in with your new password."
    }


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")

    # Verify current password
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password does not match our records."
        )

    if payload.new_password == payload.current_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password cannot be the same as your current password."
        )

    if payload.new_password != payload.confirm_new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password confirmation does not match."
        )

    valid, err_msg = validate_password_strength(payload.new_password)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg
        )

    current_user.password_hash = get_password_hash(payload.new_password)
    current_user.updated_at = datetime.utcnow()
    db.commit()

    log_audit(db, action="PASSWORD_CHANGED", user_id=current_user.id, ip_address=ip, user_agent=ua)

    return {"success": True, "message": "Password changed successfully."}


@router.patch("/profile")
def update_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if payload.mobile is not None:
        current_user.mobile = payload.mobile.strip()

    if current_user.role == "STUDENT":
        stud = db.query(Student).filter(Student.user_id == current_user.id).first()
        if stud:
            if payload.phone is not None:
                stud.phone = payload.phone.strip()
            if payload.address is not None:
                stud.address = payload.address.strip()

    db.commit()
    return {"success": True, "message": "Profile updated successfully."}
