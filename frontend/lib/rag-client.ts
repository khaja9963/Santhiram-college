export interface KnowledgeDocument {
  doc_title: string;
  category: string;
  page: number;
  keywords: string[];
  content: string;
}

export interface GroundedCitation {
  document_title: string;
  category: string;
  page_number: number;
  relevance_snippet: string;
}

export interface RAGResponse {
  answer: string;
  sources: GroundedCitation[];
  is_grounded: boolean;
  confidence: number;
}

function normalizeToken(token: string): string {
  const w = token.toLowerCase().trim();
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('es') && w.length > 3 && !w.endsWith('ses')) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 2) return w.slice(0, -1);
  return w;
}

const STOPWORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or',
  'for', 'in', 'to', 'what', 'where', 'who', 'how', 'tell',
  'me', 'about', 'show', 'can', 'you', 'of', 'with', 'are',
  'do', 'does', 'schedule', 'give', 'i', 'want', 'know',
  'srec', 'santhiram', 'college', 'engineering', 'nandyal'
]);

export const SREC_KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    doc_title: "SREC Academic Programs & Offered Courses Directory",
    category: "ACADEMICS",
    page: 1,
    keywords: [
      "course", "courses", "program", "programs", "branch", "branches",
      "degree", "degrees", "btech", "b.tech", "mtech", "m.tech", "mba", "mca",
      "intake", "seats", "available", "offered", "stream", "streams",
      "study", "specialization", "undergraduate", "postgraduate", "ug", "pg",
      "cse", "csm", "csd", "ece", "eee", "mech", "mechanical", "civil"
    ],
    content: `Santhiram Engineering College (SREC Autonomous), Nandyal offers AICTE-approved, JNTUA-affiliated, and Autonomous Undergraduate (B.Tech) and Postgraduate (MBA, MCA, M.Tech) degree programs:

### 1. Undergraduate Engineering Programs (B.Tech - 4 Years):
- **B.Tech Computer Science & Engineering (CSE)** - 180 Seats (NBA Accredited)
- **B.Tech CSE (Artificial Intelligence & Machine Learning - CSM)** - 120 Seats
- **B.Tech CSE (Data Science - CSD)** - 60 Seats
- **B.Tech Electronics & Communication Engineering (ECE)** - 120 Seats (NBA Accredited)
- **B.Tech Electrical & Electronics Engineering (EEE)** - 60 Seats
- **B.Tech Mechanical Engineering (ME)** - 60 Seats
- **B.Tech Civil Engineering (CE)** - 60 Seats

### 2. Postgraduate Programs (PG):
- **Master of Business Administration (MBA)** - 120 Seats
- **Master of Computer Applications (MCA)** - 60 Seats
- **M.Tech in VLSI & Embedded Systems (ECE)** - 18 Seats
- **M.Tech in Computer Science & Engineering (CSE)** - 18 Seats

**Admissions Counselling Code:** AP EAPCET / ECET / ICET Code: **SREC**.
All programs follow industry-aligned autonomous regulations with experiential learning, modern laboratories, and comprehensive campus placement training.`
  },
  {
    doc_title: "SREC Admission Brochure 2025-26 & Counselling Guidelines",
    category: "ADMISSIONS",
    page: 4,
    keywords: [
      "admission", "admissions", "eligibility", "eapcet", "eamcet", "ecet", "icet",
      "apply", "applying", "seats", "process", "btech", "quota", "convener",
      "management", "counselling", "code", "criteria", "qualification", "join", "lateral entry"
    ],
    content: `Admissions to B.Tech programs at Santhiram Engineering College (Autonomous), Nandyal are conducted through:
- **Category-A (Convener Quota - 70% seats):** Allotted via AP EAPCET state counselling based on merit rank.
- **Category-B (Management Quota - 30% seats):** As per APSCHE guidelines based on 10+2 / JEE / EAPCET merit.
- **Eligibility:** Candidates must have passed 10+2 (Intermediate / CBSE / ICSE) with Mathematics, Physics, and Chemistry (MPC) with a minimum of 45% aggregate (40% for reserved categories).
- **Lateral Entry (AP ECET):** Diploma holders can gain direct entry into 2nd Year (3rd semester) B.Tech through AP ECET counselling against 10% supernumerary seats.
- **Postgraduate Admissions:** MBA and MCA admissions are administered through AP ICET; M.Tech admissions are conducted through AP PGECET / GATE.
- **Official Counselling Code:** **SREC** across all AP state counselling portals.`
  },
  {
    doc_title: "SREC Academic Regulations & Fee Schedule",
    category: "FEES_AND_REGULATIONS",
    page: 7,
    keywords: [
      "fee", "fees", "tuition", "hostel fee", "bus", "bus fee", "transportation",
      "cost", "scholarship", "jvd", "vidya deevena", "reimbursement", "payment", "expenses"
    ],
    content: `Annual fee structure and scholarship benefits at SREC:
- **Tuition Fee:** Regulated by AP Higher Education Regulatory and Monitoring Commission (APHERMC) at approximately ₹52,000 to ₹58,000 per academic year for Category-A convener quota seats.
- **Government Fee Reimbursement (JVD):** Eligible students eligible under Jagananna Vidya Deevena (JVD) receive 100% full tuition fee reimbursement credited through the AP Government scheme.
- **Residential Hostel Fee:** Approximately ₹60,000 per academic year covering hygienic dining (mess), comfortable furnished rooms, 24/7 RO mineral water, high-speed Wi-Fi, solar heated water, and round-the-clock security.
- **College Transportation Bus Fee:** Ranges between ₹15,000 to ₹22,000 per year depending on pickup routes covering Nandyal, Kurnool, Allagadda, Banaganapalle, Bethamcherla, and surrounding regions.`
  },
  {
    doc_title: "SREC Department Profile - Computer Science & Engineering",
    category: "DEPARTMENTS",
    page: 2,
    keywords: [
      "cse", "computer science", "coding", "software", "labs", "hod", "programming",
      "subba reddy", "department", "computers"
    ],
    content: `The Department of Computer Science & Engineering (CSE) was established in 2007 with NBA Accreditation and NAAC 'A' Grade:
- **Intake:** 180 annual B.Tech seats.
- **Head of Department (HOD):** Dr. K. Subba Reddy, M.Tech, Ph.D.
- **Specialized Computing Laboratories:**
  - AI & Machine Learning Computing Lab (equipped with high-compute GPU workstations)
  - Cloud Computing & Virtualization Lab
  - Data Analytics & Big Data Systems Lab
  - Open Source Software & Advanced Python Lab
  - Project Development & Innovation Studio
- **Placement Performance:** Over 85% placement rate with regular hiring by TCS, Infosys, Wipro, Capgemini, Cognizant, and Tech Mahindra.`
  },
  {
    doc_title: "SREC Department Profile - Emerging Technologies (CSM & CSD)",
    category: "DEPARTMENTS",
    page: 3,
    keywords: [
      "csm", "csd", "ai", "ml", "artificial intelligence", "data science", "machine learning",
      "deep learning", "nlp", "gpu", "generative ai", "python"
    ],
    content: `To equip students with next-generation Industry 4.0 technical skills, SREC offers specialized emerging branches:
- **B.Tech CSE (Artificial Intelligence & Machine Learning - CSM):** 120 Seats intake.
- **B.Tech CSE (Data Science - CSD):** 60 Seats intake.
- **Curriculum Highlights:** Deep Learning, Neural Networks, Natural Language Processing, Computer Vision, Big Data Engineering, Statistical Analytics, and Generative AI frameworks.
- **Industry Collaborations:** Hands-on industry projects, specialized hackathons, and EduSkills virtual internships in AWS Cloud & AI.`
  },
  {
    doc_title: "SREC Department Profile - Electronics & Communication Engineering",
    category: "DEPARTMENTS",
    page: 5,
    keywords: [
      "ece", "electronics", "communication", "vlsi", "embedded", "circuits", "signal",
      "cadence", "texas instruments", "iot", "ramesh"
    ],
    content: `The Department of Electronics & Communication Engineering (ECE) is NBA accredited with an intake of 120 seats:
- **Head of Department (HOD):** Dr. G. Ramesh.
- **Specialized Laboratories & Centers of Excellence:**
  - Cadence VLSI Design & Simulation Suite
  - Texas Instruments Embedded Systems & Microcontrollers Lab
  - Microwave, Antenna & Optical Communications Lab
  - Internet of Things (IoT) & Smart Sensors Innovation Lab
  - Digital Signal Processing (DSP) MATLAB Lab
- **Postgraduate Programs:** Offers M.Tech in VLSI & Embedded Systems (18 Seats).`
  },
  {
    doc_title: "SREC Department Profile - Electrical & Electronics Engineering",
    category: "DEPARTMENTS",
    page: 6,
    keywords: [
      "eee", "electrical", "power", "solar", "ev", "electric vehicles", "circuits",
      "machines", "suresh", "grid"
    ],
    content: `The Department of Electrical & Electronics Engineering (EEE) offers B.Tech with an annual intake of 60 seats:
- **Head of Department (HOD):** Dr. M. Suresh.
- **Key Laboratory Facilities:**
  - Electric Drives & Power Electronics Lab
  - Power Systems Simulation & Relay Protection Lab
  - Solar PV Energy Research & Green Grid Bench
  - Electric Vehicle (EV) Powertrain & Battery Management Setup`
  },
  {
    doc_title: "SREC Department Profile - Postgraduate Studies (MBA & MCA)",
    category: "DEPARTMENTS",
    page: 9,
    keywords: [
      "mba", "mca", "pg", "management", "business", "master", "computer applications",
      "finance", "marketing", "hr", "icet"
    ],
    content: `SREC offers premier postgraduate professional degree programs:
- **Master of Business Administration (MBA):** 120 Seats. Specializations in Financial Management, Marketing Management, and Human Resource Management.
- **Master of Computer Applications (MCA):** 60 Seats. Focuses on Cloud Computing, Full-Stack Enterprise Development, Database Architectures, and Software Engineering.
- **Selection:** Direct state counselling through AP ICET under code **SREC**.`
  },
  {
    doc_title: "SREC Training & Placement Cell Report 2024-25",
    category: "PLACEMENTS",
    page: 1,
    keywords: [
      "placement", "placements", "recruitment", "package", "salary", "companies", "recruiters",
      "tcs", "wipro", "infosys", "highest package", "average package", "capgemini", "jobs", "career"
    ],
    content: `The Training & Placement Cell at Santhiram Engineering College conducts structured placement readiness training starting from the 2nd year:
- **Offers Achieved (2024-25):** 450+ campus placement offers.
- **Highest Salary Package:** ₹12.50 LPA.
- **Average Salary Package:** ₹4.50 LPA.
- **Major Recruiting Partners:** Tata Consultancy Services (TCS), Infosys, Wipro, Capgemini, Tech Mahindra, Cognizant, Hexaware, HCL Technologies, and TVS Motors.
- **National Recognition:** SREC secured **All India 6th Rank** in the prestigious EduSkills Virtual Internship Program.`
  },
  {
    doc_title: "SREC Autonomous Examination & Attendance Regulations (R23)",
    category: "EXAMINATIONS",
    page: 8,
    keywords: [
      "attendance", "condonation", "detention", "percentage", "exams", "examination",
      "cgpa", "credits", "regulations", "rules", "see", "cie", "medical", "hall ticket", "minimum attendance"
    ],
    content: `Under official SREC Autonomous Academic Regulations (R23):
- **Minimum Attendance Requirement:** A student must secure a minimum of **75% aggregate attendance** across all theory and laboratory courses in a semester to be eligible for Semester End Examinations (SEE).
- **Condonation of Shortage:** Shortage of attendance between **65% and 74%** may be condoned by the Academic Council on genuine medical grounds (valid medical certificate submitted to HOD within 3 days) upon payment of prescribed condonation fee.
- **Detention Rule:** Students having **less than 65% aggregate attendance** are strictly detained. They will NOT be permitted to write Semester End Examinations and must repeat the semester in the next academic year.
- **Evaluation Pattern:** 40 Marks Continuous Internal Evaluation (CIE) + 60 Marks Semester End Examination (SEE) for theory subjects.`
  },
  {
    doc_title: "SREC Student Handbook - Facilities & Hostel Life",
    category: "CAMPUS_LIFE",
    page: 11,
    keywords: [
      "hostel", "hostels", "rooms", "food", "mess", "canteen", "library", "sports",
      "gym", "medical", "hospital", "facilities", "campus", "wifi", "living"
    ],
    content: `SREC is nestled in a green 40-acre campus on NH-40, Nerawada, Nandyal:
- **Hostel Amenities:** Dedicated safe hostels for boys and girls with biometric access control, 24/7 CCTV surveillance, Wi-Fi connectivity, hot water, and study halls.
- **Dining:** Multi-cuisine hygienic cafeteria and mess providing balanced, nutritious South Indian and North Indian food.
- **Health & Medical Care:** 24/7 emergency healthcare access supported by the adjacent super-specialty Santhiram Medical College & General Hospital.
- **Sports & Fitness:** Standard cricket field, basketball court, volleyball courts, indoor badminton stadium, table tennis, and fully equipped gymnasium.`
  },
  {
    doc_title: "SREC Central Library Information Manual",
    category: "FACILITIES",
    page: 1,
    keywords: [
      "library", "books", "journals", "digital library", "delnet", "ieee", "timings",
      "volumes", "titles", "reading", "hours"
    ],
    content: `The Dr. B.R. Ambedkar Central Library at SREC is a comprehensive academic resource center:
- **Collection:** Over 45,000+ volumes, 6,200+ unique titles, and national/international print journals.
- **Digital Library:** 60 networked computer nodes with high-speed 1 Gbps internet providing access to IEEE Xplore, DELNET, ScienceDirect, and NPTEL video courses.
- **Timings:** Open from 8:00 AM to 8:00 PM on all working days, and 9:00 AM to 1:00 PM on holidays.`
  },
  {
    doc_title: "SREC Campus Location, Address & Highway Connectivity Guide",
    category: "LOCATION",
    page: 1,
    keywords: [
      "location", "located", "address", "where", "nandyal", "nh40", "nh-40", "nerawada",
      "reach", "how to reach", "kurnool", "route", "bus route", "directions", "contact"
    ],
    content: `Santhiram Engineering College (Autonomous) is located at:
- **Address:** NH-40, Nerawada, Nandyal - 518501, Andhra Pradesh, India.
- **Connectivity:** Situated conveniently right along the four-lane Kurnool-Nandyal National Highway (NH-40).
- **Proximity:** Approximately 12 km from Nandyal Railway Station and bus depot; 60 km from Kurnool city center.
- **Bus Fleet:** 25+ institution-operated luxury buses connect the college daily across Nandyal, Kurnool, Allagadda, Banaganapalle, Bethamcherla, and Dhone.`
  },
  {
    doc_title: "SREC Institutional Governance & Leadership Profile",
    category: "ABOUT",
    page: 1,
    keywords: [
      "chairman", "principal", "managing director", "vision", "vision and mission",
      "leadership", "motto", "santhiramudu", "sivaram", "subramanyam", "peace and progress",
      "history", "founded", "established"
    ],
    content: `Santhiram Engineering College was founded in 2007 by eminent philanthropist Dr. M. Santhiramudu under the Sri Shirdi Sai Educational Society:
- **Founder & Chairman:** Dr. M. Santhiramudu
- **Managing Director:** Mr. M. Sivaram, M.S.
- **Principal:** Dr. M. Venkata Subramanyam, M.Tech, Ph.D.
- **Motto:** *"Education for Peace and Progress"*
- **Accreditations:** UGC Autonomous Status, NAAC 'A' Grade accredited, NBA accredited B.Tech programs (CSE, ECE), and permanently affiliated to JNTUA Anantapuramu.`
  }
];

