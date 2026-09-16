import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.seed import init_db

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    init_db()

def test_root_health():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "Santhiram Engineering College" in data["institution"]

def test_college_stats_and_departments():
    stats_res = client.get("/api/v1/college/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["students"] > 3000
    assert stats["departments_count"] >= 6

    depts_res = client.get("/api/v1/college/departments")
    assert depts_res.status_code == 200
    depts = depts_res.json()
    codes = [d["code"] for d in depts]
    assert "CSE" in codes
    assert "ECE" in codes

def test_login_and_rbac_tokens():
    # 1. Student login
    res_student = client.post("/api/v1/auth/login", json={
        "email": "student@srecnandyal.edu.in",
        "password": "student123"
    })
    assert res_student.status_code == 200
    student_data = res_student.json()
    assert student_data["role"] == "STUDENT"
    student_token = student_data["access_token"]

    # 2. Faculty login
    res_faculty = client.post("/api/v1/auth/login", json={
        "email": "faculty@srecnandyal.edu.in",
        "password": "faculty123"
    })
    assert res_faculty.status_code == 200
    assert res_faculty.json()["role"] == "FACULTY"

    # 3. Admin login
    res_admin = client.post("/api/v1/auth/login", json={
        "email": "admin@srecnandyal.edu.in",
        "password": "admin123"
    })
    assert res_admin.status_code == 200
    admin_token = res_admin.json()["access_token"]

    # 4. RBAC Guard: Student CANNOT access Admin Dashboard Stats
    student_admin_attempt = client.get(
        "/api/v1/admin/dashboard-stats",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert student_admin_attempt.status_code == 403

    # 5. Admin CAN access Admin Dashboard Stats
    admin_stats = client.get(
        "/api/v1/admin/dashboard-stats",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert admin_stats.status_code == 200
    assert admin_stats.json()["knowledge_base_status"] == "ONLINE"

def test_student_endpoints():
    res_student = client.post("/api/v1/auth/login", json={
        "email": "student@srecnandyal.edu.in",
        "password": "student123"
    })
    token = res_student.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Attendance
    att_res = client.get("/api/v1/student/attendance", headers=headers)
    assert att_res.status_code == 200
    att_data = att_res.json()
    assert att_data["overall_percentage"] > 70
    assert len(att_data["subjects"]) >= 4

    # Marks
    marks_res = client.get("/api/v1/student/marks", headers=headers)
    assert marks_res.status_code == 200
    assert len(marks_res.json()) >= 3

def test_ai_rag_grounding_and_citations():
    # Query with college fact
    res = client.post("/api/v1/ai/chat", json={
        "message": "What is the admission eligibility and process at SREC?"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["is_grounded"] is True
    assert len(data["sources"]) > 0
    assert "EAPCET" in data["answer"]
    assert "SREC Admission Brochure" in data["sources"][0]["document_title"]

    # Unknown query should strictly not hallucinate
    unknown_res = client.post("/api/v1/ai/chat", json={
        "message": "What is the astrophysics rocket launch schedule for Mars mission at SREC?"
    })
    assert unknown_res.status_code == 200
    unknown_data = unknown_res.json()
    assert "couldn't find this information" in unknown_data["answer"].lower()
    assert unknown_data["is_grounded"] is False

def test_ai_study_assistant():
    quiz_res = client.post("/api/v1/ai/study/quiz", json={
        "subject": "DBMS",
        "topic": "Normalization and ACID properties",
        "count": 3
    })
    assert quiz_res.status_code == 200
    quiz_data = quiz_res.json()
    assert len(quiz_data["questions"]) == 3
    assert len(quiz_data["questions"][0]["options"]) == 4

def test_ai_placement_assistant():
    resume_sample = """
    Sai Teja Reddy
    B.Tech in Computer Science and Engineering, Santhiram Engineering College, CGPA: 8.64
    Technical Skills: Python, FastAPI, PostgreSQL, React, Git, Data Structures and Algorithms
    Projects: Built an intelligent college campus management system with RAG and vector search.
    """
    res = client.post("/api/v1/ai/placement/analyze-resume", json={
        "resume_text": resume_sample,
        "target_role": "Python Developer"
    })
    assert res.status_code == 200
    data = res.json()
    assert "Python" in data["technical_skills"]
    assert data["ats_score"] > 60
    assert len(data["recommended_roles"]) >= 1
