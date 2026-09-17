import sys
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine, Base
from app.models.all_models import (
    User, Student, Faculty, Department, Course, Subject, Attendance, Marks,
    Assignment, AssignmentSubmission, Exam, Result, FeeRecord, Timetable,
    NewsAnnouncement, Event, Document, DocumentChunk, PlacementRecord,
    Notification, StudentResume, AIEvaluation,
    AccountActivationToken, PasswordResetToken, UserSession, AuditLog
)
from app.core.security import get_password_hash, hash_token

def init_db(force_reset: bool = False):
    if force_reset:
        print("Dropping existing tables to re-align schema...")
        Base.metadata.drop_all(bind=engine)

    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        if not force_reset and db.query(User).filter(User.email == "admin@srec.local").first():
            print("Database already seeded with SREC accounts.")
            return

        print("Seeding SREC Smart Campus database with official college records & dev accounts...")

        # 1. Departments first
        departments_data = [
            {
                "code": "CSE",
                "name": "Computer Science & Engineering",
                "short_name": "CSE",
                "description": "Established in 2007, NBA accredited. Premier computing education with state-of-the-art AI, Cloud, and Data Analytics laboratories.",
                "hod_name": "Dr. K. Subba Reddy",
                "hod_email": "hodcse@srecnandyal.edu.in",
                "established_year": 2007,
                "intake": 180,
                "total_faculty": 32,
                "labs_count": 8
            },
            {
                "code": "CSM",
                "name": "CSE (Artificial Intelligence & Machine Learning)",
                "short_name": "CSE AI & ML",
                "description": "Focuses on deep learning architectures, cognitive computing, NLP, computer vision, and autonomous intelligent systems.",
                "hod_name": "Dr. P. Mallikarjuna",
                "hod_email": "hodcsm@srecnandyal.edu.in",
                "established_year": 2020,
                "intake": 120,
                "total_faculty": 18,
                "labs_count": 5
            },
            {
                "code": "CSD",
                "name": "CSE (Data Science)",
                "short_name": "CSE Data Science",
                "description": "Specialized curriculum addressing big data infrastructure, predictive modeling, statistical learning, and business intelligence.",
                "hod_name": "Dr. V. Ramanjaneyulu",
                "hod_email": "hodcsd@srecnandyal.edu.in",
                "established_year": 2021,
                "intake": 60,
                "total_faculty": 12,
                "labs_count": 4
            },
            {
                "code": "ECE",
                "name": "Electronics & Communication Engineering",
                "short_name": "ECE",
                "description": "NBA accredited program with Cadence VLSI labs, Texas Instruments Embedded Systems center, and IoT innovation hubs.",
                "hod_name": "Dr. G. Ramesh",
                "hod_email": "hodece@srecnandyal.edu.in",
                "established_year": 2007,
                "intake": 120,
                "total_faculty": 24,
                "labs_count": 7
            },
            {
                "code": "EEE",
                "name": "Electrical & Electronics Engineering",
                "short_name": "EEE",
                "description": "Emphasizes renewable power systems, smart grid dynamics, electric vehicle technologies, and industrial drives.",
                "hod_name": "Dr. M. Suresh",
                "hod_email": "hodeee@srecnandyal.edu.in",
                "established_year": 2007,
                "intake": 60,
                "total_faculty": 14,
                "labs_count": 6
            },
            {
                "code": "MBA",
                "name": "Master of Business Administration",
                "short_name": "MBA",
                "description": "Postgraduate leadership program specializing in Finance, Marketing, Human Resources, and Business Analytics.",
                "hod_name": "Dr. S. K. Basha",
                "hod_email": "hodmba@srecnandyal.edu.in",
                "established_year": 2008,
                "intake": 120,
                "total_faculty": 16,
                "labs_count": 2
            },
            {
                "code": "MCA",
                "name": "Master of Computer Applications",
                "short_name": "MCA",
                "description": "Comprehensive postgraduate course fostering advanced software engineering, cloud solutions, and full-stack development.",
                "hod_name": "Dr. T. Venkataramana",
                "hod_email": "hodmca@srecnandyal.edu.in",
                "established_year": 2008,
                "intake": 60,
                "total_faculty": 10,
                "labs_count": 3
            }
        ]

        dept_objs = {}
        for dept_dict in departments_data:
            d = Department(**dept_dict)
            db.add(d)
            db.flush()
            dept_objs[d.code] = d

        cse_dept = dept_objs.get("CSE")
        ece_dept = dept_objs.get("ECE")

        # 1b. Courses
        courses_data = [
            {"code": "BTECH-CSE", "name": "B.Tech Computer Science & Engineering", "degree": "B.Tech", "department_id": dept_objs.get("CSE").id if dept_objs.get("CSE") else None, "duration_years": 4, "total_semesters": 8, "intake": 180},
            {"code": "BTECH-CSM", "name": "B.Tech CSE (Artificial Intelligence & Machine Learning)", "degree": "B.Tech", "department_id": dept_objs.get("CSM").id if dept_objs.get("CSM") else None, "duration_years": 4, "total_semesters": 8, "intake": 120},
            {"code": "BTECH-CSD", "name": "B.Tech CSE (Data Science)", "degree": "B.Tech", "department_id": dept_objs.get("CSD").id if dept_objs.get("CSD") else None, "duration_years": 4, "total_semesters": 8, "intake": 60},
            {"code": "BTECH-ECE", "name": "B.Tech Electronics & Communication Engineering", "degree": "B.Tech", "department_id": dept_objs.get("ECE").id if dept_objs.get("ECE") else None, "duration_years": 4, "total_semesters": 8, "intake": 120},
            {"code": "BTECH-EEE", "name": "B.Tech Electrical & Electronics Engineering", "degree": "B.Tech", "department_id": dept_objs.get("EEE").id if dept_objs.get("EEE") else None, "duration_years": 4, "total_semesters": 8, "intake": 60},
            {"code": "MBA-GEN", "name": "Master of Business Administration (MBA)", "degree": "MBA", "department_id": dept_objs.get("MBA").id if dept_objs.get("MBA") else None, "duration_years": 2, "total_semesters": 4, "intake": 120},
            {"code": "MCA-GEN", "name": "Master of Computer Applications (MCA)", "degree": "MCA", "department_id": dept_objs.get("CSE").id if dept_objs.get("CSE") else None, "duration_years": 2, "total_semesters": 4, "intake": 60},
        ]
        for c in courses_data:
            db.add(Course(**c))

        # 2. Users & Development Seed Accounts (DEVELOPMENT ONLY)
        now = datetime.utcnow()

        # Admin accounts
        admin_local = User(
            user_code="ADM-001",
            email="admin@srec.local",
            full_name="Dr. M. Venkata Subramanyam",
            password_hash=get_password_hash("Admin@Srec2026"),
            role="ADMIN",
            status="ACTIVE",
            department_id=cse_dept.id if cse_dept else None,
            first_login=False,
            email_verified=True,
            is_active=True,
            mobile="+91-9848012345",
            created_at=now
        )
        db.add(admin_local)

        admin_edu = User(
            user_code="ADM-002",
            email="admin@srecnandyal.edu.in",
            full_name="Dr. M. Venkata Subramanyam",
            password_hash=get_password_hash("admin123"),
            role="ADMIN",
            status="ACTIVE",
            department_id=cse_dept.id if cse_dept else None,
            first_login=False,
            email_verified=True,
            is_active=True,
            mobile="+91-9848012345",
            created_at=now
        )
        db.add(admin_edu)

        # Faculty accounts
        faculty_local = User(
            user_code="SREC-FAC-0104",
            email="faculty@srec.local",
            full_name="Dr. K. Subba Reddy",
            password_hash=get_password_hash("Faculty@Srec2026"),
            role="FACULTY",
            status="ACTIVE",
            department_id=cse_dept.id if cse_dept else None,
            first_login=False,
            email_verified=True,
            is_active=True,
            mobile="+91-9866308475",
            created_at=now
        )
        db.add(faculty_local)
        db.flush()

        faculty_profile = Faculty(
            user_id=faculty_local.id,
            employee_id="SREC-FAC-0104",
            department_id=cse_dept.id if cse_dept else None,
            department="CSE",
            designation="Professor & Head of Department",
            qualification="Ph.D. (Computer Science & Engineering)",
            specialization="Distributed Computing & Machine Learning",
            experience_years=16,
            cabin_number="CS-Block Room 204",
            phone="+91-9866308475",
            joining_year=2010
        )
        db.add(faculty_profile)

        faculty_edu = User(
            user_code="SREC-FAC-0105",
            email="faculty@srecnandyal.edu.in",
            full_name="Dr. K. Subba Reddy",
            password_hash=get_password_hash("faculty123"),
            role="FACULTY",
            status="ACTIVE",
            department_id=cse_dept.id if cse_dept else None,
            first_login=False,
            email_verified=True,
            is_active=True,
            mobile="+91-9866308475",
            created_at=now
        )
        db.add(faculty_edu)

        # Student accounts
        student_local = User(
            user_code="22X51A0501",
            email="student@srec.local",
            full_name="Sai Teja Reddy",
            password_hash=get_password_hash("Student@Srec2026"),
            role="STUDENT",
            status="ACTIVE",
            department_id=cse_dept.id if cse_dept else None,
            first_login=False,
            email_verified=True,
            is_active=True,
            mobile="+91-9490123456",
            created_at=now
        )
        db.add(student_local)
        db.flush()

        student_profile = Student(
            user_id=student_local.id,
            roll_number="22X51A0501",
            student_id="22X51A0501",
            department_id=cse_dept.id if cse_dept else None,
            department="CSE",
            year=3,
            semester=6,
            section="A",
            admission_year=2022,
            cgpa=8.64,
            credits_earned=118,
            phone="+91-9490123456",
            address="Nerawada, Nandyal, Andhra Pradesh"
        )
        db.add(student_profile)

        student_edu = User(
            user_code="22X51A0502",
            email="student@srecnandyal.edu.in",
            full_name="Sai Teja Reddy",
            password_hash=get_password_hash("student123"),
            role="STUDENT",
            status="ACTIVE",
            department_id=cse_dept.id if cse_dept else None,
            first_login=False,
            email_verified=True,
            is_active=True,
            mobile="+91-9490123456",
            created_at=now
        )
        db.add(student_edu)

        # 3. Special Status Test Accounts (INVITED, SUSPENDED, DEACTIVATED)
        # Invited Student (for testing /activate-account)
        invited_student = User(
            user_code="23CSE099",
            email="invited.student@srec.local",
            full_name="Ananya Sharma",
            password_hash=get_password_hash("TempPass#2026Invited"),
            role="STUDENT",
            status="INVITED",
            department_id=cse_dept.id if cse_dept else None,
            first_login=True,
            email_verified=False,
            mobile="+91-9876543210",
            created_at=now
        )
        db.add(invited_student)
        db.flush()

        invited_profile = Student(
            user_id=invited_student.id,
            roll_number="23CSE099",
            student_id="23CSE099",
            department_id=cse_dept.id if cse_dept else None,
            department="CSE",
            year=1,
            semester=2,
            section="B",
            admission_year=2023,
            cgpa=0.0,
            credits_earned=22,
            phone="+91-9876543210",
            address="Nandyal, Andhra Pradesh"
        )
        db.add(invited_profile)

        # Seed known activation token for easy testing
        known_raw_token = "DEV_ACTIVATION_TOKEN_23CSE099"
        dev_act_token = AccountActivationToken(
            user_id=invited_student.id,
            token_hash=hash_token(known_raw_token),
            expires_at=now + timedelta(days=7),
            created_at=now
        )
        db.add(dev_act_token)

        # Suspended Student (for testing suspension message)
        suspended_student = User(
            user_code="21ECE045",
            email="suspended.student@srec.local",
            full_name="Ramesh Kumar",
            password_hash=get_password_hash("Student@Srec2026"),
            role="STUDENT",
            status="SUSPENDED",
            department_id=ece_dept.id if ece_dept else None,
            first_login=False,
            email_verified=True,
            mobile="+91-9811223344",
            created_at=now
        )
        db.add(suspended_student)

        # Deactivated Faculty (for testing deactivation message)
        deactivated_faculty = User(
            user_code="SREC-FAC-0012",
            email="deactivated.faculty@srec.local",
            full_name="Dr. P. Rajesh",
            password_hash=get_password_hash("Faculty@Srec2026"),
            role="FACULTY",
            status="DEACTIVATED",
            department_id=cse_dept.id if cse_dept else None,
            first_login=False,
            email_verified=True,
            is_active=False,
            mobile="+91-9988776655",
            created_at=now
        )
        db.add(deactivated_faculty)

        # 4. Student Attendance
        attendances = [
            {"subject_code": "20A05601T", "subject_name": "Database Management Systems", "total_classes": 48, "attended_classes": 43, "percentage": 89.6},
            {"subject_code": "20A05602T", "subject_name": "Operating Systems", "total_classes": 46, "attended_classes": 39, "percentage": 84.8},
            {"subject_code": "20A05603T", "subject_name": "Machine Learning & AI", "total_classes": 50, "attended_classes": 46, "percentage": 92.0},
            {"subject_code": "20A05604T", "subject_name": "Computer Networks", "total_classes": 45, "attended_classes": 35, "percentage": 77.8},
            {"subject_code": "20A05605T", "subject_name": "Cloud Computing Technologies", "total_classes": 44, "attended_classes": 38, "percentage": 86.4},
            {"subject_code": "20A52201", "subject_name": "Universal Human Values & Professional Ethics", "total_classes": 30, "attended_classes": 29, "percentage": 96.7}
        ]
        for att in attendances:
            att_obj = Attendance(
                student_id=student_profile.id,
                **att
            )
            db.add(att_obj)

        # 5. Student Marks
        marks_data = [
            {"subject_code": "20A05601T", "subject_name": "Database Management Systems", "exam_type": "MID-1", "scored_marks": 27.5, "max_marks": 30.0, "grade": "A+"},
            {"subject_code": "20A05602T", "subject_name": "Operating Systems", "exam_type": "MID-1", "scored_marks": 25.0, "max_marks": 30.0, "grade": "A"},
            {"subject_code": "20A05603T", "subject_name": "Machine Learning & AI", "exam_type": "MID-1", "scored_marks": 29.0, "max_marks": 30.0, "grade": "O"},
            {"subject_code": "20A05604T", "subject_name": "Computer Networks", "exam_type": "MID-1", "scored_marks": 24.0, "max_marks": 30.0, "grade": "B+"},
            {"subject_code": "20A05605T", "subject_name": "Cloud Computing Technologies", "exam_type": "MID-1", "scored_marks": 28.0, "max_marks": 30.0, "grade": "A+"}
        ]
        for m in marks_data:
            db.add(Marks(student_id=student_profile.id, **m))

        # 6. Semester Results
        results_data = [
            {"semester": 1, "academic_year": "2022-23", "sgpa": 8.42, "cgpa": 8.42, "backlogs": 0, "status": "PASSED", "published_date": "2023-03-15"},
            {"semester": 2, "academic_year": "2022-23", "sgpa": 8.75, "cgpa": 8.58, "backlogs": 0, "status": "PASSED", "published_date": "2023-08-20"},
            {"semester": 3, "academic_year": "2023-24", "sgpa": 8.60, "cgpa": 8.59, "backlogs": 0, "status": "PASSED", "published_date": "2024-02-18"},
            {"semester": 4, "academic_year": "2023-24", "sgpa": 8.80, "cgpa": 8.64, "backlogs": 0, "status": "PASSED", "published_date": "2024-07-25"},
            {"semester": 5, "academic_year": "2024-25", "sgpa": 8.65, "cgpa": 8.64, "backlogs": 0, "status": "PASSED", "published_date": "2025-01-30"}
        ]
        for r in results_data:
            db.add(Result(student_id=student_profile.id, **r))

        # 7. Fee Records
        fees_data = [
            {"academic_year": "2024-25", "fee_type": "Tuition Fee", "total_amount": 70000.0, "paid_amount": 70000.0, "due_amount": 0.0, "status": "PAID", "receipt_number": "SREC/REC/2024/0981", "payment_date": "2024-08-10"},
            {"academic_year": "2024-25", "fee_type": "Special Lab & Infrastructure Fee", "total_amount": 15000.0, "paid_amount": 15000.0, "due_amount": 0.0, "status": "PAID", "receipt_number": "SREC/REC/2024/1142", "payment_date": "2024-08-10"},
            {"academic_year": "2024-25", "fee_type": "University & Autonomous Exam Fee (Sem-6)", "total_amount": 2500.0, "paid_amount": 2500.0, "due_amount": 0.0, "status": "PAID", "receipt_number": "SREC/REC/2025/0129", "payment_date": "2025-01-15"},
            {"academic_year": "2024-25", "fee_type": "Bus & Transportation Fee", "total_amount": 22000.0, "paid_amount": 22000.0, "due_amount": 0.0, "status": "PAID", "receipt_number": "SREC/REC/2024/0411", "payment_date": "2024-07-28"}
        ]
        for f in fees_data:
            db.add(FeeRecord(student_id=student_profile.id, **f))

        # 8. News & Announcements
        news_data = [
            {"title": "AP EAPCET 2025: Engineering Admissions Open for SREC Nandyal", "category": "ADMISSION", "content": "Eligible candidates seeking admission into B.Tech programs can report with College Code: SREC. Official counseling and management quota application portal.", "is_flash": False, "is_pinned": True, "date": "2025-02-15"},
            {"title": "Campus Placements: TCS & Infosys Campus Recruitment Drive Results", "category": "PLACEMENT", "content": "Over 176 students from CSE, CSM, and ECE secured premier job offers in recent recruitment drives.", "is_flash": True, "is_pinned": True, "date": "2025-02-10"},
            {"title": "National Technical Symposium: SAMHITHA 2025 Announced", "category": "EVENT", "content": "Annual national tech fest featuring hackathons, paper presentations, and robotics. Registration starts soon.", "is_flash": False, "is_pinned": False, "date": "2025-02-01"}
        ]
        for n in news_data:
            db.add(NewsAnnouncement(**n))

        # 9. Events
        events_data = [
            {"title": "SAMHITHA-2025 National Technical Fest", "category": "TECHNICAL", "department": "CSE", "date": "2025-03-28", "time": "09:30 AM - 05:00 PM", "location": "Dr. A.P.J. Abdul Kalam Auditorium", "description": "Flagship tech festival featuring code sprints, paper presentations, and AI project showcase.", "is_upcoming": True},
            {"title": "Workshop on Generative AI & Large Language Models", "category": "WORKSHOP", "department": "CSM", "date": "2025-04-05", "time": "10:00 AM - 04:30 PM", "location": "Turing Advanced Computing Center", "description": "Hands-on implementation of RAG pipelines, fine-tuning, and prompt engineering.", "is_upcoming": True}
        ]
        for e in events_data:
            db.add(Event(**e))

        # 9b. Exams Schedule
        exams_data = [
            {"subject_code": "20A05601T", "subject_name": "Database Management Systems", "department": "CSE", "year": 3, "semester": 6, "exam_type": "MID-2", "exam_date": "2025-04-22", "start_time": "10:00 AM", "end_time": "12:00 PM", "duration_minutes": 120, "max_marks": 30.0, "room_number": "CS-Block Room 301"},
            {"subject_code": "20A05602T", "subject_name": "Operating Systems", "department": "CSE", "year": 3, "semester": 6, "exam_type": "MID-2", "exam_date": "2025-04-24", "start_time": "10:00 AM", "end_time": "12:00 PM", "duration_minutes": 120, "max_marks": 30.0, "room_number": "CS-Block Room 302"},
            {"subject_code": "20A05603T", "subject_name": "Machine Learning & AI", "department": "CSE", "year": 3, "semester": 6, "exam_type": "MID-2", "exam_date": "2025-04-26", "start_time": "10:00 AM", "end_time": "12:00 PM", "duration_minutes": 120, "max_marks": 30.0, "room_number": "CS-Block Room 301"},
            {"subject_code": "20A05604T", "subject_name": "Computer Networks", "department": "CSE", "year": 3, "semester": 6, "exam_type": "MID-2", "exam_date": "2025-04-28", "start_time": "10:00 AM", "end_time": "12:00 PM", "duration_minutes": 120, "max_marks": 30.0, "room_number": "CS-Block Room 303"},
            {"subject_code": "20A05605T", "subject_name": "Cloud Computing Technologies", "department": "CSE", "year": 3, "semester": 6, "exam_type": "MID-2", "exam_date": "2025-04-30", "start_time": "10:00 AM", "end_time": "12:00 PM", "duration_minutes": 120, "max_marks": 30.0, "room_number": "CS-Block Room 304"}
        ]
        for ex in exams_data:
            db.add(Exam(**ex))

        # 9c. Timetable
        timetable_entries = [
            {"department": "CSE", "year": 3, "semester": 6, "section": "A", "day_of_week": "Monday", "period_number": 1, "start_time": "09:30 AM", "end_time": "10:30 AM", "subject_code": "20A05601T", "subject_name": "Database Management Systems", "faculty_name": "Dr. K. Subba Reddy", "room_number": "CS-302"},
            {"department": "CSE", "year": 3, "semester": 6, "section": "A", "day_of_week": "Monday", "period_number": 2, "start_time": "10:30 AM", "end_time": "11:30 AM", "subject_code": "20A05602T", "subject_name": "Operating Systems", "faculty_name": "Prof. S. Suresh", "room_number": "CS-302"},
            {"department": "CSE", "year": 3, "semester": 6, "section": "A", "day_of_week": "Monday", "period_number": 3, "start_time": "11:45 AM", "end_time": "12:45 PM", "subject_code": "20A05603T", "subject_name": "Machine Learning & AI", "faculty_name": "Dr. P. Mallikarjuna", "room_number": "CS-302"},
            {"department": "CSE", "year": 3, "semester": 6, "section": "A", "day_of_week": "Monday", "period_number": 4, "start_time": "01:30 PM", "end_time": "04:30 PM", "subject_code": "20A05607P", "subject_name": "AI & Machine Learning Lab", "faculty_name": "Dr. P. Mallikarjuna", "room_number": "AI Lab - 2", "is_lab": True},
            {"department": "CSE", "year": 3, "semester": 6, "section": "A", "day_of_week": "Tuesday", "period_number": 1, "start_time": "09:30 AM", "end_time": "10:30 AM", "subject_code": "20A05604T", "subject_name": "Computer Networks", "faculty_name": "Dr. G. Ramesh", "room_number": "CS-302"},
            {"department": "CSE", "year": 3, "semester": 6, "section": "A", "day_of_week": "Tuesday", "period_number": 2, "start_time": "10:30 AM", "end_time": "11:30 AM", "subject_code": "20A05605T", "subject_name": "Cloud Computing Technologies", "faculty_name": "Dr. V. Ramanjaneyulu", "room_number": "CS-302"},
            {"department": "CSE", "year": 3, "semester": 6, "section": "A", "day_of_week": "Wednesday", "period_number": 1, "start_time": "09:30 AM", "end_time": "10:30 AM", "subject_code": "20A05601T", "subject_name": "Database Management Systems", "faculty_name": "Dr. K. Subba Reddy", "room_number": "CS-302"},
            {"department": "CSE", "year": 3, "semester": 6, "section": "A", "day_of_week": "Thursday", "period_number": 1, "start_time": "09:30 AM", "end_time": "10:30 AM", "subject_code": "20A05603T", "subject_name": "Machine Learning & AI", "faculty_name": "Dr. P. Mallikarjuna", "room_number": "CS-302"},
            {"department": "CSE", "year": 3, "semester": 6, "section": "A", "day_of_week": "Friday", "period_number": 1, "start_time": "09:30 AM", "end_time": "10:30 AM", "subject_code": "20A05602T", "subject_name": "Operating Systems", "faculty_name": "Prof. S. Suresh", "room_number": "CS-302"}
        ]
        for t in timetable_entries:
            db.add(Timetable(**t))

        # 9d. Assignments & Submissions
        assign_dbms = Assignment(
            title="Database Normalization & BCNF Case Study",
            department="CSE",
            subject_code="20A05601T",
            subject_name="Database Management Systems",
            year=3,
            semester=6,
            due_date="2025-04-15",
            max_marks=10,
            description="Decompose a given relational schema from 1NF to BCNF with dependency preservation proof.",
            created_by="Dr. K. Subba Reddy"
        )
        db.add(assign_dbms)
        db.flush()

        assign_ml = Assignment(
            title="Supervised Learning: SVM vs Decision Trees on Healthcare Dataset",
            department="CSE",
            subject_code="20A05603T",
            subject_name="Machine Learning & AI",
            year=3,
            semester=6,
            due_date="2025-04-20",
            max_marks=10,
            description="Train and evaluate Support Vector Machine and Random Forest classifiers with confusion matrix and ROC curves.",
            created_by="Faculty Coordinator"
        )
        db.add(assign_ml)
        db.flush()

        # Seed submission for student_profile
        sub_dbms = AssignmentSubmission(
            assignment_id=assign_dbms.id,
            student_id=student_profile.id,
            file_name="22X51A0501_DBMS_Assignment1.pdf",
            file_url="/uploads/submissions/22X51A0501_DBMS_Assignment1.pdf",
            submitted_text="Submitted the complete normalization proof with 3NF and BCNF table designs.",
            status="GRADED",
            scored_marks=9.5,
            feedback="Excellent relational algebra notation and correct dependency preservation proof.",
            submitted_at=now - timedelta(days=2),
            graded_at=now - timedelta(days=1),
            graded_by="Dr. K. Subba Reddy"
        )
        db.add(sub_dbms)

        # 9e. Notifications
        notifications_data = [
            {"user_id": student_local.id, "target_role": "STUDENT", "target_department": "CSE", "type": "EXAM", "title": "B.Tech III Year II Sem MID-2 Examination Schedule", "message": "MID-2 Theory examinations commence from 22nd April 2025. Please review your hall schedule.", "link": "/student/exams"},
            {"user_id": student_local.id, "target_role": "STUDENT", "target_department": "CSE", "type": "ASSIGNMENT", "title": "DBMS Assignment 1 Graded", "message": "Dr. K. Subba Reddy graded your Database Normalization submission: Scored 9.5/10.", "link": "/student/assignments"},
            {"user_id": student_local.id, "target_role": "STUDENT", "target_department": "ALL", "type": "PLACEMENT", "title": "TCS Digital Campus Drive Registrations Open", "message": "Final phase registrations for TCS Digital Drive (7.5 LPA) are now live for eligible CSE/ECE students.", "link": "/student/ai-placement"},
            {"user_id": faculty_local.id, "target_role": "FACULTY", "target_department": "CSE", "type": "ACADEMIC", "title": "Mid-Term Attendance Audit", "message": "Please ensure attendance logs for Semester VI CSE are locked and submitted to Examination Cell.", "link": "/faculty/attendance"}
        ]
        for notif in notifications_data:
            db.add(Notification(**notif))

        # 10. Documents
        docs_data = [
            {"title": "SREC Autonomous Academic Regulations (R20)", "department": "ALL", "category": "REGULATIONS", "file_name": "SREC_Autonomous_R20_Regulations.pdf", "file_type": "PDF", "file_size_kb": 2450, "academic_year": "2020-2024", "total_pages": 48, "indexed_chunks": 42, "status": "PROCESSED"},
            {"title": "B.Tech CSE III & IV Year Curriculum & Syllabus", "department": "CSE", "category": "SYLLABUS", "file_name": "SREC_BTech_CSE_Course_Curriculum.pdf", "file_type": "PDF", "file_size_kb": 1820, "academic_year": "2024-2025", "total_pages": 36, "indexed_chunks": 32, "status": "PROCESSED"}
        ]
        for d in docs_data:
            db.add(Document(**d))

        # 11. Placement Stats
        placements_data = [
            {"academic_year": "2024-25", "company_name": "Tata Consultancy Services (TCS)", "package_lpa": 7.5, "students_placed": 94, "roles": "Ninja & Digital Engineer"},
            {"academic_year": "2024-25", "company_name": "Infosys Technologies", "package_lpa": 6.5, "students_placed": 82, "roles": "Systems Engineer & Specialist"},
            {"academic_year": "2024-25", "company_name": "Capgemini", "package_lpa": 5.8, "students_placed": 65, "roles": "Software Analyst"},
            {"academic_year": "2024-25", "company_name": "Wipro Technologies", "package_lpa": 5.5, "students_placed": 54, "roles": "Project Engineer"},
            {"academic_year": "2024-25", "company_name": "Tech Mahindra", "package_lpa": 5.2, "students_placed": 42, "roles": "Associate Software Engineer"}
        ]
        for p in placements_data:
            db.add(PlacementRecord(**p))

        # 12. Initial Audit Log
        db.add(AuditLog(
            user_id=admin_local.id,
            action="SYSTEM_INITIALIZED",
            ip_address="127.0.0.1",
            user_agent="System/Seed",
            details="Initialized SREC Smart Campus database with official institutional records."
        ))

        db.commit()
        print("SREC Smart Campus database seeding completed successfully!")
        print("\n=== SREC DEVELOPMENT SEED ACCOUNTS (DEVELOPMENT ONLY) ===")
        print("1. ADMIN:   admin@srec.local   | Password: Admin@Srec2026   | User Code: ADM-001")
        print("2. FACULTY: faculty@srec.local | Password: Faculty@Srec2026 | User Code: SREC-FAC-0104")
        print("3. STUDENT: student@srec.local | Password: Student@Srec2026 | User Code: 22X51A0501")
        print("4. INVITED: invited.student@srec.local | Token: DEV_ACTIVATION_TOKEN_23CSE099 | User Code: 23CSE099")
        print("5. SUSPENDED: suspended.student@srec.local | Password: Student@Srec2026 | User Code: 21ECE045")
        print("6. DEACTIVATED: deactivated.faculty@srec.local | User Code: SREC-FAC-0012")
        print("========================================================\n")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    force = "--reset" in sys.argv or "-r" in sys.argv
    init_db(force_reset=force)
