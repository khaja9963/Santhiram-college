import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_code = Column(String(50), unique=True, index=True, nullable=True)  # e.g. 23CSE001, FAC042, ADM001
    name = Column(String(150), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    mobile = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=True)  # Nullable for INVITED accounts awaiting activation
    role = Column(String(20), nullable=False)  # STUDENT, FACULTY, ADMIN
    status = Column(String(20), default="ACTIVE", index=True)  # INVITED, ACTIVE, SUSPENDED, DEACTIVATED, GRADUATED
    department_id = Column(String(36), ForeignKey("departments.id"), nullable=True)
    first_login = Column(Boolean, default=False)
    email_verified = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    failed_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    avatar_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @hybrid_property
    def full_name(self):
        return self.name

    @full_name.setter
    def full_name(self, val):
        self.name = val

    @hybrid_property
    def hashed_password(self):
        return self.password_hash or ""

    @hashed_password.setter
    def hashed_password(self, val):
        self.password_hash = val

    @property
    def is_active(self):
        return self.status == "ACTIVE"

    @is_active.setter
    def is_active(self, val):
        if not val:
            self.status = "DEACTIVATED"
        elif not self.status:
            self.status = "ACTIVE"

    department_rel = relationship("Department", foreign_keys=[department_id])
    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    faculty_profile = relationship("Faculty", back_populates="user", uselist=False, cascade="all, delete-orphan")
    activation_tokens = relationship("AccountActivationToken", back_populates="user", cascade="all, delete-orphan")
    reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Student(Base):
    __tablename__ = "students"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    student_id = Column(String(30), unique=True, index=True, nullable=False)
    department_id = Column(String(36), ForeignKey("departments.id"), nullable=True)
    department = Column(String(20), nullable=False)  # CSE, CSM, CSD, ECE, EEE, etc.
    year = Column(Integer, default=3)                # 1, 2, 3, 4
    semester = Column(Integer, default=6)            # 1 to 8
    section = Column(String(10), default="A")
    admission_year = Column(Integer, default=2023)
    cgpa = Column(Float, default=8.45)
    credits_earned = Column(Integer, default=112)
    phone = Column(String(20), default="+91 9876543210")
    address = Column(String(255), default="Nandyal, Andhra Pradesh")

    @hybrid_property
    def roll_number(self):
        return self.student_id

    @roll_number.setter
    def roll_number(self, val):
        self.student_id = val

    user = relationship("User", back_populates="student_profile")
    department_rel = relationship("Department", foreign_keys=[department_id])
    attendances = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    marks = relationship("Marks", back_populates="student", cascade="all, delete-orphan")
    results = relationship("Result", back_populates="student", cascade="all, delete-orphan")
    submissions = relationship("AssignmentSubmission", back_populates="student", cascade="all, delete-orphan")
    resumes = relationship("StudentResume", back_populates="student", cascade="all, delete-orphan")

class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    employee_id = Column(String(30), unique=True, index=True, nullable=False)
    department_id = Column(String(36), ForeignKey("departments.id"), nullable=True)
    department = Column(String(20), nullable=False)
    designation = Column(String(100), default="Associate Professor")
    joining_year = Column(Integer, default=2018)
    qualification = Column(String(100), default="Ph.D. in Computer Science")
    specialization = Column(String(150), default="Machine Learning & Cloud Systems")
    experience_years = Column(Integer, default=12)
    cabin_number = Column(String(20), default="CS-304")
    phone = Column(String(20), default="+91 9866308475")

    user = relationship("User", back_populates="faculty_profile")
    department_rel = relationship("Department", foreign_keys=[department_id])

class Department(Base):
    __tablename__ = "departments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(10), unique=True, index=True, nullable=False)  # CSE, CSM, CSD, CSG, ECE, EEE, ME, CE, MBA, MCA
    name = Column(String(150), nullable=False)
    short_name = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    hod_name = Column(String(100), nullable=False)
    hod_email = Column(String(100), nullable=False)
    established_year = Column(Integer, default=2007)
    intake = Column(Integer, default=180)
    total_faculty = Column(Integer, default=28)
    labs_count = Column(Integer, default=8)

    courses = relationship("Course", back_populates="department_rel", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(20), unique=True, index=True, nullable=False) # e.g. BTECH-CSE, BTECH-CSM, MBA, MCA
    name = Column(String(150), nullable=False)                         # e.g. B.Tech in Computer Science & Engineering
    degree = Column(String(20), default="B.Tech")                      # B.Tech, M.Tech, MBA, MCA
    department_id = Column(String(36), ForeignKey("departments.id"), nullable=True)
    duration_years = Column(Integer, default=4)
    total_semesters = Column(Integer, default=8)
    intake = Column(Integer, default=180)
    eligibility = Column(String(255), default="10+2 / AP EAPCET with Physics, Chem, Math")
    created_at = Column(DateTime, default=datetime.utcnow)

    department_rel = relationship("Department", back_populates="courses")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(20), index=True, nullable=False)
    name = Column(String(150), nullable=False)
    department = Column(String(20), nullable=False)
    year = Column(Integer, nullable=False)
    semester = Column(Integer, nullable=False)
    credits = Column(Integer, default=3)
    faculty_name = Column(String(100), default="Senior Faculty")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    subject_code = Column(String(20), nullable=False)
    subject_name = Column(String(150), nullable=False)
    total_classes = Column(Integer, default=45)
    attended_classes = Column(Integer, default=39)
    percentage = Column(Float, default=86.6)
    last_updated = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="attendances")

