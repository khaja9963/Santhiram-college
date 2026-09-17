import os
import re
import json
from typing import List, Dict, Any, Tuple, Optional
from app.core.config import settings

def _normalize_token(token: str) -> str:
    w = token.lower().strip()
    if w.endswith('ies') and len(w) > 4:
        return w[:-3] + 'y'
    if w.endswith('es') and len(w) > 3 and not w.endswith('ses'):
        return w[:-2]
    if w.endswith('s') and not w.endswith('ss') and len(w) > 2:
        return w[:-1]
    return w

class RAGEngine:
    def __init__(self):
        self.knowledge_corpus: List[Dict[str, Any]] = self._init_college_knowledge_base()

    def _init_college_knowledge_base(self) -> List[Dict[str, Any]]:
        return [
            {
                "doc_title": "SREC Academic Programs & Offered Courses Directory",
                "category": "ACADEMICS",
                "page": 1,
                "keywords": [
                    "course", "courses", "program", "programs", "branch", "branches",
                    "degree", "degrees", "btech", "b.tech", "mtech", "m.tech", "mba", "mca",
                    "intake", "seats", "available", "offered", "stream", "streams",
                    "study", "specialization", "undergraduate", "postgraduate", "ug", "pg",
                    "cse", "csm", "csd", "ece", "eee", "mech", "mechanical", "civil"
                ],
                "content": (
                    "Santhiram Engineering College (SREC Autonomous), Nandyal offers AICTE-approved, JNTUA-affiliated, "
                    "and Autonomous Undergraduate (B.Tech) and Postgraduate (MBA, MCA, M.Tech) degree programs:\n\n"
                    "### 1. Undergraduate Engineering Programs (B.Tech - 4 Years):\n"
                    "- **B.Tech Computer Science & Engineering (CSE)**  -  180 Seats (NBA Accredited)\n"
                    "- **B.Tech CSE (Artificial Intelligence & Machine Learning - CSM)**  -  120 Seats\n"
                    "- **B.Tech CSE (Data Science - CSD)**  -  60 Seats\n"
                    "- **B.Tech Electronics & Communication Engineering (ECE)**  -  120 Seats (NBA Accredited)\n"
                    "- **B.Tech Electrical & Electronics Engineering (EEE)**  -  60 Seats\n"
                    "- **B.Tech Mechanical Engineering (ME)**  -  60 Seats\n"
                    "- **B.Tech Civil Engineering (CE)**  -  60 Seats\n\n"
                    "### 2. Postgraduate Programs (PG):\n"
                    "- **Master of Business Administration (MBA)**  -  120 Seats\n"
                    "- **Master of Computer Applications (MCA)**  -  60 Seats\n"
                    "- **M.Tech in VLSI & Embedded Systems (ECE)**  -  18 Seats\n"
                    "- **M.Tech in Computer Science & Engineering (CSE)**  -  18 Seats\n\n"
                    "**Admissions Counselling Code:** AP EAPCET / ECET / ICET Code: **SREC**.\n"
                    "All programs follow industry-aligned autonomous regulations with experiential learning, modern laboratories, "
                    "and comprehensive campus placement training."
                )
            },
            {
                "doc_title": "SREC Admission Brochure 2025-26 & Counselling Guidelines",
                "category": "ADMISSIONS",
                "page": 4,
                "keywords": [
                    "admission", "admissions", "eligibility", "eapcet", "eamcet", "ecet", "icet",
                    "apply", "applying", "seats", "process", "btech", "quota", "convener",
                    "management", "counselling", "code", "criteria", "qualification", "join"
                ],
                "content": (
                    "Admissions to B.Tech programs at Santhiram Engineering College (Autonomous), Nandyal are conducted through "
                    "AP EAPCET (Andhra Pradesh Engineering, Agriculture and Pharmacy Common Entrance Test) for Category-A (Convener Quota, 70% seats) "
                    "and Management Quota (Category-B, 30% seats) as per APSCHE guidelines. Eligibility: Candidate must have passed 10+2 with Physics, "
                    "Mathematics, and Chemistry with a minimum of 45% aggregate (40% for reserved categories). Diploma holders can enter directly into "
                    "2nd year B.Tech via AP ECET (Lateral Entry, 10% supernumerary seats). For MBA & MCA admissions, selection is through AP ICET. "
                    "The official college counselling code for all admissions is **SREC**."
                )
            },
            {
                "doc_title": "SREC Academic Regulations & Fee Schedule",
                "category": "FEES_AND_REGULATIONS",
                "page": 7,
                "keywords": [
                    "fee", "fees", "tuition", "hostel fee", "bus", "bus fee", "transportation",
                    "cost", "scholarship", "jvd", "vidya deevena", "reimbursement", "payment"
                ],
                "content": (
                    "Annual tuition fee for B.Tech programs is regulated by the AP Higher Education Regulatory and Monitoring Commission (APHERMC) at "
                    "approximately Rs. 52,000 to Rs. 58,000 per annum for Category-A seats. Students eligible for Jagananna Vidya Deevena (JVD) receive full "
                    "tuition fee reimbursement directly from the Government of Andhra Pradesh. Residential Hostel Fee: Rs. 60,000 per academic year covering "
                    "boarding, lodging, high-speed Wi-Fi, solar hot water, and laundry services. College Transportation Bus Fee ranges from Rs. 15,000 to Rs. 22,000 "
                    "per year depending on boarding points across Nandyal, Kurnool, Allagadda, Banaganapalle, and surrounding towns."
                )
            },
            {
                "doc_title": "SREC Department Profile  -  Computer Science & Engineering",
                "category": "DEPARTMENTS",
                "page": 2,
                "keywords": [
                    "cse", "computer science", "coding", "software", "labs", "hod", "programming",
                    "subba reddy", "department", "computers"
                ],
                "content": (
                    "The Department of Computer Science & Engineering (CSE) was established in 2007 with NBA Accreditation and NAAC 'A' Grade. "
                    "Current annual intake is 180 seats. The department houses 8 specialized laboratories including AI/ML Computing Lab, Cloud Computing Lab, "
                    "Data Analytics Lab, and Open Source Software Lab. Head of Department is Dr. K. Subba Reddy. CSE department has achieved over 85% "
                    "placement record with leading technology companies including TCS, Infosys, and Wipro."
                )
            },
            {
                "doc_title": "SREC Department Profile  -  Emerging Technologies (CSM & CSD)",
                "category": "DEPARTMENTS",
                "page": 3,
                "keywords": [
                    "csm", "csd", "ai", "ml", "artificial intelligence", "data science", "machine learning",
                    "deep learning", "nlp", "gpu", "generative ai", "python"
                ],
                "content": (
                    "To prepare students for Industry 4.0, SREC offers specialized B.Tech programs in CSE (Artificial Intelligence & Machine Learning - CSM) "
                    "with 120 intake, CSE (Data Science - CSD) with 60 intake, and Computer Science & Design (CSG) with 60 intake. The curriculum covers "
                    "Deep Learning, Natural Language Processing, Computer Vision, Big Data Engineering, and Generative AI, supported by high-performance GPU workstations."
                )
            },
            {
                "doc_title": "SREC Department Profile  -  Electronics & Communication Engineering",
                "category": "DEPARTMENTS",
                "page": 5,
                "keywords": [
                    "ece", "electronics", "communication", "vlsi", "embedded", "circuits", "signal",
                    "cadence", "texas instruments", "iot", "ramesh"
                ],
                "content": (
                    "Department of Electronics & Communication Engineering (ECE) is NBA accredited with an intake of 120 seats. Facilities include "
                    "Cadence VLSI Design Lab, Texas Instruments Embedded Systems Lab, Microwave & Optical Communications Lab, and an IoT Innovation Suite. "
                    "Head of Department is Dr. G. Ramesh. The department also offers M.Tech in VLSI & Embedded Systems."
                )
            },
            {
                "doc_title": "SREC Department Profile  -  Electrical & Electronics Engineering",
                "category": "DEPARTMENTS",
                "page": 6,
                "keywords": [
                    "eee", "electrical", "power", "solar", "ev", "electric vehicles", "circuits",
                    "machines", "suresh", "grid"
                ],
                "content": (
                    "Department of Electrical & Electronics Engineering (EEE) offers B.Tech with 60 seats. Laboratories include Electric Drives & Control Lab, "
                    "Power Systems & Simulation Lab, Solar Energy Research Setup, and Electric Vehicle (EV) Technology Suite. Head of Department is Dr. M. Suresh."
                )
            },
            {
                "doc_title": "SREC Department Profile  -  Postgraduate Studies (MBA & MCA)",
                "category": "DEPARTMENTS",
                "page": 9,
                "keywords": [
                    "mba", "mca", "pg", "management", "business", "master", "computer applications",
                    "finance", "marketing", "hr", "icet"
                ],
                "content": (
                    "SREC offers premier postgraduate programs: Master of Business Administration (MBA) with 120 seats and Master of Computer Applications (MCA) "
                    "with 60 seats. Specializations in MBA include Financial Management, Marketing Management, and Human Resource Management. MCA focuses on Cloud Computing, "
                    "Full-Stack Software Architecture, and Enterprise Systems. Admission is conducted through AP ICET."
                )
            },
            {
                "doc_title": "SREC Training & Placement Cell Report 2024-25",
                "category": "PLACEMENTS",
                "page": 1,
                "keywords": [
                    "placement", "placements", "recruitment", "package", "salary", "companies", "recruiters",
                    "tcs", "wipro", "infosys", "highest package", "average package", "capgemini", "jobs", "career"
                ],
                "content": (
                    "The SREC Training & Placement Cell facilitates campus recruitment across tier-1 IT services, product engineering companies, and core manufacturing industries. "
                    "During the 2024-25 academic year, over 450+ offers were received. Highest package: Rs. 12.5 LPA; Average package: Rs. 4.5 LPA. "
                    "Top recruiting partners include Tata Consultancy Services (TCS), Infosys, Wipro, Capgemini, Tech Mahindra, Cognizant, and Hexaware. "
                    "SREC holds All India 6th Rank in the EduSkills Virtual Internship Program."
                )
            },
            {
                "doc_title": "SREC Autonomous Examination & Attendance Regulations",
                "category": "EXAMINATIONS",
                "page": 8,
                "keywords": [
                    "attendance", "condonation", "detention", "percentage", "exams", "examination",
                    "cgpa", "credits", "regulations", "rules", "see", "cie", "medical", "hall ticket"
                ],
                "content": (
                    "Under SREC Autonomous Regulations, a student must secure a minimum of 75% overall attendance across all registered subjects in a semester "
                    "to be eligible to appear for Semester End Examinations (SEE). Condonation of shortage of attendance between 65% and 74% may be granted "
                    "by the Academic Council on genuine medical grounds upon submission of valid medical certificate and condonation fee. "
                    "Students with less than 65% attendance are detained and must repeat the semester in the subsequent year."
                )
            },
            {
                "doc_title": "SREC Student Handbook  -  Facilities & Hostel Life",
                "category": "CAMPUS_LIFE",
                "page": 11,
                "keywords": [
                    "hostel", "hostels", "rooms", "food", "mess", "canteen", "library", "sports",
                    "gym", "medical", "hospital", "facilities", "campus", "wifi", "living"
                ],
                "content": (
                    "SREC campus spans over 40 acres located on NH-40, Nerawada, Nandyal. Amenities include separate secured hostels for boys and girls "
                    "with biometric attendance, 24-hour security, RO drinking water, Wi-Fi, modern cafeteria, indoor badminton stadium, cricket ground, "
                    "and gymnasium. Immediate 24/7 medical access is supported by the adjacent Santhiram Medical College & General Hospital."
                )
            },
            {
                "doc_title": "SREC Central Library Information Manual",
                "category": "FACILITIES",
                "page": 1,
                "keywords": [
                    "library", "books", "journals", "digital library", "delnet", "ieee", "timings",
                    "volumes", "titles", "reading", "hours"
                ],
                "content": (
                    "The Dr. B.R. Ambedkar Central Library at SREC holds over 45,000 volumes, 6,200 unique titles, and subscribes to IEEE, DELNET, "
                    "ScienceDirect, and NPTEL online courseware. A dedicated Digital Library with 60 computers provides students seamless access to international "
                    "journals and e-books from 8:00 AM to 8:00 PM on all working days."
                )
            },
            {
                "doc_title": "SREC Campus Location, Address & Highway Connectivity Guide",
                "category": "LOCATION",
                "page": 1,
                "keywords": [
                    "location", "located", "address", "where", "nandyal", "nh40", "nh-40", "nerawada",
                    "reach", "how to reach", "kurnool", "route", "bus route", "directions", "contact"
                ],
                "content": (
                    "Santhiram Engineering College (Autonomous) is situated on National Highway 40 (NH-40), Nerawada, Nandyal - 518501, Andhra Pradesh. "
                    "The campus is easily accessible by road and rail, located approximately 12 km from Nandyal Railway Station and 60 km from Kurnool. "
                    "The college operates a fleet of over 25 institutional buses connecting students across Kurnool, Nandyal, Allagadda, Banaganapalle, "
                    "Bethamcherla, and Dhone."
                )
            },
            {
                "doc_title": "SREC Institutional Governance & Leadership Profile",
                "category": "ABOUT",
                "page": 1,
                "keywords": [
                    "chairman", "principal", "managing director", "vision", "vision and mission",
                    "leadership", "motto", "santhiramudu", "sivaram", "subramanyam", "peace and progress",
                    "history", "founded", "established"
                ],
                "content": (
                    "Santhiram Engineering College was established in 2007 by eminent philanthropist Dr. M. Santhiramudu (Chairman) under the Sri Shirdi Sai Educational Society. "
                    "The Managing Director is Mr. M. Sivaram, and the Principal is Dr. M. Venkata Subramanyam. The institution's founding motto is 'Education for Peace and Progress'. "
                    "It is an Autonomous Institution accredited with NAAC 'A' Grade, NBA-accredited programs, and affiliated to JNTUA Anantapuramu."
                )
            }
        ]

    def _calculate_keyword_overlap(self, query: str, doc: Dict[str, Any]) -> float:
        raw_tokens = re.findall(r"\w+", query.lower())
        stopwords = {
            "the", "is", "at", "which", "on", "a", "an", "and", "or",
            "for", "in", "to", "what", "where", "who", "how", "tell",
            "me", "about", "show", "can", "you", "of", "with", "are",
            "do", "does", "schedule", "give", "i", "want", "know",
            "srec", "santhiram", "college", "engineering", "nandyal"
        }
        
        q_tokens = [_normalize_token(t) for t in raw_tokens if t not in stopwords]
        if not q_tokens:
            return 0.0

        q_token_set = set(q_tokens)
        doc_keywords = {_normalize_token(k) for k in doc.get("keywords", [])}
        doc_title_tokens = {_normalize_token(t) for t in re.findall(r"\w+", doc.get("doc_title", "").lower())}
        doc_content_tokens = {_normalize_token(t) for t in re.findall(r"\w+", doc.get("content", "").lower())}

        kw_matches = len(q_token_set.intersection(doc_keywords))
        title_matches = len(q_token_set.intersection(doc_title_tokens))
        content_matches = len(q_token_set.intersection(doc_content_tokens))

        score = (title_matches * 10.0) + (kw_matches * 6.0) + (content_matches * 1.5)

        # Domain Intent Boosts
        q_full = query.lower()
        if any(term in q_full for term in ["course", "courses", "branch", "branches", "program", "programs", "degree", "degrees", "btech", "mtech", "mba", "mca", "study"]):
            if doc.get("category") == "ACADEMICS":
                score += 35.0
            elif doc.get("category") == "DEPARTMENTS":
                score += 15.0

        if any(term in q_full for term in ["admission", "eligibility", "apply", "eapcet", "eamcet", "ecet", "icet", "quota", "join"]):
            if doc.get("category") == "ADMISSIONS":
                score += 35.0

        if any(term in q_full for term in ["fee", "fees", "tuition", "cost", "scholarship", "jvd"]):
            if doc.get("category") in ["FEES_AND_REGULATIONS", "ADMISSIONS"]:
                score += 35.0

        if any(term in q_full for term in ["placement", "placements", "package", "salary", "company", "companies", "recruiter", "recruiters", "highest package"]):
            if doc.get("category") == "PLACEMENTS":
                score += 35.0

        if any(term in q_full for term in ["hostel", "hostels", "food", "mess", "room", "rooms", "stay"]):
            if doc.get("category") in ["CAMPUS_LIFE", "FEES_AND_REGULATIONS"]:
                score += 35.0

        if any(term in q_full for term in ["attendance", "condonation", "detention", "exam", "exams", "regulation", "regulations"]):
            if doc.get("category") == "EXAMINATIONS":
                score += 35.0

        if any(term in q_full for term in ["where", "location", "located", "address", "reach", "bus", "transport"]):
            if doc.get("category") == "LOCATION":
                score += 35.0

        if any(term in q_full for term in ["principal", "chairman", "founder", "motto", "leadership", "governance", "who established"]):
            if doc.get("category") == "ABOUT":
                score += 35.0

        return score

    def retrieve_relevant_documents(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        scored_docs = []
        for doc in self.knowledge_corpus:
            score = self._calculate_keyword_overlap(query, doc)
            if score >= 3.0:
                scored_docs.append((score, doc))

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        return [doc for score, doc in scored_docs[:top_k]]

    def answer_query(self, query: str, department: str = None) -> Dict[str, Any]:
        q_clean = query.strip()
        relevant_docs = self.retrieve_relevant_documents(q_clean, top_k=2)

        if not relevant_docs:
            return {
                "answer": (
                    "I couldn't find this information in the SREC knowledge base."
                ),
                "sources": [],
                "is_grounded": False,
                "confidence": 0.0
            }

        sources = []
        for doc in relevant_docs:
            sources.append({
                "document_title": doc["doc_title"],
                "category": doc["category"],
                "page_number": doc["page"],
                "relevance_snippet": doc["content"][:180].strip() + "..."
            })

        # Try OpenAI if configured
        if settings.OPENAI_API_KEY:
            try:
                import urllib.request
                context_text = "\n\n---\n\n".join([f"Document: {d['doc_title']} (Page {d['page']})\n{d['content']}" for d in relevant_docs])
                prompt = (
                    f"You are the SREC Smart Campus AI Assistant for Santhiram Engineering College (Autonomous), Nandyal.\n"
                    f"Answer the following user question accurately, helpfully, and comprehensively using ONLY the provided verified college context.\n"
                    f"Formatting: Use clean Markdown with bullet points where appropriate. Do not make up facts outside the context.\n\n"
                    f"Context:\n{context_text}\n\n"
                    f"Question: {q_clean}\n\n"
                    f"Answer:"
                )

                req_data = json.dumps({
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": "You are the official SREC Smart Campus AI Assistant. Answer questions based only on verified institutional documents."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.2,
                    "max_tokens": 800
                }).encode('utf-8')

                req = urllib.request.Request(
                    "https://api.openai.com/v1/chat/completions",
                    data=req_data,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
                    }
                )
                with urllib.request.urlopen(req, timeout=6) as response:
                    res_json = json.loads(response.read().decode('utf-8'))
                    text = res_json['choices'][0]['message']['content']
                    if text and len(text.strip()) > 20:
                        return {
                            "answer": text.strip(),
                            "sources": sources,
                            "is_grounded": True,
                            "confidence": 0.99
                        }
            except Exception as e:
                # Silently fallback
                pass

        # Try Google Gemini if configured
        if settings.GEMINI_API_KEY:
            try:
                import urllib.request
                context_text = "\n\n---\n\n".join([f"Document: {d['doc_title']}\n{d['content']}" for d in relevant_docs])
                prompt = (
                    f"You are the SREC Smart Campus AI Assistant for Santhiram Engineering College (Autonomous), Nandyal.\n"
                    f"Answer the following user question accurately and comprehensively using ONLY the provided verified college context.\n"
                    f"Formatting: Use clean Markdown with bullet points where appropriate.\n\n"
                    f"Context:\n{context_text}\n\n"
                    f"Question: {q_clean}\n\n"
                    f"Answer:"
                )
                
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.LLM_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
                req_data = json.dumps({
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.2, "maxOutputTokens": 800}
                }).encode('utf-8')

                req = urllib.request.Request(url, data=req_data, headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(req, timeout=5) as response:
                    res_json = json.loads(response.read().decode('utf-8'))
                    text = res_json['candidates'][0]['content']['parts'][0]['text']
                    if text and len(text.strip()) > 20:
                        return {
                            "answer": text.strip(),
                            "sources": sources,
                            "is_grounded": True,
                            "confidence": 0.98
                        }
            except Exception as e:
                # Silently fallback to high-quality deterministic response synthesizer
                pass

        primary_doc = relevant_docs[0]
        answer_text = (
            f"Based on official college records (**{primary_doc['doc_title']}**):\n\n"
            f"{primary_doc['content']}"
        )

        if len(relevant_docs) > 1:
            second_doc = relevant_docs[1]
            if second_doc['doc_title'] != primary_doc['doc_title']:
                answer_text += (
                    f"\n\n---\n\n"
                    f"**Additional Reference ({second_doc['doc_title']}):**\n"
                    f"{second_doc['content']}"
                )

        return {
            "answer": answer_text,
            "sources": sources,
            "is_grounded": True,
            "confidence": 0.96
        }

    def add_custom_document(self, title: str, category: str, content: str, page: int = 1, keywords: List[str] = None):
        new_doc = {
            "doc_title": title,
            "category": category,
            "page": page,
            "keywords": keywords or [w.lower() for w in re.findall(r"\w+", title)],
            "content": content
        }
        self.knowledge_corpus.append(new_doc)
        return len(self.knowledge_corpus)

rag_engine = RAGEngine()
