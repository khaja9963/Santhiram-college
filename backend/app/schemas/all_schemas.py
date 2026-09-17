from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

# Auth Schemas
class LoginRequest(BaseModel):
    # Accepts either email or user_code / roll_number / employee_id
    identifier: Optional[str] = None
    email: Optional[str] = None
    password: str

    def get_login_identifier(self) -> str:
        ident = (self.identifier or self.email or "").strip()
        return ident

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: str
    email: str
    user_code: Optional[str] = None
    status: str = "ACTIVE"
    first_login: bool = False

class UserOut(BaseModel):
    id: str
    user_code: Optional[str] = None
    email: str
    full_name: str
    name: Optional[str] = None
    role: str
    status: str = "ACTIVE"
    department_id: Optional[str] = None
    department_name: Optional[str] = None
    mobile: Optional[str] = None
    first_login: bool = False
    email_verified: bool = False
    last_login: Optional[datetime] = None
    created_at: Optional[datetime] = None
    avatar_url: Optional[str] = None
    is_active: bool = True
    student_details: Optional[Dict[str, Any]] = None
    faculty_details: Optional[Dict[str, Any]] = None

class StudentCreateAdmin(BaseModel):
    student_id: str # e.g. 23CSE001
    full_name: str
    college_email: str
    mobile_number: Optional[str] = None
    department: str
    year: int = 1
    semester: int = 1
    section: str = "A"
    admission_year: int = 2023
    status: Optional[str] = "INVITED"

class FacultyCreateAdmin(BaseModel):
    employee_id: str # e.g. SREC-CSE-012
    full_name: str
    college_email: str
    mobile_number: Optional[str] = None
    department: str
    designation: str = "Assistant Professor"
    joining_year: int = 2023
    status: Optional[str] = "INVITED"

class AdminCreateUser(BaseModel):
    user_code: str
    full_name: str
    email: str
    mobile: Optional[str] = None
    department: Optional[str] = None
    role: str = "STUDENT" # ADMIN, STUDENT, FACULTY

class TokenVerifyResponse(BaseModel):
    valid: bool
    user_id: Optional[str] = None
    user_code: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    message: Optional[str] = None

class ActivateAccountRequest(BaseModel):
    token: str
    password: str
    confirm_password: str

class ForgotPasswordRequest(BaseModel):
    identifier: str # SREC ID or registered email

class ResetPasswordRequest(BaseModel):
    token: str
    password: str
    confirm_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str

class UserStatusUpdate(BaseModel):
    status: str # ACTIVE, SUSPENDED, DEACTIVATED, GRADUATED
    reason: Optional[str] = None

class UserStatsOut(BaseModel):
    total_users: int
    students: int
    faculty: int
    admins: int
    active_users: int
    invited_users: int
    suspended_users: int
    deactivated_users: int

class AuditLogOut(BaseModel):
    id: str
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    action: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Optional[str] = None
    created_at: datetime

class ProfileUpdate(BaseModel):
    mobile: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

# Student Schemas
class StudentProfile(BaseModel):
    id: str
    roll_number: str
    full_name: str
    email: str
    department: str
    year: int
    semester: int
    section: str
    admission_year: int
    cgpa: float
    credits_earned: int
    phone: str
    address: str

class SubjectAttendance(BaseModel):
    subject_code: str
    subject_name: str
    total_classes: int
    attended_classes: int
    percentage: float

class StudentAttendanceOverview(BaseModel):
    overall_percentage: float
    total_classes: int
    total_attended: int
    is_low_attendance: bool
    subjects: List[SubjectAttendance]

class MarksRecord(BaseModel):
    subject_code: str
    subject_name: str
    exam_type: str
    scored_marks: float
    max_marks: float
    grade: str

class SemesterResult(BaseModel):
    semester: int
    academic_year: str
    sgpa: float
    cgpa: float
    backlogs: int
    status: str
    published_date: str

class FeeStatus(BaseModel):
    academic_year: str
    fee_type: str
    total_amount: float
    paid_amount: float
    due_amount: float
    status: str
    receipt_number: str
    payment_date: str

# Faculty Schemas
class AttendanceMarkItem(BaseModel):
    student_id: str
    roll_number: str
    status: str # PRESENT, ABSENT, OD

