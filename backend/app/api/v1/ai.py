import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from app.schemas.all_schemas import (
    AIChatRequest, AIChatResponse,
    ConceptExplainRequest, ConceptExplainResponse,
    GenerateQuizRequest, GenerateQuizResponse,
    EvaluateQuizRequest, EvaluateQuizResponse,
    ResumeAnalysisRequest, ResumeAnalysisResponse,
    MockInterviewQuestion, MockInterviewAnswerSubmit, MockInterviewFeedback
)
from app.ai.rag_engine import rag_engine
from app.ai.study_assistant import study_assistant
from app.ai.placement_assistant import placement_assistant

router = APIRouter(prefix="/ai", tags=["AI Assistants & Services"])

@router.post("/chat", response_model=AIChatResponse)
def chat_with_srec_ai(payload: AIChatRequest):
    conversation_id = payload.conversation_id or str(uuid.uuid4())
    result = rag_engine.answer_query(payload.message, department=payload.department)

    return AIChatResponse(
        conversation_id=conversation_id,
        answer=result["answer"],
        sources=result["sources"],
        is_grounded=result["is_grounded"],
        confidence=result["confidence"]
    )

# Study Assistant endpoints
@router.post("/study/explain", response_model=ConceptExplainResponse)
def explain_concept(payload: ConceptExplainRequest):
    return study_assistant.explain_concept(payload.subject, payload.topic, payload.difficulty)

@router.post("/study/quiz", response_model=GenerateQuizResponse)
def generate_quiz(payload: GenerateQuizRequest):
    return study_assistant.generate_quiz(payload.subject, payload.topic, payload.count)

@router.post("/study/evaluate", response_model=EvaluateQuizResponse)
def evaluate_quiz(payload: EvaluateQuizRequest):
    return study_assistant.evaluate_quiz(payload.subject, payload.user_answers, payload.questions)

# Placement Assistant endpoints
@router.post("/placement/analyze-resume", response_model=ResumeAnalysisResponse)
def analyze_resume(payload: ResumeAnalysisRequest):
    return placement_assistant.analyze_resume(payload.resume_text, payload.target_role)

@router.get("/placement/mock-interview/question", response_model=MockInterviewQuestion)
def get_mock_interview_question(
    role: str = Query("Python Developer"),
    question_number: int = Query(1)
):
    return placement_assistant.get_mock_interview_question(role, question_number)

@router.post("/placement/mock-interview/submit", response_model=MockInterviewFeedback)
def submit_mock_interview_answer(payload: MockInterviewAnswerSubmit):
    return placement_assistant.evaluate_interview_answer(
        payload.question, payload.student_answer, payload.role_target
    )