class Marks(Base):
    __tablename__ = "marks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    subject_code = Column(String(20), nullable=False)
    subject_name = Column(String(150), nullable=False)
    exam_type = Column(String(30), nullable=False) # MID-1, MID-2, INTERNAL, SEMESTER
    scored_marks = Column(Float, nullable=False)
    max_marks = Column(Float, nullable=False)
    grade = Column(String(5), default="A")

    student = relationship("Student", back_populates="marks")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(200), nullable=False)
    department = Column(String(20), nullable=False)
    subject_code = Column(String(20), nullable=False)
    subject_name = Column(String(150), nullable=False)
    year = Column(Integer, default=3)
    semester = Column(Integer, default=6)
    due_date = Column(String(50), nullable=False)
    max_marks = Column(Integer, default=10)
    description = Column(Text, nullable=True)
    created_by = Column(String(100), default="Faculty Coordinator")
    created_at = Column(DateTime, default=datetime.utcnow)

    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")

class Result(Base):
    __tablename__ = "results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    semester = Column(Integer, nullable=False)
    academic_year = Column(String(20), default="2024-25")
    sgpa = Column(Float, default=8.5)
    cgpa = Column(Float, default=8.42)
    backlogs = Column(Integer, default=0)
    status = Column(String(20), default="PASSED")
    published_date = Column(String(50), default="2025-06-15")

    student = relationship("Student", back_populates="results")

class FeeRecord(Base):
    __tablename__ = "fee_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False)
    academic_year = Column(String(20), default="2024-2025")
    fee_type = Column(String(50), default="Tuition & Academic Fee")
    total_amount = Column(Float, default=52000.0)
    paid_amount = Column(Float, default=52000.0)
    due_amount = Column(Float, default=0.0)
    status = Column(String(20), default="PAID") # PAID, PARTIAL, DUE
    receipt_number = Column(String(50), default="SREC/FEE/2025/1042")
    payment_date = Column(String(50), default="2024-10-12")

class NewsAnnouncement(Base):
    __tablename__ = "news_announcements"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    category = Column(String(50), default="GENERAL") # FLASH, ACADEMIC, EXAM, PLACEMENT, ADMISSION
    content = Column(Text, nullable=False)
    is_flash = Column(Boolean, default=False)
    is_pinned = Column(Boolean, default=False)
    date = Column(String(50), nullable=False)
    attachment_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    department = Column(String(50), default="ALL")
    category = Column(String(50), default="TECHNICAL") # TECHNICAL, CULTURAL, WORKSHOP, SPORTS
    date = Column(String(50), nullable=False)
    time = Column(String(50), default="10:00 AM - 04:00 PM")
    location = Column(String(150), default="Main Auditorium / SREC")
    description = Column(Text, nullable=False)
    organizer = Column(String(100), default="SREC Student Council")
    registration_link = Column(String(255), nullable=True)
    is_upcoming = Column(Boolean, default=True)

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    department = Column(String(20), default="ALL")
    category = Column(String(50), nullable=False) # SYLLABUS, REGULATIONS, BROCHURE, EXAM, HANDBOOK, PLACEMENT
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(20), default="PDF")
    file_size_kb = Column(Integer, default=1250)
    academic_year = Column(String(20), default="2024-2025")
    total_pages = Column(Integer, default=12)
    indexed_chunks = Column(Integer, default=0)
    status = Column(String(20), default="PROCESSED") # PROCESSED, PROCESSING, FAILED
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    page_number = Column(Integer, default=1)
    content = Column(Text, nullable=False)
    # Stored as JSON list of floats for vector search compatibility
    embedding_vector = Column(JSON, nullable=True)

    document = relationship("Document", back_populates="chunks")

