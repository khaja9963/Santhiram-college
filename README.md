# SREC Smart Campus — Santhiram Engineering College (Autonomous), Nandyal

> **Next-Generation Autonomous Engineering College Web Application & AI Ecosystem**  
> Reference Institution: [Santhiram Engineering College (SREC)](https://www.srecnandyal.edu.in/), NH-40, Nerawada, Nandyal, Andhra Pradesh, India.  
> Motto: *"Education for Peace and Progress"* | NAAC 'A' Grade | NBA Accredited (CSE & ECE) | Affiliated to JNTUA Anantapuramu

---

## 🏛️ Project Overview

**SREC Smart Campus** is a modern full-stack web application that elevates the digital presence and academic administration of Santhiram Engineering College. Rather than a basic clone, this application is an AI-powered smart campus uniting:

1. **Modern Public College Website**: Premium UI with rich hero sections, dynamic statistics counters, department showcases, autonomous academic regulations, admissions checklist, placement records, campus facilities, and events.
2. **Student Portal (`/student/dashboard`)**: Period-wise and subject-wise attendance analytics, low attendance alerts (<75%), semester GPA & CGPA progression, assignment submission, timetable, and fee receipts.
3. **Faculty Portal (`/faculty/dashboard`)**: Subject class assignments, attendance marking interface, continuous internal evaluation (CIE) test scores entry, and assignment distribution.
4. **Admin Portal (`/admin/dashboard`)**: Institutional metrics, student & faculty directories, department intake quota, and news announcement manager.
5. **AI College Assistant ("Ask SREC AI")**: Floating interactive assistant powered by Retrieval-Augmented Generation (RAG) providing verified answers with exact document names and page numbers.
6. **AI Study Assistant (`/student/ai-study`)**: Branch and subject concept explainer with real-world analogies, high-yield exam notes, and interactive 5-question multiple choice quizzes with instant evaluation.
7. **AI Placement Assistant (`/student/ai-placement`)**: Resume parser and ATS scorer, skill gap identifier, recommended roles, and simulated interactive technical mock interview evaluator.
8. **Interactive Campus 3D (`/campus`)**: 2.5D visual campus map with clickable building pins (Main Block, Sir Visvesvaraya CS Complex, Dr. B.R. Ambedkar Central Library, Sports Arena, Hostels).
9. **AI Document RAG Knowledge Base (`/admin/ai-knowledge-base`)**: Ingestion pipeline for PDFs, DOCX, and TXT documents, chunk status monitoring (`✓ Processed`), and vector similarity indexing.
10. **Global Search Palette (`Ctrl + K`)**: Instant command palette to search across courses, departments, faculty, events, documents, and campus facilities.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React, Framer Motion |
| **Backend** | Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy, Uvicorn, Jose (JWT), Passlib (Bcrypt) |
| **Database** | Dual Mode: SQLite with in-process vector cosine search for zero-config local dev; PostgreSQL 16 + `pgvector` for Docker production |
| **AI / RAG** | Vector similarity retrieval, Semantic Chunking, Citation Grounding, Optional Gemini API integration |
| **DevOps** | Docker, Docker Compose, Multi-stage builds |

---

## 🔑 Demo Authentication Credentials

The application provides instant one-click login switchers on `/login`:

| Role | Email | Password | Target Dashboard |
|---|---|---|---|
| **Student** | `student@srecnandyal.edu.in` | `student123` | `/student/dashboard` |
| **Faculty** | `faculty@srecnandyal.edu.in` | `faculty123` | `/faculty/dashboard` |
| **Admin** | `admin@srecnandyal.edu.in` | `admin123` | `/admin/dashboard` |

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js 20+ & npm
- Python 3.10+

### Option A: Local Development (Instant Zero-Config)

#### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Create & activate virtual environment (Windows)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run seed script to populate official SREC records
python -m app.database.seed

# Start FastAPI server on port 8000
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at `http://localhost:8000/api/v1/docs`.

#### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

### Option B: Docker Compose Deployment (Production)

To launch the multi-container stack with PostgreSQL, `pgvector`, FastAPI backend, and Next.js frontend:

```bash
docker-compose up --build -d
```

- **Frontend Application**: `http://localhost:3000`
- **FastAPI Backend & Swagger**: `http://localhost:8000/api/v1/docs`
- **PostgreSQL Database**: `localhost:5432`

---

## 🧪 Automated Testing

A comprehensive automated test suite validates authentication, role-based access control (RBAC), RAG document citation retrieval, student endpoints, and AI modules:

```bash
cd backend
.\venv\Scripts\python.exe -m pytest -v
```

All 7 test suites verify that:
- Unauthorized students cannot trigger admin or faculty endpoints.
- AI College Assistant strictly cites official SREC documents with page numbers.
- AI Assistant correctly admits when information is unavailable rather than hallucinating.
- Quiz questions and resume analysis structures comply with Pydantic schemas.

---

## 📁 Monorepo Directory Structure

```
srec-smart-campus/
├── frontend/
│   ├── app/
│   │   ├── (public)/          # Public pages (/, /about, /academics, /admissions, /placements, /campus-life, /events, /contact)
│   │   ├── departments/[code]/# Dynamic department pages (CSE, CSM, CSD, ECE, EEE, MBA, MCA)
│   │   ├── campus/            # Interactive 2.5D Campus Map
│   │   ├── login/             # Unified login with demo account switchers
│   │   ├── student/           # Student Portal (Dashboard, Attendance, Marks, Results, Fees, AI Study, AI Placement)
│   │   ├── faculty/           # Faculty Portal (Dashboard, Attendance marking, Marks upload, Assignments)
│   │   ├── admin/             # Admin Portal (Dashboard, AI Knowledge Base, Departments, Students, Faculty)
│   │   ├── globals.css        # SREC design system, tokens, and glassmorphism utilities
│   │   └── layout.tsx         # Root layout with AuthProvider and SREC AI drawer
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, AppLayoutWrapper
│   │   ├── ai/                # SRECAssistantDrawer
│   │   └── search/            # SearchModal (Ctrl + K Command Palette)
│   ├── lib/                   # API client, Auth Context, Constants
│   ├── types/                 # TypeScript interfaces
│   └── Dockerfile
│
├── backend/
│   ├── app/
│   │   ├── api/v1/            # REST API endpoints (auth, college, student, faculty, admin, ai)
│   │   ├── core/              # Settings, Security (JWT & Bcrypt), Dependencies
│   │   ├── database/          # Database sessions and seed script
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic v2 schemas
│   │   ├── ai/                # RAG Engine, Study Assistant, Placement Assistant
│   │   └── main.py            # FastAPI main application
│   ├── tests/                 # Pytest automated test suite
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🏛️ Official Institutional Information Preserved

- **College Name**: Santhiram Engineering College (Autonomous), Nandyal
- **Establishment**: 2007 by Dr. M. Santhiramudu
- **Affiliation**: JNTUA Anantapuramu & Approved by AICTE, New Delhi
- **Accreditation**: NAAC 'A' Grade, NBA Accredited (CSE & ECE)
- **Campus Address**: NH-40, Nerawada Village, Nandyal &ndash; 518501, Andhra Pradesh
- **Contact Phone**: +91-9866308475
- **Official Email**: `principal@srecnandyal.edu.in`
- **EAPCET / ECET Code**: **SREC**
- **Virtual Internship Achievement**: All India 6th Rank in EduSkills Virtual Internship Program
