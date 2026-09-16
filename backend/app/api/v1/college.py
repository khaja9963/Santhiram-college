from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.all_models import Department, NewsAnnouncement, Event, PlacementRecord
from app.schemas.all_schemas import DepartmentOut, NewsOut, EventOut, PlacementStatOut

router = APIRouter(prefix="/college", tags=["College Public Information"])

@router.get("/stats")
def get_college_stats(db: Session = Depends(get_db)):
    dept_count = db.query(Department).count()
    return {
        "students": 3650,
        "faculty": 245,
        "programs": 14,
        "placements_percentage": 87.5,
        "highest_package_lpa": 12.5,
        "average_package_lpa": 4.5,
        "departments_count": dept_count,
        "alumni": 14500,
        "accreditations": ["NAAC 'A' Grade", "NBA (CSE & ECE)", "AICTE Approved", "Autonomous"],
        "established_year": 2007,
        "motto": "Education for Peace and Progress"
    }

@router.get("/departments", response_model=List[DepartmentOut])
def get_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()

@router.get("/departments/{code}", response_model=DepartmentOut)
def get_department_by_code(code: str, db: Session = Depends(get_db)):
    dept = db.query(Department).filter(Department.code == code.upper()).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    return dept

@router.get("/news", response_model=List[NewsOut])
def get_news(db: Session = Depends(get_db)):
    return db.query(NewsAnnouncement).order_by(NewsAnnouncement.created_at.desc()).all()

@router.get("/events", response_model=List[EventOut])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()

@router.get("/placements", response_model=List[PlacementStatOut])
def get_placements(db: Session = Depends(get_db)):
    return db.query(PlacementRecord).all()
