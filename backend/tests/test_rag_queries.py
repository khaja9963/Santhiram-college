from app.ai.rag_engine import rag_engine

def test_srec_course_queries():
    queries = [
        "What courses are available at SREC?",
        "Which courses are offered?",
        "What branches do you have?",
        "List of programs",
        "Tell me about courses",
        "What are the B.Tech courses?",
        "Do you have MBA or MCA?",
        "What is the admission process and eligibility?",
        "Tell me about the CSE department and labs.",
        "What are the hostel facilities and fees?",
        "Show me autonomous examination attendance rules.",
        "What are the placement statistics and recruiters?",
        "Who is the principal?",
        "Where is the college located?"
    ]

    for q in queries:
        res = rag_engine.answer_query(q)
        assert res["is_grounded"] is True, f"Failed for query: {q}"
        assert len(res["sources"]) > 0, f"No sources for query: {q}"
        assert len(res["answer"]) > 50, f"Short answer for query: {q}"
        print(f"SUCCESS: {q} -> {res['sources'][0]['document_title']}")

if __name__ == "__main__":
    test_srec_course_queries()
    print("ALL 14 SREC AI QUERIES PASSED!")
