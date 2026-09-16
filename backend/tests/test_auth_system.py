import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_success_and_roles():
    # 1. Admin login with email
    res = client.post("/api/v1/auth/login", json={
        "identifier": "admin@srec.local",
        "password": "Admin@Srec2026"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "ADMIN"
    assert data["user_code"] == "ADM-001"
    assert "access_token" in data

    # 2. Student login with user code
    res = client.post("/api/v1/auth/login", json={
        "identifier": "22X51A0501",
        "password": "Student@Srec2026"
    })
    assert res.status_code == 200
    assert res.json()["role"] == "STUDENT"

    # 3. Faculty login with employee ID
    res = client.post("/api/v1/auth/login", json={
        "identifier": "SREC-FAC-0104",
        "password": "Faculty@Srec2026"
    })
    assert res.status_code == 200
    assert res.json()["role"] == "FACULTY"


def test_login_failures_and_statuses():
    # Wrong password
    res = client.post("/api/v1/auth/login", json={
        "identifier": "admin@srec.local",
        "password": "WrongPassword!99"
    })
    assert res.status_code == 401
    assert "Unable to sign in" in res.json()["detail"]

    # Unknown user (generic error)
    res = client.post("/api/v1/auth/login", json={
        "identifier": "unknown.user.99@srec.local",
        "password": "AnyPassword!99"
    })
    assert res.status_code == 401
    assert "Unable to sign in" in res.json()["detail"]

    # Invited account
    res = client.post("/api/v1/auth/login", json={
        "identifier": "invited.student@srec.local",
        "password": "TempPass#2026Invited"
    })
    assert res.status_code == 403
    assert "Please activate your account before logging in" in res.json()["detail"]

    # Suspended account
    res = client.post("/api/v1/auth/login", json={
        "identifier": "suspended.student@srec.local",
        "password": "Student@Srec2026"
    })
    assert res.status_code == 403
    assert "temporarily suspended" in res.json()["detail"]

    # Deactivated account
    res = client.post("/api/v1/auth/login", json={
        "identifier": "deactivated.faculty@srec.local",
        "password": "Faculty@Srec2026"
    })
    assert res.status_code == 403
    assert "no longer active" in res.json()["detail"]


def test_rbac_backend_protection():
    # Login as student
    student_res = client.post("/api/v1/auth/login", json={
        "identifier": "student@srec.local",
        "password": "Student@Srec2026"
    })
    student_token = student_res.json()["access_token"]

    # Login as faculty
    faculty_res = client.post("/api/v1/auth/login", json={
        "identifier": "faculty@srec.local",
        "password": "Faculty@Srec2026"
    })
    faculty_token = faculty_res.json()["access_token"]

    # 1. Student accessing admin APIs must be 403 Forbidden
    res = client.get("/api/v1/admin/users", headers={"Authorization": f"Bearer {student_token}"})
    assert res.status_code == 403
    assert "Access denied" in res.json()["detail"]

    # 2. Faculty accessing admin APIs must be 403 Forbidden
    res = client.get("/api/v1/admin/users", headers={"Authorization": f"Bearer {faculty_token}"})
    assert res.status_code == 403
    assert "Access denied" in res.json()["detail"]

    # 3. Unauthenticated accessing admin or student dashboards
    res = client.get("/api/v1/admin/users")
    assert res.status_code == 401


def test_admin_create_student_and_activation_flow():
    # Admin login
    admin_res = client.post("/api/v1/auth/login", json={
        "identifier": "admin@srec.local",
        "password": "Admin@Srec2026"
    })
    admin_token = admin_res.json()["access_token"]

    # Create new student
    test_id = "24CSE888"
    test_email = "test.student888@srec.local"
    create_res = client.post(
        "/api/v1/admin/users/students",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "student_id": test_id,
            "full_name": "Test Student 888",
            "college_email": test_email,
            "mobile_number": "+91-9988112233",
            "department": "CSE",
            "year": 1,
            "semester": 1,
            "section": "C",
            "admission_year": 2024
        }
    )
    assert create_res.status_code == 200
    create_data = create_res.json()
    assert create_data["status"] == "INVITED"
    activation_token = create_data["dev_activation_token"]
    assert activation_token

    # Verify token endpoint
    verify_res = client.get(f"/api/v1/auth/verify-activation-token?token={activation_token}")
    assert verify_res.status_code == 200
    v_data = verify_res.json()
    assert v_data["valid"] is True
    assert v_data["user_code"] == test_id

    # Try activating with weak password (fails)
    act_fail = client.post("/api/v1/auth/activate", json={
        "token": activation_token,
        "password": "weak",
        "confirm_password": "weak"
    })
    assert act_fail.status_code == 400
    assert "at least 8 characters" in act_fail.json()["detail"]

    # Try activating with non-matching passwords (fails)
    act_mismatch = client.post("/api/v1/auth/activate", json={
        "token": activation_token,
        "password": "StrongPass@2026",
        "confirm_password": "DifferentPass@2026"
    })
    assert act_mismatch.status_code == 400
    assert "do not match" in act_mismatch.json()["detail"]

    # Activate successfully with strong password
    new_password = "StrongStudent@2026"
    act_success = client.post("/api/v1/auth/activate", json={
        "token": activation_token,
        "password": new_password,
        "confirm_password": new_password
    })
    assert act_success.status_code == 200
    assert act_success.json()["success"] is True

    # Token cannot be reused
    reuse_res = client.get(f"/api/v1/auth/verify-activation-token?token={activation_token}")
    assert reuse_res.json()["valid"] is False

    # Login now succeeds with new password!
    new_login = client.post("/api/v1/auth/login", json={
        "identifier": test_id,
        "password": new_password
    })
    assert new_login.status_code == 200
    assert new_login.json()["status"] == "ACTIVE"


def test_forgot_and_reset_password_flow():
    # Request forgot password
    forgot_res = client.post("/api/v1/auth/forgot-password", json={
        "identifier": "student@srec.local"
    })
    assert forgot_res.status_code == 200
    assert "If an account matches" in forgot_res.json()["message"]
    reset_token = forgot_res.json()["dev_token"]
    assert reset_token

    # Verify reset token
    verify_res = client.get(f"/api/v1/auth/verify-reset-token?token={reset_token}")
    assert verify_res.status_code == 200
    assert verify_res.json()["valid"] is True

    # Reset password
    new_pass = "BrandNewStudentPass@2026"
    reset_res = client.post("/api/v1/auth/reset-password", json={
        "token": reset_token,
        "password": new_pass,
        "confirm_password": new_pass
    })
    assert reset_res.status_code == 200

    # Old reset token cannot be used again
    reuse_verify = client.get(f"/api/v1/auth/verify-reset-token?token={reset_token}")
    assert reuse_verify.json()["valid"] is False

    # Login with new password
    login_new = client.post("/api/v1/auth/login", json={
        "identifier": "student@srec.local",
        "password": new_pass
    })
    assert login_new.status_code == 200

    # Restore student password for test isolation
    client.post(
        "/api/v1/auth/change-password",
        headers={"Authorization": f"Bearer {login_new.json()['access_token']}"},
        json={
            "current_password": new_pass,
            "new_password": "Student@Srec2026",
            "confirm_new_password": "Student@Srec2026"
        }
    )


def test_change_password():
    # Login as admin
    admin_res = client.post("/api/v1/auth/login", json={
        "identifier": "admin@srec.local",
        "password": "Admin@Srec2026"
    })
    token = admin_res.json()["access_token"]

    # Wrong current password fails
    fail_res = client.post(
        "/api/v1/auth/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "current_password": "WrongPassword#99",
            "new_password": "NewAdminPass@2026",
            "confirm_new_password": "NewAdminPass@2026"
        }
    )
    assert fail_res.status_code == 400
    assert "Current password does not match" in fail_res.json()["detail"]

    # Successfully change password
    change_res = client.post(
        "/api/v1/auth/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "current_password": "Admin@Srec2026",
            "new_password": "UpdatedAdminPass@2026",
            "confirm_new_password": "UpdatedAdminPass@2026"
        }
    )
    assert change_res.status_code == 200
    assert change_res.json()["success"] is True

    # Login with new password works
    re_login = client.post("/api/v1/auth/login", json={
        "identifier": "admin@srec.local",
        "password": "UpdatedAdminPass@2026"
    })
    assert re_login.status_code == 200

    # Restore admin password for test isolation
    client.post(
        "/api/v1/auth/change-password",
        headers={"Authorization": f"Bearer {re_login.json()['access_token']}"},
        json={
            "current_password": "UpdatedAdminPass@2026",
            "new_password": "Admin@Srec2026",
            "confirm_new_password": "Admin@Srec2026"
        }
    )

