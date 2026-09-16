from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base
from app.database.seed import init_db
from app.api.v1 import auth, college, student, faculty, admin, ai

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all local frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # Ensure database is pre-seeded with official SREC records
    try:
        init_db()
    except Exception as e:
        print(f"Startup notice: {e}")

@app.get("/")
def root():
    return {
        "institution": "Santhiram Engineering College (Autonomous), Nandyal",
        "system": "SREC Smart Campus API",
        "status": "ONLINE",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs"
    }

# Include all API v1 routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(college.router, prefix=settings.API_V1_STR)
app.include_router(student.router, prefix=settings.API_V1_STR)
app.include_router(faculty.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