export class ClientRAGEngine {
  private corpus: KnowledgeDocument[];

  constructor() {
    this.corpus = SREC_KNOWLEDGE_BASE;
  }

  private calculateKeywordOverlap(query: string, doc: KnowledgeDocument): number {
    const rawTokens = (query.toLowerCase().match(/\w+/g) || []);
    const qTokens = rawTokens
      .filter((t) => !STOPWORDS.has(t))
      .map((t) => normalizeToken(t));

    if (qTokens.length === 0) return 0.0;

    const qSet = new Set(qTokens);
    const docKeywords = new Set(doc.keywords.map((k) => normalizeToken(k)));
    const docTitleTokens = new Set((doc.doc_title.toLowerCase().match(/\w+/g) || []).map((t) => normalizeToken(t)));
    const docContentTokens = new Set((doc.content.toLowerCase().match(/\w+/g) || []).map((t) => normalizeToken(t)));

    let kwMatches = 0;
    qSet.forEach((token) => {
      if (docKeywords.has(token)) kwMatches++;
    });

    let titleMatches = 0;
    qSet.forEach((token) => {
      if (docTitleTokens.has(token)) titleMatches++;
    });

    let contentMatches = 0;
    qSet.forEach((token) => {
      if (docContentTokens.has(token)) contentMatches++;
    });

    let score = titleMatches * 12.0 + kwMatches * 7.0 + contentMatches * 1.5;

    const qFull = query.toLowerCase();

    // Domain Intent Boosts
    if (['course', 'courses', 'branch', 'branches', 'program', 'programs', 'degree', 'degrees', 'btech', 'mtech', 'mba', 'mca', 'study', 'intake', 'seats'].some((term) => qFull.includes(term))) {
      if (doc.category === 'ACADEMICS') score += 40.0;
      else if (doc.category === 'DEPARTMENTS') score += 18.0;
    }

    if (['admission', 'eligibility', 'apply', 'eapcet', 'eamcet', 'ecet', 'icet', 'quota', 'convener', 'management', 'join', 'lateral entry'].some((term) => qFull.includes(term))) {
      if (doc.category === 'ADMISSIONS') score += 40.0;
    }

    if (['fee', 'fees', 'tuition', 'cost', 'scholarship', 'jvd', 'reimbursement', 'hostel fee', 'bus fee'].some((term) => qFull.includes(term))) {
      if (['FEES_AND_REGULATIONS', 'ADMISSIONS'].includes(doc.category)) score += 40.0;
    }

    if (['placement', 'placements', 'package', 'salary', 'company', 'companies', 'recruiter', 'recruiters', 'highest package', 'average package', 'offer', 'tcs', 'wipro', 'infosys'].some((term) => qFull.includes(term))) {
      if (doc.category === 'PLACEMENTS') score += 40.0;
    }

    if (['hostel', 'hostels', 'food', 'mess', 'room', 'rooms', 'stay', 'living', 'wifi', 'sports', 'gym', 'hospital'].some((term) => qFull.includes(term))) {
      if (['CAMPUS_LIFE', 'FEES_AND_REGULATIONS'].includes(doc.category)) score += 40.0;
    }

    if (['attendance', 'condonation', 'detention', 'exam', 'exams', 'regulation', 'regulations', 'r23', 'credits', 'rules', 'percentage', 'detained'].some((term) => qFull.includes(term))) {
      if (doc.category === 'EXAMINATIONS') score += 40.0;
    }

    if (['library', 'books', 'journals', 'digital library', 'delnet', 'ieee', 'reading'].some((term) => qFull.includes(term))) {
      if (doc.category === 'FACILITIES') score += 40.0;
    }

    if (['where', 'location', 'located', 'address', 'reach', 'bus', 'transport', 'connectivity', 'nandyal', 'highway', 'distance'].some((term) => qFull.includes(term))) {
      if (doc.category === 'LOCATION') score += 40.0;
    }

    if (['principal', 'chairman', 'founder', 'motto', 'leadership', 'governance', 'established', 'director', 'santhiramudu', 'subramanyam', 'sivaram'].some((term) => qFull.includes(term))) {
      if (doc.category === 'ABOUT') score += 40.0;
    }

    if (['cse', 'computer science', 'subba reddy'].some((term) => qFull.includes(term)) && doc.doc_title.includes('Computer Science')) {
      score += 45.0;
    }
    if (['ece', 'electronics', 'cadence', 'ramesh'].some((term) => qFull.includes(term)) && doc.doc_title.includes('Electronics & Communication')) {
      score += 45.0;
    }
    if (['eee', 'electrical', 'solar', 'suresh'].some((term) => qFull.includes(term)) && doc.doc_title.includes('Electrical & Electronics')) {
      score += 45.0;
    }

    return score;
  }

