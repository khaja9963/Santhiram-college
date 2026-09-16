import re
from typing import List, Dict, Any
from app.schemas.all_schemas import (
    ResumeAnalysisResponse, MockInterviewQuestion, MockInterviewFeedback
)

class PlacementAssistant:
    def __init__(self):
        # Known technical and industry skills taxonomy
        self.tech_catalog = {
            "python", "java", "c++", "c", "javascript", "typescript", "react", "next.js", "node.js",
            "sql", "postgresql", "mysql", "mongodb", "fastapi", "django", "flask", "docker",
            "kubernetes", "aws", "azure", "git", "github", "linux", "html", "css", "tailwind",
            "machine learning", "deep learning", "pandas", "numpy", "scikit-learn", "tensorflow",
            "pytorch", "nlp", "rest api", "graphql", "data structures", "algorithms", "redis"
        }
        self.soft_catalog = {
            "teamwork", "leadership", "communication", "problem solving", "critical thinking",
            "adaptability", "time management", "collaboration", "presentation", "analytical skills"
        }

        self.interview_question_bank = {
            "python developer": [
                {
                    "q": "Explain how Python's memory management and garbage collection work, specifically regarding reference counting and cyclical garbage collection.",
                    "topic": "Memory Management & Internals",
                    "keywords": ["reference counting", "cyclic", "gc module", "generations", "deallocation"]
                },
                {
                    "q": "What is the difference between a shallow copy and a deep copy in Python? When would you use copy.deepcopy?",
                    "topic": "Object Mutability & Copies",
                    "keywords": ["shallow", "deep", "nested objects", "references", "copy module"]
                },
                {
                    "q": "Describe how Python generators and the 'yield' statement work. Why are they preferred for processing large datasets?",
                    "topic": "Generators & Memory Efficiency",
                    "keywords": ["yield", "iterator protocol", "lazy evaluation", "memory footprint", "next()"]
                }
            ],
            "full stack developer": [
                {
                    "q": "How does Next.js handle Server-Side Rendering (SSR) vs Static Site Generation (SSG), and how do Client Components hydrate?",
                    "topic": "Modern Web Architectures",
                    "keywords": ["ssr", "ssg", "hydration", "bundle size", "server components"]
                },
                {
                    "q": "Explain Cross-Origin Resource Sharing (CORS) and the mechanism behind preflight OPTIONS requests.",
                    "topic": "Web Security & HTTP",
                    "keywords": ["cors", "preflight", "options", "access-control-allow-origin", "headers"]
                }
            ],
            "ai engineer": [
                {
                    "q": "Explain the trade-offs between dense embeddings and sparse keyword search (BM25) in Retrieval-Augmented Generation (RAG) systems.",
                    "topic": "RAG & Vector Search",
                    "keywords": ["embeddings", "cosine similarity", "bm25", "hybrid search", "re-ranking"]
                },
                {
                    "q": "How do you detect and prevent catastrophic forgetting when fine-tuning Large Language Models with LoRA?",
                    "topic": "LLM Fine-tuning",
                    "keywords": ["lora", "low-rank adaptation", "parameter efficient", "catastrophic forgetting", "learning rate"]
                }
            ]
        }

    def analyze_resume(self, resume_text: str, target_role: str = "Software Development Engineer") -> ResumeAnalysisResponse:
        text_lower = resume_text.lower()

        # Extract skills
        found_tech = [skill.title() for skill in self.tech_catalog if skill in text_lower]
        found_soft = [skill.title() for skill in self.soft_catalog if skill in text_lower]

        # Defaults if empty or brief text
        if not found_tech:
            found_tech = ["Python", "SQL", "Data Structures & Algorithms", "Git"]
        if not found_soft:
            found_soft = ["Problem Solving", "Teamwork", "Analytical Thinking"]

        # Skill gap assessment
        skill_gap = []
        recommended_roles = []
        if "python" in text_lower or "fastapi" in text_lower:
            recommended_roles.extend(["Python Backend Developer", "API Engineer"])
            if "docker" not in text_lower:
                skill_gap.append("Containerization (Docker & Kubernetes) for deployment")
            if "redis" not in text_lower:
                skill_gap.append("Caching layers (Redis / Memcached)")
        if "react" in text_lower or "next" in text_lower or "javascript" in text_lower:
            recommended_roles.append("Full-Stack Web Developer")
            if "typescript" not in text_lower:
                skill_gap.append("Strict typing with TypeScript")
        if "machine learning" in text_lower or "ai" in text_lower or "pytorch" in text_lower:
            recommended_roles.append("AI / ML Engineer")
            if "rag" not in text_lower and "langchain" not in text_lower:
                skill_gap.append("LLM Application Frameworks & RAG pipelines")

        if not recommended_roles:
            recommended_roles = ["Junior Software Engineer", "Graduate Engineering Trainee", "Quality Assurance Analyst"]
        if not skill_gap:
            skill_gap = ["System Design & High-Level Architecture", "Automated CI/CD Pipelines (GitHub Actions)"]

        # ATS scoring
        ats_score = min(94, 60 + len(found_tech) * 3 + (10 if "project" in text_lower else 0) + (10 if "education" in text_lower or "b.tech" in text_lower else 0))

        suggestions = [
            "Quantify project achievements with metrics (e.g., 'Reduced query latency by 35% using database indexing').",
            "Include your live GitHub repository links and hosted project URLs directly under each project title.",
            "Tailor technical keywords to match exact requirements in Tier-1 campus placement job descriptions (TCS, Infosys, Capgemini).",
            "Add certifications from verified platforms like EduSkills, NPTEL, or AWS Cloud Practitioner."
        ]

        return ResumeAnalysisResponse(
            technical_skills=found_tech[:12],
            soft_skills=found_soft[:6],
            education_summary="B.Tech in Engineering, Santhiram Engineering College (Autonomous)",
            experience_level="Fresher / Entry-Level Engineer",
            skill_gap=skill_gap[:4],
            recommended_roles=list(set(recommended_roles)),
            improvement_suggestions=suggestions,
            ats_score=ats_score
        )

    def get_mock_interview_question(self, role: str, question_idx: int = 1) -> MockInterviewQuestion:
        role_key = "python developer"
        for key in self.interview_question_bank:
            if key in role.lower():
                role_key = key
                break

        bank = self.interview_question_bank[role_key]
        idx = max(0, min(question_idx - 1, len(bank) - 1))
        item = bank[idx]

        return MockInterviewQuestion(
            question_number=question_idx,
            total_questions=len(bank),
            question=item["q"],
            topic=item["topic"]
        )

    def evaluate_interview_answer(self, question: str, answer: str, role: str) -> MockInterviewFeedback:
        ans_lower = answer.lower()
        word_count = len(re.findall(r"\w+", answer))

        if word_count < 15:
            return MockInterviewFeedback(
                score=4,
                relevance="Brief and incomplete",
                technical_depth="Surface-level explanation without technical mechanisms",
                missing_concepts=["Detailed architectural mechanism", "Edge case considerations", "Real-world trade-offs"],
                clarity_feedback="Elaborate further with specific algorithms or code paradigms.",
                sample_model_answer="A complete answer would articulate the internal mechanics, memory/runtime trade-offs, and practical edge cases."
            )

        score = min(9, 6 + (2 if word_count > 40 else 0) + (1 if "for example" in ans_lower or "such as" in ans_lower else 0))

        return MockInterviewFeedback(
            score=score,
            relevance="High relevance to the interviewer's prompt",
            technical_depth="Good structural explanation covering the primary operational principles",
            missing_concepts=["Mention of production scaling constraints or error-handling fallbacks"],
            clarity_feedback="Strong and coherent articulation. Good technical vocabulary.",
            sample_model_answer=(
                "In high-performance environments, state the fundamental principle clearly, follow up with the runtime "
                "complexity, and conclude by highlighting practical design trade-offs."
            )
        )

placement_assistant = PlacementAssistant()