class MarkAttendanceRequest(BaseModel):
    subject_code: str
    date: str
    period: int
    records: List[AttendanceMarkItem]

class UploadMarksItem(BaseModel):
    student_id: str
    roll_number: str
    scored_marks: float
    max_marks: float

class UploadMarksRequest(BaseModel):
    subject_code: str
    exam_type: str
    marks: List[UploadMarksItem]

class CreateAssignmentRequest(BaseModel):
    title: str
    department: str
    subject_code: str
    subject_name: str
    year: int
    semester: int
    due_date: str
    max_marks: int = 10
    description: Optional[str] = None

# Public & College Schemas
class DepartmentOut(BaseModel):
    id: str
    code: str
    name: str
    short_name: str
    description: str
    hod_name: str
    hod_email: str
    established_year: int
    intake: int
    total_faculty: int
    labs_count: int

class NewsOut(BaseModel):
    id: str
    title: str
    category: str
    content: str
    is_flash: bool
    is_pinned: bool
    date: str
    attachment_url: Optional[str] = None

class EventOut(BaseModel):
    id: str
    title: str
    department: str
    category: str
    date: str
    time: str
    location: str
    description: str
    organizer: str
    registration_link: Optional[str] = None
    is_upcoming: bool

class PlacementStatOut(BaseModel):
    academic_year: str
    company_name: str
    logo_url: Optional[str] = None
    package_lpa: float
    students_placed: int
    roles: str

# RAG & AI Schemas
class Citation(BaseModel):
    document_title: str
    category: str
    page_number: int
    relevance_snippet: str

class AIChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    department: Optional[str] = None

class AIChatResponse(BaseModel):
    conversation_id: str
    answer: str
    sources: List[Citation]
    is_grounded: bool
    confidence: float

class DocumentChunkOut(BaseModel):
    id: str
    chunk_index: int
    page_number: int
    content: str

class DocumentOut(BaseModel):
    id: str
    title: str
    department: str
    category: str
    file_name: str
    file_type: str
    file_size_kb: int
    academic_year: str
    total_pages: int
    indexed_chunks: int
    status: str
    uploaded_at: datetime

# AI Study Assistant Schemas
class ConceptExplainRequest(BaseModel):
    subject: str
    topic: str
    difficulty: str = "intermediate" # beginner, intermediate, advanced

class ConceptExplainResponse(BaseModel):
    topic: str
    explanation: str
    key_points: List[str]
    real_world_analogy: str
    practice_problem: str

class QuizMCQItem(BaseModel):
    id: int
    question: str
    options: List[str] # ["A. ...", "B. ...", "C. ...", "D. ..."]
    correct_option: str # "A", "B", "C", "D"
    explanation: str

class GenerateQuizRequest(BaseModel):
    subject: str
    topic: str
    count: int = 5

class GenerateQuizResponse(BaseModel):
    subject: str
    topic: str
    questions: List[QuizMCQItem]

class EvaluateQuizRequest(BaseModel):
    subject: str
    user_answers: Dict[int, str] # question_id -> selected option letter
    questions: List[QuizMCQItem]

class EvaluateQuizResponse(BaseModel):
    score: int
    total: int
    percentage: float
    feedback: str
    breakdown: List[Dict[str, Any]]

# AI Placement Assistant Schemas
class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Software Development Engineer"

class ResumeAnalysisResponse(BaseModel):
    technical_skills: List[str]
    soft_skills: List[str]
    education_summary: str
    experience_level: str
    skill_gap: List[str]
    recommended_roles: List[str]
    improvement_suggestions: List[str]
    ats_score: int

class MockInterviewStartRequest(BaseModel):
    role_target: str
    experience_level: str # Fresher, 1-2 Years
    technology_stack: str

class MockInterviewQuestion(BaseModel):
    question_number: int
    total_questions: int
    question: str
    topic: str

class MockInterviewAnswerSubmit(BaseModel):
    question_number: int
    question: str
    student_answer: str
    role_target: str

class MockInterviewFeedback(BaseModel):
    score: int # 1 to 10
    relevance: str
    technical_depth: str
    missing_concepts: List[str]
    clarity_feedback: str
    sample_model_answer: str

# Course Schemas
class CourseCreate(BaseModel):
    code: str
    name: str
    degree: str = "B.Tech"
    department_id: Optional[str] = None
    duration_years: int = 4
    total_semesters: int = 8
    intake: int = 180
    eligibility: Optional[str] = "10+2 / AP EAPCET with Physics, Chem, Math"