  public retrieveRelevantDocuments(query: string, topK = 2): KnowledgeDocument[] {
    const scoredDocs: { score: number; doc: KnowledgeDocument }[] = [];
    for (const doc of this.corpus) {
      const score = this.calculateKeywordOverlap(query, doc);
      if (score >= 2.5) {
        scoredDocs.push({ score, doc });
      }
    }

    scoredDocs.sort((a, b) => b.score - a.score);
    return scoredDocs.slice(0, topK).map((item) => item.doc);
  }

  public async answerQuery(query: string, department?: string): Promise<RAGResponse> {
    const qClean = query.trim();
    if (!qClean) {
      return {
        answer: "Please enter a question about Santhiram Engineering College (courses, admissions, hostel, fees, regulations, or placements).",
        sources: [],
        is_grounded: false,
        confidence: 0.0,
      };
    }

    const relevantDocs = this.retrieveRelevantDocuments(qClean, 2);

    if (relevantDocs.length === 0) {
      return {
        answer: `I could not locate an exact match in the official SREC document repository for "${qClean}".

You can ask about:
- **Offered Courses & Intakes** (B.Tech in CSE, CSM, CSD, ECE, EEE, ME, CE, MBA, MCA)
- **Admission Process & Eligibility** (AP EAPCET code: **SREC**, convener & management quota)
- **Tuition & Hostel Fees** (₹52,000 tuition, JVD reimbursement, ₹60,000 hostel fee)
- **Autonomous Regulations (R23)** (75% minimum attendance requirement, condonation rules)
- **Placements & Packages** (Highest: ₹12.5 LPA, 450+ offers, top recruiters)
- **Campus Location & Bus Routes** (NH-40, Nerawada, Nandyal, bus fleet)`,
        sources: [],
        is_grounded: false,
        confidence: 0.2,
      };
    }

    const sources: GroundedCitation[] = relevantDocs.map((doc) => ({
      document_title: doc.doc_title,
      category: doc.category,
      page_number: doc.page,
      relevance_snippet: doc.content.slice(0, 190).trim() + "...",
    }));

    // Optional: If user has NEXT_PUBLIC_GEMINI_API_KEY in their environment, we can do client-side Gemini generation
    const geminiKey = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GEMINI_API_KEY : undefined;
    if (geminiKey) {
      try {
        const contextText = relevantDocs
          .map((d) => `Document: ${d.doc_title} (Page ${d.page})\n${d.content}`)
          .join('\n\n---\n\n');
        
        const prompt = `You are the SREC Smart Campus AI Assistant for Santhiram Engineering College (Autonomous), Nandyal.
Answer the following user question accurately and comprehensively using ONLY the provided verified college context.
Formatting: Use clean Markdown with bullet points where appropriate.

Context:
${contextText}

Question: ${qClean}

Answer:`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim().length > 20) {
            return {
              answer: generatedText.trim(),
              sources,
              is_grounded: true,
              confidence: 0.98,
            };
          }
        }
      } catch {
        // Fallback to deterministic synthesizer
      }
    }

    // High-quality deterministic response synthesis
    const primary = relevantDocs[0];
    let answerText = `Based on official college records (**${primary.doc_title}**):\n\n${primary.content}`;

    if (relevantDocs.length > 1 && relevantDocs[1].doc_title !== primary.doc_title) {
      const secondary = relevantDocs[1];
      answerText += `\n\n---\n\n**Additional Reference (${secondary.doc_title}):**\n${secondary.content}`;
    }

    return {
      answer: answerText,
      sources,
      is_grounded: true,
      confidence: 0.96,
    };
  }
}

export const clientRAGEngine = new ClientRAGEngine();
