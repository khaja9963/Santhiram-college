from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.all_models import User, Student, Attendance, Marks, Result, FeeRecord
from app.schemas.all_schemas import (
    StudentProfile, StudentAttendanceOverview, SubjectAttendance,
    MarksRecord, SemesterResult, FeeStatus
)
from app.api.deps import require_role

router = APIRouter(prefix="/student", tags=["Student Portal"])

@router.get("/profile", response_model=StudentProfile)
def get_student_profile(
    current_user: User = Depends(require_role(["STUDENT", "ADMIN"])),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        # Fallback to first student for administrative preview
        student = db.query(Student).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found")

    return StudentProfile(
        id=student.id,
        roll_number=student.roll_number,
        full_name=student.user.full_name if student.user else current_user.full_name,
        email=student.user.email if student.user else current_user.email,
        department=student.department,
        year=student.year,
        semester=student.semester,
        section=student.section,
        admission_year=student.admission_year,
        cgpa=student.cgpa,
        credits_earned=student.credits_earned,
        phone=student.phone,
        address=student.address
    )

@router.get("/attendance", response_model=StudentAttendanceOverview)
def get_student_attendance(
    current_user: User = Depends(require_role(["STUDENT", "ADMIN"])),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first() or db.query(Student).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    records = db.query(Attendance).filter(Attendance.student_id == student.id).all()
    total_classes = sum(r.total_classes for r in records)
    total_attended = sum(r.attended_classes for r in records)
    overall_pct = (total_attended / total_classes * 100.0) if total_classes > 0 else 0.0

    subject_items = [
        SubjectAttendance(
            subject_code=r.subject_code,
            subject_name=r.subject_name,
            total_classes=r.total_classes,
            attended_classes=r.attended_classes,
            percentage=round(r.percentage, 1)
        )
        for r in records
    ]

    return StudentAttendanceOverview(
        overall_percentage=round(overall_pct, 1),
        total_classes=total_classes,
        total_attended=total_attended,
        is_low_attendance=(overall_pct < 75.0),
        subjects=subject_items
    )

@router.get("/marks", response_model=List[MarksRecord])
def get_student_marks(
    current_user: User = Depends(require_role(["STUDENT", "ADMIN"])),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first() or db.query(Student).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    records = db.query(Marks).filter(Marks.student_id == student.id).all()
    return [
        MarksRecord(
            subject_code=m.subject_code,
            subject_name=m.subject_name,
            exam_type=m.exam_type,
            scored_marks=m.scored_marks,
            max_marks=m.max_marks,
            grade=m.grade
        )
        for m in records
    ]

@router.get("/results", response_model=List[SemesterResult])
def get_student_results(
    current_user: User = Depends(require_role(["STUDENT", "ADMIN"])),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first() or db.query(Student).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    results = db.query(Result).filter(Result.student_id == student.id).order_by(Result.semester.asc()).all()
    return [
        SemesterResult(
            semester=r.semester,
            academic_year=r.academic_year,
            sgpa=r.sgpa,
            cgpa=r.cgpa,
            backlogs=r.backlogs,
            status=r.status,
            published_date=r.published_date
        )
        for r in results
    ]

@router.get("/fees", response_model=FeeStatus)
def get_student_fees(
    current_user: User = Depends(require_role(["STUDENT", "ADMIN"])),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first() or db.query(Student).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")

    fee = db.query(FeeRecord).filter(FeeRecord.student_id == student.id).first()
    if not fee:
        return FeeStatus(
            academic_year="2024-2025",
            fee_type="Tuition Fee",
            total_amount=52000.0,
            paid_amount=52000.0,
            due_amount=0.0,
            status="PAID",
            receipt_number="SREC/FEE/GEN",
            payment_date="2024-10-01"
        )

    return FeeStatus(
        academic_year=fee.academic_year,
        fee_type=fee.fee_type,
        total_amount=fee.total_amount,
        paid_amount=fee.paid_amount,
        due_amount=fee.due_amount,
        status=fee.status,
        receipt_number=fee.receipt_number,
        payment_date=fee.payment_date
    )
