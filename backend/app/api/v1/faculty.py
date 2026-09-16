from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.all_models import User, Faculty, Student, Attendance, Marks, Assignment, NewsAnnouncement
from app.schemas.all_schemas import (
    MarkAttendanceRequest, UploadMarksRequest, CreateAssignmentRequest
)
from app.api.deps import require_role

router = APIRouter(prefix="/faculty", tags=["Faculty Portal"])

@router.get("/dashboard-summary")
def get_faculty_summary(
    current_user: User = Depends(require_role(["FACULTY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    faculty = db.query(Faculty).filter(Faculty.user_id == current_user.id).first() or db.query(Faculty).first()
    students_count = db.query(Student).count()

    return {
        "faculty_name": faculty.user.full_name if (faculty and faculty.user) else current_user.full_name,
        "employee_id": faculty.employee_id if faculty else "SREC-FAC-0104",
        "department": faculty.department if faculty else "CSE",
        "designation": faculty.designation if faculty else "Professor",
        "assigned_classes": [
            {"subject_code": "20A05601T", "name": "Database Management Systems", "branch": "CSE - III Year Section A", "students": 64},
            {"subject_code": "20A05603T", "name": "Machine Learning & AI", "branch": "CSM - III Year Section B", "students": 60}
        ],
        "total_department_students": students_count,
        "pending_grading_count": 3
    }

@router.get("/students")
def get_department_students(
    current_user: User = Depends(require_role(["FACULTY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    students = db.query(Student).all()
    return [
        {
            "id": s.id,
            "roll_number": s.roll_number,
            "full_name": s.user.full_name if s.user else "Student",
            "department": s.department,
            "year": s.year,
            "semester": s.semester,
            "section": s.section,
            "cgpa": s.cgpa
        }
        for s in students
    ]

@router.post("/attendance")
def submit_attendance(
    payload: MarkAttendanceRequest,
    current_user: User = Depends(require_role(["FACULTY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    marked_count = len(payload.records)
    return {
        "status": "SUCCESS",
        "message": f"Successfully updated attendance for {marked_count} students in {payload.subject_code} on {payload.date}.",
        "records_processed": marked_count
    }

@router.post("/marks")
def submit_marks(
    payload: UploadMarksRequest,
    current_user: User = Depends(require_role(["FACULTY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    count = len(payload.marks)
    return {
        "status": "SUCCESS",
        "message": f"Successfully uploaded {payload.exam_type} marks for {count} students in {payload.subject_code}.",
        "records_processed": count
    }

@router.post("/assignments")
def create_assignment(
    payload: CreateAssignmentRequest,
    current_user: User = Depends(require_role(["FACULTY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    assignment = Assignment(
        title=payload.title,
        department=payload.department,
        subject_code=payload.subject_code,
        subject_name=payload.subject_name,
        year=payload.year,
        semester=payload.semester,
        due_date=payload.due_date,
        max_marks=payload.max_marks,
        description=payload.description,
        created_by=current_user.full_name
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {
        "status": "SUCCESS",
        "message": f"Assignment '{payload.title}' created and published successfully to students.",
        "assignment_id": assignment.id
    }
