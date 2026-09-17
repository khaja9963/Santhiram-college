import { QuizQuestion, ResumeAnalysis, MockInterviewFeedback } from '@/types';

export const StudyAssistantClient = {
  curriculumQuizzes: {
    dbms: [
      {
        id: 1,
        question: "Which normal form removes partial functional dependency on the primary key?",
        options: [
          "A. First Normal Form (1NF)",
          "B. Second Normal Form (2NF)",
          "C. Third Normal Form (3NF)",
          "D. Boyce-Codd Normal Form (BCNF)"
        ],
        correct_option: "B",
        explanation: "Second Normal Form (2NF) mandates that the table must be in 1NF and every non-prime attribute must be fully functionally dependent on the entire primary key."
      },
      {
        id: 2,
        question: "In ACID properties of database transactions, what does 'Atomicity' guarantee?",
        options: [
          "A. Transactions execute concurrently without interference",
          "B. Either all operations of a transaction succeed, or none take effect",
          "C. The database remains in a valid state before and after execution",
          "D. Changes persist permanently even across hardware failures"
        ],
        correct_option: "B",
        explanation: "Atomicity ensures an 'all-or-nothing' execution. If any operation fails within a transaction, the entire transaction is rolled back."
      },
      {
        id: 3,
        question: "Which index structure is most widely used in relational database engines for fast range queries?",
        options: [
          "A. Hash Index",
          "B. B+ Tree",
          "C. Binary Search Tree",
          "D. Inverted Index"
        ],
        correct_option: "B",
        explanation: "B+ Trees maintain balanced depth and store data pointers exclusively at linked leaf nodes, enabling logarithmic range and equality lookups."
      },
      {
        id: 4,
        question: "What is the primary difference between DELETE and TRUNCATE in SQL?",
        options: [
          "A. DELETE is DDL while TRUNCATE is DML",
          "B. TRUNCATE can have a WHERE clause, DELETE cannot",
          "C. DELETE logs row by row and can be rolled back; TRUNCATE deallocates data pages directly",
          "D. There is no operational difference"
        ],
        correct_option: "C",
        explanation: "DELETE is a DML statement that removes rows individually with transactional logging. TRUNCATE is a DDL command that deallocates data pages rapidly."
      },
      {
        id: 5,
        question: "In a database deadlock scenario, which set of conditions must hold according to Coffman's criteria?",
        options: [
          "A. Circular Wait, Mutual Exclusion, Hold & Wait, No Preemption",
          "B. Starvation, Paging, Fragmentation, Thrashing",
          "C. Serialization, Isolation, Durability, Atomicity",
          "D. Normalization, Denormalization, Indexing, Partitioning"
        ],
        correct_option: "A",
        explanation: "Deadlock can occur if and only if all four Coffman conditions (Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait) hold simultaneously."
      }
    ],
    os: [
      {
        id: 1,
        question: "Which CPU scheduling algorithm is non-preemptive and assigns CPU to the process with smallest burst time?",
        options: [
          "A. Round Robin (RR)",
          "B. Shortest Job First (SJF)",
          "C. Shortest Remaining Time First (SRTF)",
          "D. Multi-Level Feedback Queue"
        ],
        correct_option: "B",
        explanation: "Shortest Job First (SJF) when non-preemptive assigns the CPU to the shortest burst job without preempting it until completion."
      },
      {
        id: 2,
        question: "What causes 'Thrashing' in an operating system virtual memory manager?",
        options: [
          "A. High CPU utilization with low memory demand",
          "B. Excessive page faults causing the system to spend more time swapping pages than executing instructions",
          "C. Overheating of the primary CPU core",
          "D. Deadlock between threads accessing a shared mutex"
        ],
        correct_option: "B",
        explanation: "Thrashing occurs when total working set size of active processes exceeds physical RAM, causing constant page faulting."
      }
    ]
  },

  async explainConcept(subject: string, topic: string, difficulty = 'intermediate') {
    return {
      subject,
      topic,
      difficulty,
      summary: `Comprehensive academic conceptual breakdown of **${topic}** under SREC Autonomous Curriculum (${subject}).`,
      detailed_explanation: `### Conceptual Core: ${topic}\n\nIn **${subject}**, mastering **${topic}** is critical for engineering design and autonomous examination performance.\n\n` +
        `#### Key Principles & Mechanics:\n` +
        `1. **Theoretical Foundation:** Establishes predictable state transformations, modular code structure, and standard algorithmic complexity.\n` +
        `2. **Industry Relevance:** Employed extensively in modern enterprise architectures to guarantee transactional consistency, fault tolerance, and scalability.\n` +
        `3. **Autonomous Examination Strategy:** When answering 10-mark descriptive questions on this topic, always draw the architectural block diagram, specify time complexity, and illustrate with a clean code/query example.\n\n` +
        `#### Core Advantages:\n` +
        `- Eliminates structural anomalies and data redundancy.\n` +
        `- Guarantees predictable asymptotic time bounds (O(log n) to O(n)).\n` +
        `- Aligns with industry standards across tier-1 software companies.`,
      key_points: [
        `Definition and primary mathematical/architectural formulations of ${topic}`,
        `Comparative analysis versus alternative classical approaches`,
        `Real-world enterprise application in production software systems`,
        `Standard semester end examination evaluation rubrics`
      ],
      exam_tips: [
        "Include labeled block diagrams to secure maximum marks in CIE and SEE.",
        "Clearly contrast best-case, average-case, and worst-case scenarios.",
        "Reference official SREC autonomous course outcomes (COs) and unit objectives."
      ]
    };
  },

  async generateQuiz(subject: string, topic: string, count = 5) {
    const key = subject.toLowerCase().includes('dbms') || subject.toLowerCase().includes('database')
      ? 'dbms'
      : 'os';
    const pool = this.curriculumQuizzes[key] || this.curriculumQuizzes.dbms;
    const questions: QuizQuestion[] = pool.slice(0, count).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correct_option: q.correct_option,
      explanation: q.explanation
    }));

    return {
      subject,
      topic,
      total_questions: questions.length,
      questions
    };
  },

  async evaluateQuiz(subject: string, userAnswers: Record<number, string>, questions: QuizQuestion[]) {
    let score = 0;
    const breakdown = questions.map((q) => {
      const userSelected = userAnswers[q.id];
      const isCorrect = userSelected === q.correct_option;
      if (isCorrect) score += 1;
      return {
        question_id: q.id,
        question: q.question,
        user_answer: userSelected || 'Skipped',
        correct_answer: q.correct_option,
        is_correct: isCorrect,
        explanation: q.explanation || ''
      };
    });

    const percentage = Math.round((score / Math.max(1, questions.length)) * 100);
    return {
      total_questions: questions.length,
      correct_count: score,
      score_percentage: percentage,
      status: percentage >= 60 ? 'PASSED' : 'NEEDS_PRACTICE',
      feedback: percentage >= 80
        ? 'Outstanding understanding of core autonomous syllabus concepts!'
        : percentage >= 60
        ? 'Good progress! Review key points to prepare for Semester End Examinations.'
        : 'Recommended: Revisit lecture notes and laboratory assignments for this module.',
      breakdown
    };
  }
};

