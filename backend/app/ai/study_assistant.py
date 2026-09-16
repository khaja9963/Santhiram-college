from typing import List, Dict, Any
from app.schemas.all_schemas import (
    ConceptExplainResponse, QuizMCQItem, GenerateQuizResponse, EvaluateQuizResponse
)

class StudyAssistant:
    def __init__(self):
        # Curated technical question bank mapped to standard engineering curriculum
        self.curriculum_quizzes = {
            "dbms": [
                {
                    "id": 1,
                    "question": "Which normal form removes partial functional dependency on the primary key?",
                    "options": [
                        "A. First Normal Form (1NF)",
                        "B. Second Normal Form (2NF)",
                        "C. Third Normal Form (3NF)",
                        "D. Boyce-Codd Normal Form (BCNF)"
                    ],
                    "correct_option": "B",
                    "explanation": "Second Normal Form (2NF) mandates that the table must be in 1NF and every non-prime attribute must be fully functionally dependent on the entire primary key (no partial dependency)."
                },
                {
                    "id": 2,
                    "question": "In the ACID properties of DBMS transactions, what does 'Atomicity' guarantee?",
                    "options": [
                        "A. Transactions execute concurrently without interference",
                        "B. Either all operations of a transaction succeed, or none take effect",
                        "C. The database remains in a valid state before and after execution",
                        "D. Changes persist permanently even across power failures"
                    ],
                    "correct_option": "B",
                    "explanation": "Atomicity ensures an 'all-or-nothing' execution. If any step fails within a transaction, the entire transaction is rolled back."
                },
                {
                    "id": 3,
                    "question": "Which index structure is most widely used in relational database engines for range queries?",
                    "options": [
                        "A. Hash Index",
                        "B. B+ Tree",
                        "C. Binary Search Tree",
                        "D. Inverted Index"
                    ],
                    "correct_option": "B",
                    "explanation": "B+ Trees maintain balanced depth, store data pointers exclusively at leaf nodes linked sequentially, enabling exceptionally fast logarithmic range and equality lookups."
                },
                {
                    "id": 4,
                    "question": "What is the primary difference between DELETE and TRUNCATE in SQL?",
                    "options": [
                        "A. DELETE is DDL while TRUNCATE is DML",
                        "B. TRUNCATE can have a WHERE clause, DELETE cannot",
                        "C. DELETE logs row by row and can be rolled back; TRUNCATE deallocates data pages directly",
                        "D. There is no operational difference"
                    ],
                    "correct_option": "C",
                    "explanation": "DELETE is a DML statement that removes rows individually with transactional logging. TRUNCATE is a DDL command that deallocates data extents quickly with minimal logging."
                },
                {
                    "id": 5,
                    "question": "In a database deadlock scenario, which condition must hold according to Coffman's criteria?",
                    "options": [
                        "A. Circular Wait, Mutual Exclusion, Hold & Wait, No Preemption",
                        "B. Starvation, Paging, Fragmentation, Thrashing",
                        "C. Serialization, Isolation, Durability, Atomicity",
                        "D. Normalization, Denormalization, Indexing, Partitioning"
                    ],
                    "correct_option": "A",
                    "explanation": "Deadlock can occur if and only if all four Coffman conditions (Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait) hold simultaneously."
                }
            ],
            "os": [
                {
                    "id": 1,
                    "question": "Which scheduling algorithm is non-preemptive and assigns the CPU to the process with smallest burst time?",
                    "options": [
                        "A. Round Robin (RR)",
                        "B. Shortest Job First (SJF)",
                        "C. Shortest Remaining Time First (SRTF)",
                        "D. Multi-Level Feedback Queue"
                    ],
                    "correct_option": "B",
                    "explanation": "Shortest Job First (SJF) when non-preemptive assigns the CPU to the shortest burst job without preempting it until completion."
                },
                {
                    "id": 2,
                    "question": "What causes 'Thrashing' in an operating system memory manager?",
                    "options": [
                        "A. High CPU utilization with low memory demand",
                        "B. Excessive page faults causing the system to spend more time swapping pages than executing code",
                        "C. Overheating of the primary CPU core",
                        "D. Deadlock between threads accessing a shared mutex"
                    ],
                    "correct_option": "B",
                    "explanation": "Thrashing occurs when the total working set size of active processes exceeds physical RAM, causing constant page faulting and disk I/O."
                }
            ],
            "ai": [
                {
                    "id": 1,
                    "question": "In neural network optimization, what is the key advantage of the Adam optimizer over basic SGD?",
                    "options": [
                        "A. Adam does not compute gradients",
                        "B. Adam combines adaptive learning rates from RMSProp with momentum estimations",
                        "C. Adam only works for linear regression",
                        "D. Adam replaces backpropagation with genetic algorithms"
                    ],
                    "correct_option": "B",
                    "explanation": "Adam (Adaptive Moment Estimation) computes individual adaptive learning rates for different parameters from estimates of both first and second moments of the gradients."
                },
                {
                    "id": 2,
                    "question": "Which problem does the Self-Attention mechanism in Transformer architectures solve compared to Recurrent Neural Networks (RNNs)?",
                    "options": [
                        "A. Eliminates sequential processing bottlenecks and enables full parallelization across sequence tokens",
                        "B. Removes the need for GPU computation",
                        "C. Limits context length to exactly 10 tokens",
                        "D. Bypasses matrix multiplications"
                    ],
                    "correct_option": "A",
                    "explanation": "Transformers allow parallel computation across all tokens simultaneously while modeling long-range token relationships via multi-head self-attention, avoiding vanishing gradients common in RNNs."
                }
            ]
        }

    def explain_concept(self, subject: str, topic: str, difficulty: str = "intermediate") -> ConceptExplainResponse:
        s_clean = subject.lower()
        t_clean = topic.lower()

        # Contextual explanation engine
        explanation = (
            f"**Comprehensive Analysis of {topic.title()} in {subject.upper()}**\n\n"
            f"In computer science and engineering, **{topic}** plays a foundational role in system architecture, algorithmic correctness, and performance optimization. "
            f"At the {difficulty} level, understanding its mathematical foundations and implementation nuances ensures you can design scalable, fault-tolerant solutions.\n\n"
            f"### Core Architectural Principles:\n"
            f"1. **State Invariance:** Maintaining structural consistency throughout dynamic state transitions.\n"
            f"2. **Computational Complexity:** Achieving optimized time bounds (e.g., logarithmic or linear amortized cost) while preserving space efficiency.\n"
            f"3. **Concurrency Safety:** Preventing race conditions, deadlock states, and dirty reads during simultaneous accesses."
        )

        key_points = [
            f"Strict mathematical definition and invariants for {topic}",
            "Efficiency trade-offs between space and runtime performance",
            "Best practice design patterns utilized in modern production systems",
            "Common pitfalls and edge cases in university examination papers"
        ]

        analogy = (
            f"Think of {topic} like a modern high-speed railway signaling system: every signal block verifies clearance "
            f"before allowing trains forward, ensuring maximum throughput without collisions or deadlock bottlenecks."
        )

        problem = (
            f"Design an algorithm or SQL/Schema schema that implements {topic} with optimal time complexity. "
            f"Explain how your design handles edge cases where simultaneous concurrent transactions request the same resource."
        )

        return ConceptExplainResponse(
            topic=topic,
            explanation=explanation,
            key_points=key_points,
            real_world_analogy=analogy,
            practice_problem=problem
        )

    def generate_quiz(self, subject: str, topic: str, count: int = 5) -> GenerateQuizResponse:
        key = "dbms"
        if "os" in subject.lower() or "operating" in subject.lower():
            key = "os"
        elif "ai" in subject.lower() or "machine" in subject.lower() or "ml" in subject.lower():
            key = "ai"

        questions = self.curriculum_quizzes.get(key, self.curriculum_quizzes["dbms"])
        selected = questions[:count] if len(questions) >= count else questions

        return GenerateQuizResponse(
            subject=subject,
            topic=topic,
            questions=[QuizMCQItem(**q) for q in selected]
        )

    def evaluate_quiz(self, subject: str, user_answers: Dict[int, str], questions: List[QuizMCQItem]) -> EvaluateQuizResponse:
        score = 0
        breakdown = []

        for q in questions:
            user_opt = user_answers.get(q.id, "").strip().upper()
            is_correct = (user_opt == q.correct_option.upper())
            if is_correct:
                score += 1
            breakdown.append({
                "question_id": q.id,
                "question": q.question,
                "user_selected": user_opt,
                "correct_option": q.correct_option,
                "is_correct": is_correct,
                "explanation": q.explanation
            })

        total = len(questions)
        pct = (score / total * 100.0) if total > 0 else 0.0

        if pct >= 80:
            feedback = "Outstanding performance! You demonstrate thorough mastery of this topic."
        elif pct >= 60:
            feedback = "Good foundation! Review the explanations for missed questions to solidify weak spots."
        else:
            feedback = "Consider reviewing the SREC syllabus notes and textbook chapters before attempting again."

        return EvaluateQuizResponse(
            score=score,
            total=total,
            percentage=round(pct, 1),
            feedback=feedback,
            breakdown=breakdown
        )

study_assistant = StudyAssistant()
