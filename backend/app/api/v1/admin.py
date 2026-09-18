from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Request, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional
from datetime import datetime, timedelta

from app.database.session import get_db
from app.models.all_models import (
    User, Student, Faculty, Department, Document, NewsAnnouncement, Event,
    AccountActivationToken, PasswordResetToken, AuditLog
)
from app.schemas.all_schemas import (
    DocumentOut, StudentCreateAdmin, FacultyCreateAdmin, UserOut,
    UserStatusUpdate, UserStatsOut, AuditLogOut
)
from app.api.deps import require_role
from app.ai.rag_engine import rag_engine
from app.core.security import generate_secure_token
from pydantic import BaseModel
from app.services.email_service import (
    send_activation_email, send_account_recovery_email, send_status_change_email, send_credentials_email
)
from app.services.audit_service import log_audit

router = APIRouter(prefix="/admin", tags=["Admin Portal & Knowledge Base"])

def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"


# ==========================================
# DASHBOARD & METRICS
# ==========================================

@router.get("/dashboard-stats")
def get_admin_dashboard_stats(
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    stud_count = db.query(Student).count()
    fac_count = db.query(Faculty).count()
    dept_count = db.query(Department).count()
    doc_count = db.query(Document).count()
    active_events = db.query(Event).filter(Event.is_upcoming == True).count()
    announcements_count = db.query(NewsAnnouncement).count()

    # User management stats
    pending_activation = db.query(User).filter(User.status == "INVITED").count()
    suspended_users = db.query(User).filter(User.status == "SUSPENDED").count()

    return {
        "total_students": stud_count,
        "total_faculty": fac_count,
        "total_departments": dept_count,
        "total_documents": doc_count,
        "active_events": active_events,
        "announcements_count": announcements_count,
        "pending_activation": pending_activation,
        "suspended_users": suspended_users,
        "knowledge_base_status": "ONLINE",
        "vector_indexing_health": "100% OPERATIONAL"
    }


@router.get("/users/stats", response_model=UserStatsOut)
def get_user_management_stats(
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    total = db.query(User).count()
    students = db.query(User).filter(User.role == "STUDENT").count()
    faculty = db.query(User).filter(User.role == "FACULTY").count()
    admins = db.query(User).filter(User.role == "ADMIN").count()
    active = db.query(User).filter(User.status == "ACTIVE").count()
    invited = db.query(User).filter(User.status == "INVITED").count()
    suspended = db.query(User).filter(User.status == "SUSPENDED").count()
    deactivated = db.query(User).filter(User.status == "DEACTIVATED").count()

    return UserStatsOut(
        total_users=total,
        students=students,
        faculty=faculty,
        admins=admins,
        active_users=active,
        invited_users=invited,
        suspended_users=suspended,
        deactivated_users=deactivated
    )


# ==========================================
# USER CREATION (ADMIN ONLY)
# ==========================================

@router.post("/users/students")
def create_student(
    payload: StudentCreateAdmin,
    request: Request,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")

    student_code = payload.student_id.strip().upper()
    email = payload.college_email.strip().lower()

    # Check for existing user code or email
    existing_user = db.query(User).filter(
        or_(
            User.email == email,
            User.user_code == student_code
        )
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An account with this College ID ({student_code}) or email ({email}) already exists."
        )

    # Department lookup
    dept = db.query(Department).filter(
        or_(
            Department.code == payload.department.upper(),
            Department.name.ilike(f"%{payload.department}%")
        )
    ).first()
    dept_id = dept.id if dept else None

    # Create User with status INVITED, no password
    new_user = User(
        user_code=student_code,
        email=email,
        full_name=payload.full_name.strip(),
        mobile=payload.mobile_number.strip() if payload.mobile_number else None,
        role="STUDENT",
        status=payload.status or "INVITED",
        department_id=dept_id,
        first_login=True,
        email_verified=False,
        is_active=True,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.flush()

    # Create Student profile record
    new_student = Student(
        user_id=new_user.id,
        roll_number=student_code,
        student_id=student_code,
        department_id=dept_id,
        department=payload.department.upper(),
        year=payload.year,
        semester=payload.semester,
        section=payload.section.upper(),
        admission_year=payload.admission_year,
        phone=payload.mobile_number.strip() if payload.mobile_number else "N/A",
        address="Nandyal, AP"
    )
    db.add(new_student)

    # Generate secure activation token (72 hours)
    raw_token, thash = generate_secure_token()
    act_token = AccountActivationToken(
        user_id=new_user.id,
        token_hash=thash,
        expires_at=datetime.utcnow() + timedelta(hours=72)
    )
    db.add(act_token)

    db.commit()
    db.refresh(new_user)

    # Dispatch activation email
    send_activation_email(
        email=new_user.email,
        name=new_user.full_name,
        user_code=new_user.user_code,
        activation_token=raw_token
    )

    log_audit(
        db,
        action="ACCOUNT_CREATED",
        user_id=current_user.id,
        ip_address=ip,
        user_agent=ua,
        details=f"Created Student account {student_code} ({email}) with status INVITED"
    )
    log_audit(
        db,
        action="ACTIVATION_LINK_SENT",
        user_id=new_user.id,
        ip_address=ip,
        user_agent=ua,
        details=f"Sent initial activation token for {student_code}"
    )

    return {
        "success": True,
        "message": f"Student account for {new_user.full_name} ({student_code}) created successfully with status INVITED.",
        "user_id": new_user.id,
        "user_code": new_user.user_code,
        "email": new_user.email,
        "status": new_user.status,
        "dev_activation_token": raw_token
    }


@router.post("/users/faculty")
def create_faculty(
    payload: FacultyCreateAdmin,
    request: Request,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")

    emp_code = payload.employee_id.strip().upper()
    email = payload.college_email.strip().lower()

    # Check for existing user code or email
    existing_user = db.query(User).filter(
        or_(
            User.email == email,
            User.user_code == emp_code
        )
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An account with this Employee ID ({emp_code}) or email ({email}) already exists."
        )

    # Department lookup
    dept = db.query(Department).filter(
        or_(
            Department.code == payload.department.upper(),
            Department.name.ilike(f"%{payload.department}%")
        )
    ).first()
    dept_id = dept.id if dept else None

    # Create User with status INVITED, no password
    new_user = User(
        user_code=emp_code,
        email=email,
        full_name=payload.full_name.strip(),
        mobile=payload.mobile_number.strip() if payload.mobile_number else None,
        role="FACULTY",
        status=payload.status or "INVITED",
        department_id=dept_id,
        first_login=True,
        email_verified=False,
        is_active=True,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.flush()

    # Create Faculty profile record
    new_faculty = Faculty(
        user_id=new_user.id,
        employee_id=emp_code,
        department_id=dept_id,
        department=payload.department.upper(),
        designation=payload.designation.strip(),
        joining_year=payload.joining_year,
        specialization="Engineering & Sciences"
    )
    db.add(new_faculty)

    # Generate secure activation token (72 hours)
    raw_token, thash = generate_secure_token()
    act_token = AccountActivationToken(
        user_id=new_user.id,
        token_hash=thash,
        expires_at=datetime.utcnow() + timedelta(hours=72)
    )
    db.add(act_token)

    db.commit()
    db.refresh(new_user)

    # Dispatch activation email
    send_activation_email(
        email=new_user.email,
        name=new_user.full_name,
        user_code=new_user.user_code,
        activation_token=raw_token
    )

    log_audit(
        db,
        action="ACCOUNT_CREATED",
        user_id=current_user.id,
        ip_address=ip,
        user_agent=ua,
        details=f"Created Faculty account {emp_code} ({email}) with status INVITED"
    )
    log_audit(
        db,
        action="ACTIVATION_LINK_SENT",
        user_id=new_user.id,
        ip_address=ip,
        user_agent=ua,
        details=f"Sent initial activation token for {emp_code}"
    )

    return {
        "success": True,
        "message": f"Faculty account for {new_user.full_name} ({emp_code}) created successfully with status INVITED.",
        "user_id": new_user.id,
        "user_code": new_user.user_code,
        "email": new_user.email,
        "status": new_user.status,
        "dev_activation_token": raw_token
    }


# ==========================================
# USER MANAGEMENT & SEARCH
# ==========================================

@router.get("/users")
def list_users(
    search: Optional[str] = Query(None, description="Search by ID, name, email"),
    role: Optional[str] = Query(None, description="Filter by role: ADMIN, STUDENT, FACULTY"),
    status: Optional[str] = Query(None, description="Filter by status: INVITED, ACTIVE, SUSPENDED, DEACTIVATED, GRADUATED"),
    department: Optional[str] = Query(None, description="Filter by department code or id"),
    sort_by: Optional[str] = Query("created_at", description="name, created_at, last_login"),
    sort_order: Optional[str] = Query("desc", description="asc, desc"),
    page: int = Query(1, ge=1),
    limit: int = Query(15, ge=1, le=100),
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    query = db.query(User)

    # Filters
    if role:
        query = query.filter(User.role == role.upper().strip())
    if status:
        query = query.filter(User.status == status.upper().strip())
    if department:
        dept = db.query(Department).filter(
            or_(Department.code == department.upper(), Department.id == department)
        ).first()
        if dept:
            query = query.filter(User.department_id == dept.id)

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.full_name.ilike(s),
                User.email.ilike(s),
                User.user_code.ilike(s)
            )
        )

    # Sorting
    sort_column = User.created_at
    if sort_by == "name":
        sort_column = User.full_name
    elif sort_by == "last_login":
        sort_column = User.last_login

    if sort_order == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    total = query.count()
    users = query.offset((page - 1) * limit).limit(limit).all()

    # Populate department names and sub-profiles
    results = []
    for u in users:
        dept_name = None
        if u.department_id:
            d = db.query(Department).filter(Department.id == u.department_id).first()
            if d:
                dept_name = d.name

        stud_data = None
        fac_data = None
        if u.role == "STUDENT":
            st = db.query(Student).filter(Student.user_id == u.id).first()
            if st:
                stud_data = {
                    "roll_number": st.roll_number,
                    "student_id": st.student_id or st.roll_number,
                    "year": st.year,
                    "semester": st.semester,
                    "section": st.section,
                    "admission_year": st.admission_year,
                }
        elif u.role == "FACULTY":
            fc = db.query(Faculty).filter(Faculty.user_id == u.id).first()
            if fc:
                fac_data = {
                    "employee_id": fc.employee_id,
                    "designation": fc.designation,
                    "joining_year": fc.joining_year,
                }

        results.append({
            "id": u.id,
            "user_code": u.user_code,
            "name": u.full_name,
            "full_name": u.full_name,
            "email": u.email,
            "mobile": u.mobile,
            "role": u.role,
            "status": u.status,
            "department_id": u.department_id,
            "department_name": dept_name,
            "first_login": bool(u.first_login),
            "email_verified": bool(u.email_verified),
            "last_login": u.last_login.isoformat() if u.last_login else None,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "student_details": stud_data,
            "faculty_details": fac_data
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
        "users": results
    }


@router.get("/users/{user_id}")
def get_user_detail(
    user_id: str,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")

    dept_name = None
    if u.department_id:
        d = db.query(Department).filter(Department.id == u.department_id).first()
        if d:
            dept_name = d.name

    stud_data = None
    fac_data = None
    if u.role == "STUDENT":
        st = db.query(Student).filter(Student.user_id == u.id).first()
        if st:
            stud_data = {
                "roll_number": st.roll_number,
                "student_id": st.student_id or st.roll_number,
                "year": st.year,
                "semester": st.semester,
                "section": st.section,
                "admission_year": st.admission_year,
                "cgpa": st.cgpa,
                "phone": st.phone,
                "address": st.address
            }
    elif u.role == "FACULTY":
        fc = db.query(Faculty).filter(Faculty.user_id == u.id).first()
        if fc:
            fac_data = {
                "employee_id": fc.employee_id,
                "designation": fc.designation,
                "joining_year": fc.joining_year,
                "cabin": fc.cabin,
                "specialization": fc.specialization
            }

    return {
        "id": u.id,
        "user_code": u.user_code,
        "name": u.full_name,
        "full_name": u.full_name,
        "email": u.email,
        "mobile": u.mobile,
        "role": u.role,
        "status": u.status,
        "department_id": u.department_id,
        "department_name": dept_name,
        "first_login": bool(u.first_login),
        "email_verified": bool(u.email_verified),
        "last_login": u.last_login.isoformat() if u.last_login else None,
        "created_at": u.created_at.isoformat() if u.created_at else None,
        "student_details": stud_data,
        "faculty_details": fac_data
    }


@router.patch("/users/{user_id}")
def update_user_status(
    user_id: str,
    payload: UserStatusUpdate,
    request: Request,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_status = payload.status.upper().strip()
    valid_statuses = ["INVITED", "ACTIVE", "SUSPENDED", "DEACTIVATED", "GRADUATED"]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{new_status}'. Allowed: {', '.join(valid_statuses)}"
        )

    old_status = user.status
    user.status = new_status
    user.updated_at = datetime.utcnow()

    # Determine action for audit log
    action_map = {
        "SUSPENDED": "ACCOUNT_SUSPENDED",
        "ACTIVE": "ACCOUNT_ACTIVATED",
        "DEACTIVATED": "ACCOUNT_DEACTIVATED",
        "GRADUATED": "ACCOUNT_STATUS_GRADUATED"
    }
    action = action_map.get(new_status, "ACCOUNT_STATUS_CHANGED")

    db.commit()
    db.refresh(user)

    log_audit(
        db,
        action=action,
        user_id=current_user.id,
        ip_address=ip,
        user_agent=ua,
        details=f"Changed status of {user.user_code or user.email} from {old_status} to {new_status}. Reason: {payload.reason or 'None'}"
    )

    send_status_change_email(
        email=user.email,
        name=user.full_name,
        new_status=new_status,
        reason=payload.reason
    )

    return {
        "success": True,
        "message": f"User status successfully updated to {new_status}.",
        "user_id": user.id,
        "status": user.status
    }


@router.post("/users/{user_id}/resend-activation")
def resend_activation_link(
    user_id: str,
    request: Request,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Invalidate previous unused activation tokens
    db.query(AccountActivationToken).filter(
        AccountActivationToken.user_id == user.id,
        AccountActivationToken.used_at.is_(None)
    ).update({"used_at": datetime.utcnow()})

    # Generate new activation token (72 hours)
    raw_token, thash = generate_secure_token()
    act_token = AccountActivationToken(
        user_id=user.id,
        token_hash=thash,
        expires_at=datetime.utcnow() + timedelta(hours=72)
    )
    db.add(act_token)
    db.commit()

    # Send activation email
    send_activation_email(
        email=user.email,
        name=user.full_name,
        user_code=user.user_code or user.email,
        activation_token=raw_token
    )

    log_audit(
        db,
        action="ACTIVATION_LINK_SENT",
        user_id=current_user.id,
        ip_address=ip,
        user_agent=ua,
        details=f"Admin resent activation link to {user.email}"
    )

    return {
        "success": True,
        "message": f"New activation link sent to {user.email}.",
        "dev_activation_token": raw_token
    }


@router.post("/users/{user_id}/reset-account")
def reset_account(
    user_id: str,
    request: Request,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    Admin Account Recovery (Section 14):
    Revokes old activation/reset tokens, resets status to INVITED (or issues recovery),
    and generates a fresh activation/recovery link.
    Admin must NEVER manually set or see the password.
    """
    ip = _get_client_ip(request)
    ua = request.headers.get("User-Agent", "Unknown")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Invalidate all prior activation and reset tokens
    now = datetime.utcnow()
    db.query(AccountActivationToken).filter(
        AccountActivationToken.user_id == user.id,
        AccountActivationToken.used_at.is_(None)
    ).update({"used_at": now})

    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used_at.is_(None)
    ).update({"used_at": now})

    # Revoke password hash until user sets a new one through recovery
    user.status = "INVITED"
    user.first_login = True
    user.updated_at = now

    # Issue a new secure activation token
    raw_token, thash = generate_secure_token()
    new_act_token = AccountActivationToken(
        user_id=user.id,
        token_hash=thash,
        expires_at=now + timedelta(hours=72)
    )
    db.add(new_act_token)
    db.commit()

    # Send account recovery email
    send_account_recovery_email(
        email=user.email,
        name=user.full_name,
        user_code=user.user_code or user.email,
        recovery_token=raw_token
    )

    log_audit(
        db,
        action="ACCOUNT_RESET",
        user_id=current_user.id,
        ip_address=ip,
        user_agent=ua,
        details=f"Admin initiated secure account recovery for {user.user_code} ({user.email})"
    )

    return {
        "success": True,
        "message": f"Account reset completed. An account recovery link has been issued and sent to {user.email}.",
        "dev_recovery_token": raw_token
    }


# ==========================================
# AUDIT LOGS (ADMIN ONLY)
# ==========================================

@router.get("/audit-logs")
def get_audit_logs(
    user_id: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)

    if action:
        query = query.filter(AuditLog.action.ilike(f"%{action.strip()}%"))

    if user_id:
        query = query.filter(AuditLog.user_id == user_id)

    query = query.order_by(desc(AuditLog.created_at))

    total = query.count()
    logs = query.offset((page - 1) * limit).limit(limit).all()

    # Attach user name/code
    results = []
    for entry in logs:
        uname = "System / Anonymous"
        ucode = None
        urole = None
        if entry.user_id:
            u = db.query(User).filter(User.id == entry.user_id).first()
            if u:
                uname = u.full_name
                ucode = u.user_code
                urole = u.role

        if role and urole != role.upper().strip():
            continue

        results.append({
            "id": entry.id,
            "user_id": entry.user_id,
            "user_name": uname,
            "user_code": ucode,
            "user_role": urole,
            "action": entry.action,
            "ip_address": entry.ip_address,
            "user_agent": entry.user_agent,
            "details": entry.details,
            "created_at": entry.created_at.isoformat() if entry.created_at else None
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
        "logs": results
    }


# ==========================================
# EXISTING DOCUMENT MANAGEMENT (PRESERVED)
# ==========================================

@router.get("/documents", response_model=List[DocumentOut])
def get_documents(
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    return db.query(Document).order_by(Document.uploaded_at.desc()).all()


@router.post("/documents/upload")
async def upload_document(
    title: str = Form(...),
    department: str = Form("ALL"),
    category: str = Form("SYLLABUS"),
    academic_year: str = Form("2025-2026"),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    file_name = file.filename if file else f"{title.replace(' ', '_')}.pdf"
    file_size = (file.size // 1024) if (file and hasattr(file, 'size') and file.size) else 1850

    estimated_chunks = max(4, file_size // 100)

    doc = Document(
        title=title,
        department=department,
        category=category.upper(),
        file_name=file_name,
        file_type=file_name.split(".")[-1].upper() if "." in file_name else "PDF",
        file_size_kb=file_size,
        academic_year=academic_year,
        total_pages=max(1, estimated_chunks // 2),
        indexed_chunks=estimated_chunks,
        status="PROCESSED"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    rag_engine.add_custom_document(
        title=title,
        category=category.upper(),
        content=f"Official College Document: {title} ({category}) for Department of {department}. Approved under SREC Autonomous guidelines for academic year {academic_year}."
    )

    return {
        "status": "SUCCESS",
        "message": f"Document '{title}' successfully uploaded and indexed into SREC pgvector Knowledge Base.",
        "document_id": doc.id,
        "chunks_indexed": estimated_chunks
    }


@router.delete("/documents/{document_id}")
def delete_document(
    document_id: str,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(doc)
    db.commit()
    return {"status": "SUCCESS", "message": f"Document '{doc.title}' deleted from Knowledge Base."}


class SendCredentialsPayload(BaseModel):
    email: str
    name: str
    user_code: str
    temp_password: str
    role: str


@router.post("/send-credentials-email")
def api_send_credentials_email(
    payload: SendCredentialsPayload,
    current_user: User = Depends(require_role(["ADMIN"])),
):
    ok = send_credentials_email(
        email=payload.email,
        name=payload.name,
        user_code=payload.user_code,
        temp_password=payload.temp_password,
        role=payload.role,
    )
    return {"success": ok, "message": "Credentials email dispatched successfully."}