export const PlacementAssistantClient = {
  interviewQuestions: {
    'python developer': [
      {
        q: "Explain how Python's memory management and garbage collection work, specifically regarding reference counting and cyclical garbage collection.",
        topic: "Memory Management & Internals"
      },
      {
        q: "What is the difference between a shallow copy and a deep copy in Python? When would you use copy.deepcopy?",
        topic: "Object Mutability & Copies"
      },
      {
        q: "Describe how Python generators and the 'yield' statement work. Why are they preferred for processing large datasets?",
        topic: "Generators & Memory Efficiency"
      }
    ],
    'full stack developer': [
      {
        q: "How does Next.js handle Server-Side Rendering (SSR) vs Static Site Generation (SSG), and how do Client Components hydrate?",
        topic: "Modern Web Architectures"
      },
      {
        q: "Explain Cross-Origin Resource Sharing (CORS) and the mechanism behind preflight OPTIONS requests.",
        topic: "Web Security & HTTP"
      }
    ],
    'ai engineer': [
      {
        q: "Explain the trade-offs between dense embeddings and sparse keyword search (BM25) in Retrieval-Augmented Generation (RAG) systems.",
        topic: "RAG & Vector Search"
      },
      {
        q: "How do you detect and prevent catastrophic forgetting when fine-tuning Large Language Models with LoRA?",
        topic: "LLM Fine-tuning"
      }
    ]
  },

  async analyzeResume(resumeText: string, targetRole = 'Software Development Engineer'): Promise<ResumeAnalysis> {
    const textLower = resumeText.toLowerCase();
    const techCatalog = [
      'python', 'java', 'c++', 'c', 'javascript', 'typescript', 'react', 'next.js', 'node.js',
      'sql', 'postgresql', 'mysql', 'mongodb', 'fastapi', 'django', 'docker', 'aws', 'git', 'html', 'css'
    ];
    const foundTech = techCatalog.filter((t) => textLower.includes(t)).map((t) => t.toUpperCase());

    const atsScore = Math.min(95, Math.max(65, 60 + foundTech.length * 4));

    return {
      ats_score: atsScore,
      technical_skills: foundTech.length > 0 ? foundTech : ['Python', 'SQL', 'Git', 'Data Structures'],
      soft_skills: ['Problem Solving', 'Team Collaboration', 'Effective Technical Communication'],
      education_summary: 'B.Tech - Santhiram Engineering College (Autonomous)',
      experience_level: 'Fresher / Entry-Level Engineer',
      skill_gap: [
        'Containerization & Microservices (Docker / Kubernetes)',
        'Automated CI/CD Workflows (GitHub Actions)',
        'Cloud Deployment & Infrastructure (AWS EC2 / S3)'
      ],
      recommended_roles: [
        targetRole,
        'Associate Software Engineer',
        'Full-Stack Web Developer'
      ],
      improvement_suggestions: [
        'Quantify project achievements with metrics (e.g. reduced load time by 35%, served 500+ users)',
        'Add live GitHub repository and hosted deployment URLs',
        'Highlight certifications and EduSkills Virtual Internship credentials'
      ]
    };
  },

  async getInterviewQuestion(role = 'Python Developer', questionNumber = 1) {
    const roleKey = Object.keys(this.interviewQuestions).find((k) =>
      role.toLowerCase().includes(k) || k.includes(role.toLowerCase())
    ) || 'python developer';

    const pool = (this.interviewQuestions as any)[roleKey] || this.interviewQuestions['python developer'];
    const idx = Math.min(questionNumber - 1, pool.length - 1);
    const item = pool[idx];

    return {
      question_number: questionNumber,
      total_questions: pool.length,
      question: item.q,
      topic: item.topic
    };
  },

  async submitInterviewAnswer(question: string, studentAnswer: string, roleTarget: string, questionNumber = 1): Promise<MockInterviewFeedback> {
    const len = studentAnswer.trim().length;
    const score = Math.min(95, Math.max(60, 60 + Math.floor(len / 15)));

    return {
      score,
      relevance: score >= 80 ? 'Highly Relevant' : 'Moderately Relevant',
      technical_depth: score >= 85 ? 'Strong Technical Depth' : 'Satisfactory Fundamentals',
      missing_concepts: [
        'Could mention real-world profiling tools or standard library modules',
        'Explain edge-case failure modes or cyclic reference resolutions'
      ],
      clarity_feedback: 'Well-structured explanation suitable for technical interview rounds with tier-1 recruiters.',
      sample_model_answer: `A top-scoring answer would explicitly state the primary mechanism, contrast it with alternative approaches, and provide a concrete practical example or complexity analysis.`
    };
  }
};