class CourseOut(BaseModel):
    id: str
    code: str
    name: str
    degree: str
    department_id: Optional[str] = None
    duration_years: int
    total_semesters: int
    intake: int
    eligibility: Optional[str] = None
    created_at: Optional[datetime] = None

# Assignment Submission Schemas
class AssignmentSubmissionCreate(BaseModel):
    assignment_id: str
    file_name: Optional[str] = None
    file_url: Optional[str] = None
    submitted_text: Optional[str] = None

class AssignmentSubmissionOut(BaseModel):
    id: str
    assignment_id: str
    student_id: str
    file_name: Optional[str] = None
    file_url: Optional[str] = None
    submitted_text: Optional[str] = None
    status: str
    scored_marks: Optional[float] = None
    feedback: Optional[str] = None
    submitted_at: Optional[datetime] = None
    graded_at: Optional[datetime] = None
    graded_by: Optional[str] = None

class GradeSubmissionRequest(BaseModel):
    scored_marks: float
    feedback: Optional[str] = None

# Exam Schemas
class ExamCreate(BaseModel):
    subject_code: str
    subject_name: str
    department: str
    year: int = 3
    semester: int = 6
    exam_type: str = "MID-1" # MID-1, MID-2, SEMESTER
    exam_date: str
    start_time: str = "10:00 AM"
    end_time: str = "01:00 PM"
    duration_minutes: int = 180
    max_marks: float = 70.0
    room_number: str = "Main Exam Hall - Block A"
    academic_year: str = "2024-25"
    instructions: Optional[str] = None

class ExamOut(BaseModel):
    id: str
    subject_code: str
    subject_name: str
    department: str
    year: int
    semester: int
    exam_type: str
    exam_date: str
    start_time: str
    end_time: str
    duration_minutes: int
    max_marks: float
    room_number: str
    academic_year: str
    instructions: Optional[str] = None

# Timetable Schemas
class TimetableCreate(BaseModel):
    department: str
    year: int = 3
    semester: int = 6
    section: str = "A"
    day_of_week: str
    period_number: int
    start_time: str
    end_time: str
    subject_code: str
    subject_name: str
    faculty_name: str
    room_number: str = "CS-302"
    is_lab: bool = False
    academic_year: str = "2024-25"

class TimetableOut(BaseModel):
    id: str
    department: str
    year: int
    semester: int
    section: str
    day_of_week: str
    period_number: int
    start_time: str
    end_time: str
    subject_code: str
    subject_name: str
    faculty_name: str
    room_number: str
    is_lab: bool
    academic_year: str

# Notification Schemas
class NotificationCreate(BaseModel):
    user_id: Optional[str] = None
    target_role: Optional[str] = "ALL"
    target_department: Optional[str] = "ALL"
    type: str = "ANNOUNCEMENT"
    title: str
    message: str
    link: Optional[str] = None

class NotificationOut(BaseModel):
    id: str
    user_id: Optional[str] = None
    target_role: Optional[str] = None
    target_department: Optional[str] = None
    type: str
    title: str
    message: str
    link: Optional[str] = None
    is_read: bool
    created_at: Optional[datetime] = None

class MarkNotificationReadRequest(BaseModel):
    notification_id: str

# Student Resume Schemas
class StudentResumeOut(BaseModel):
    id: str
    student_id: str
    file_name: str
    file_path: Optional[str] = None
    ats_score: int
    target_role: str
    extracted_skills: List[str]
    education_summary: Optional[str] = None
    experience_level: Optional[str] = None
    missing_skills: List[str]
    suggestions: List[str]
    uploaded_at: Optional[datetime] = None

# AI Evaluation & Feedback Schemas
class AIFeedbackRequest(BaseModel):
    conversation_id: Optional[str] = None
    query: str
    thumbs_up: bool
    user_feedback: Optional[str] = None
    session_type: str = "COLLEGE_ASSISTANT"

class AIEvaluationStatsOut(BaseModel):
    total_queries: int
    successful_retrievals: int
    no_relevant_docs: int
    average_latency_ms: float
    thumbs_up_count: int
    thumbs_down_count: int
    positive_feedback_pct: float