class PlacementRecord(Base):
    __tablename__ = "placement_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    academic_year = Column(String(20), default="2024-25")
    company_name = Column(String(100), nullable=False)
    logo_url = Column(String(255), nullable=True)
    package_lpa = Column(Float, nullable=False)
    students_placed = Column(Integer, default=15)
    roles = Column(String(150), default="Software Development Engineer")

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True)
    session_type = Column(String(50), default="COLLEGE_ASSISTANT") # COLLEGE_ASSISTANT, STUDY, PLACEMENT
    title = Column(String(200), default="Conversation")
    messages = Column(JSON, default=list) # List of {"role": "user"|"assistant", "content": str, "sources": list}
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class AccountActivationToken(Base):
    __tablename__ = "account_activation_tokens"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    token_hash = Column(String(64), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="activation_tokens")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    token_hash = Column(String(64), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reset_tokens")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    refresh_token_hash = Column(String(64), unique=True, index=True, nullable=False)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(255), nullable=True)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    action = Column(String(50), nullable=False, index=True)  # LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, ACCOUNT_CREATED, etc.
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(255), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="audit_logs")

class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assignment_id = Column(String(36), ForeignKey("assignments.id"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False, index=True)
    file_name = Column(String(255), nullable=True)
    file_url = Column(String(500), nullable=True)
    submitted_text = Column(Text, nullable=True)
    status = Column(String(20), default="SUBMITTED")  # SUBMITTED, GRADED, LATE, RESUBMITTED
    scored_marks = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    graded_at = Column(DateTime, nullable=True)
    graded_by = Column(String(100), nullable=True)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student", back_populates="submissions")

class Exam(Base):
    __tablename__ = "exams"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    subject_code = Column(String(20), nullable=False, index=True)
    subject_name = Column(String(150), nullable=False)
    department = Column(String(20), nullable=False, index=True)
    year = Column(Integer, default=3)
    semester = Column(Integer, default=6)
    exam_type = Column(String(30), nullable=False) # MID-1, MID-2, SEMESTER, LAB_INTERNAL, LAB_EXTERNAL
    exam_date = Column(String(50), nullable=False) # e.g. "2025-04-10"
    start_time = Column(String(30), default="10:00 AM")
    end_time = Column(String(30), default="01:00 PM")
    duration_minutes = Column(Integer, default=180)
    max_marks = Column(Float, default=70.0)
    room_number = Column(String(50), default="Main Exam Hall - Block A")
    academic_year = Column(String(20), default="2024-25")
    instructions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Timetable(Base):
    __tablename__ = "timetable"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    department = Column(String(20), nullable=False, index=True)
    year = Column(Integer, default=3)
    semester = Column(Integer, default=6)
    section = Column(String(10), default="A")
    day_of_week = Column(String(20), nullable=False, index=True) # Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
    period_number = Column(Integer, nullable=False)              # 1 to 7
    start_time = Column(String(20), nullable=False)              # e.g. "09:30 AM"
    end_time = Column(String(20), nullable=False)                # e.g. "10:30 AM"
    subject_code = Column(String(20), nullable=False)
    subject_name = Column(String(150), nullable=False)
    faculty_name = Column(String(100), nullable=False)
    room_number = Column(String(50), default="CS-302")
    is_lab = Column(Boolean, default=False)
    academic_year = Column(String(20), default="2024-25")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True) # Null for broadcast
    target_role = Column(String(20), nullable=True, default="ALL") # STUDENT, FACULTY, ADMIN, ALL
    target_department = Column(String(20), nullable=True, default="ALL") # CSE, CSM, ALL
    type = Column(String(50), default="ANNOUNCEMENT") # ASSIGNMENT, EXAM, RESULT, ATTENDANCE, PLACEMENT, ANNOUNCEMENT, EVENT, SYSTEM
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="notifications")

class StudentResume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    parsed_text = Column(Text, nullable=True)
    ats_score = Column(Integer, default=75)
    target_role = Column(String(100), default="Software Development Engineer")
    extracted_skills = Column(JSON, default=list)
    education_summary = Column(String(255), nullable=True)
    experience_level = Column(String(100), default="Fresher")
    missing_skills = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="resumes")

class AIEvaluation(Base):
    __tablename__ = "ai_evaluations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    session_type = Column(String(50), default="COLLEGE_ASSISTANT") # COLLEGE_ASSISTANT, STUDY, PLACEMENT
    query = Column(Text, nullable=False)
    response_snippet = Column(Text, nullable=True)
    response_time_ms = Column(Integer, default=240)
    has_relevant_docs = Column(Boolean, default=True)
    retrieved_docs_count = Column(Integer, default=2)
    sources = Column(JSON, default=list)
    thumbs_up = Column(Boolean, nullable=True)
    user_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", foreign_keys=[user_id])
