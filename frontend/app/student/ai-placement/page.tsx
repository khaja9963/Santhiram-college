'use client';

import React, { useState } from 'react';
import {
  Briefcase, FileText, Sparkles, CheckCircle2,
  AlertCircle, ArrowRight, UserCheck, RefreshCw, Send, Award, HelpCircle
} from 'lucide-react';
import { AI_API } from '@/lib/api';
import { ResumeAnalysis, MockInterviewFeedback } from '@/types';

export default function AIPlacementPage() {
  const [activeTab, setActiveTab] = useState<'resume' | 'mock'>('resume');

  // Resume State
  const [resumeText, setResumeText] = useState(
    `Sai Teja Reddy\nB.Tech in Computer Science and Engineering, Santhiram Engineering College (Autonomous), CGPA: 8.64\n\nTechnical Skills: Python, FastAPI, PostgreSQL, React, Next.js, Git, Data Structures and Algorithms, HTML/CSS.\n\nProjects:\n1. Smart Campus Portal with RAG Architecture: Built a vector search college assistant using FastAPI and pgvector.\n2. Automated Student Attendance System: OpenCV and Python biometric tracking application.\n\nCertifications: EduSkills Virtual Internship in Cloud Architecture, NPTEL Programming in Python.`
  );
  const [targetRole, setTargetRole] = useState('Python Backend Developer');
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);

  // Mock Interview State
  const [mockRole, setMockRole] = useState('Python Developer');
  const [questionNum, setQuestionNum] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<any>({
    question_number: 1,
    total_questions: 3,
    question: "Explain how Python's memory management and garbage collection work, specifically regarding reference counting and cyclical garbage collection.",
    topic: 'Memory Management & Internals',
  });
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluatingAnswer, setEvaluatingAnswer] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<MockInterviewFeedback | null>(null);

  // Resume analysis trigger
  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) return;
    setAnalyzingResume(true);
    try {
      const res = await AI_API.analyzeResume(resumeText, targetRole);
      setAnalysisResult(res);
    } catch (err) {
      alert('Resume analysis failed.');
    } finally {
      setAnalyzingResume(false);
    }
  };

  // Submit interview answer
  const handleSubmitAnswer = async () => {
    if (!studentAnswer.trim()) return;
    setEvaluatingAnswer(true);
    try {
      const res = await AI_API.submitInterviewAnswer(
        currentQuestion.question,
        studentAnswer,
        mockRole,
        questionNum
      );
      setAnswerFeedback(res);
    } catch (err) {
      alert('Evaluation failed.');
    } finally {
      setEvaluatingAnswer(false);
    }
  };

  const handleNextQuestion = async () => {
    const nextIdx = questionNum + 1;
    setQuestionNum(nextIdx);
    setStudentAnswer('');
    setAnswerFeedback(null);
    try {
      const q = await AI_API.getInterviewQuestion(mockRole, nextIdx);
      setCurrentQuestion(q);
    } catch (e) {
      // End or reset
      setQuestionNum(1);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SREC Placement Cell & Corporate Training Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          AI Placement & Mock Interview Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Evaluate your resume for Tier-1 campus placement readiness, identify skill gaps, and practice simulated technical interview rounds.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('resume')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'resume'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Resume Analysis & Skill Gap Audit
        </button>

        <button
          onClick={() => setActiveTab('mock')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'mock'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Technical Mock Interview Simulator
        </button>
      </div>

      {/* Tab 1: Resume Analysis */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Target Campus Job Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option>Python Backend Developer</option>
                  <option>Full-Stack Web Developer</option>
                  <option>AI / Machine Learning Engineer</option>
                  <option>Embedded Systems & IoT Engineer</option>
                  <option>Data Engineer / Analyst</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Resume Content</label>
                <div className="text-[11px] text-slate-500 pt-2">
                  Paste resume text below (or use the pre-loaded student sample)
                </div>
              </div>
            </div>

            <textarea
              rows={7}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-blue-600 outline-hidden bg-slate-50/50 resize-none"
            />

            <button
              onClick={handleAnalyzeResume}
              disabled={analyzingResume}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{analyzingResume ? 'Parsing & Auditing Skills...' : 'Audit Resume & Skill Gaps'}</span>
            </button>
          </div>

          {/* Analysis Results View */}
          {analysisResult && (
            <div className="space-y-6 animate-in fade-in">
              {/* Top Score Banner */}
              <div className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Placement Readiness Score</span>
                  <div className="text-3xl sm:text-4xl font-black">
                    {analysisResult.ats_score} / 100 <span className="text-base font-bold text-emerald-300">ATS Optimized</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Calculated against Tier-1 IT services & product recruiter criteria (TCS, Infosys, Capgemini).
                  </p>
                </div>

                <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-xs text-xs space-y-1">
                  <div className="font-bold text-amber-300">Verified Education:</div>
                  <div className="text-slate-200">{analysisResult.education_summary}</div>
                  <div className="text-slate-400">Level: {analysisResult.experience_level}</div>
                </div>
              </div>

              {/* Skills Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Detected Technical Skills */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Detected Technical Skills ({analysisResult.technical_skills.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {analysisResult.technical_skills.map((s, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skill Gaps */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Identified Skill Gaps for {targetRole}</span>
                  </h3>
                  <div className="space-y-2 pt-1">
                    {analysisResult.skill_gap.map((g, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                        <span className="text-amber-700 font-bold">&bull;</span>
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Roles & Actionable Suggestions */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">Recommended Engineering Job Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommended_roles.map((r, i) => (
                      <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <h3 className="text-base font-bold text-slate-900">Actionable Suggestions to Improve Resume</h3>
                  <div className="space-y-2">
                    {analysisResult.improvement_suggestions.map((sug, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Technical Mock Interview Simulator */}
      {activeTab === 'mock' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Select Target Interview Role</label>
                <select
                  value={mockRole}
                  onChange={(e) => {
                    setMockRole(e.target.value);
                    setQuestionNum(1);
                    setAnswerFeedback(null);
                    AI_API.getInterviewQuestion(e.target.value, 1).then((q) => setCurrentQuestion(q));
                  }}
                  className="w-full sm:w-64 text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option>Python Developer</option>
                  <option>Full Stack Developer</option>
                  <option>AI Engineer</option>
                </select>
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Question {currentQuestion.question_number} of {currentQuestion.total_questions} &bull; {currentQuestion.topic}
              </div>
            </div>

            {/* Current Question Box */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-2">
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-700" />
                <span>Interviewer Question:</span>
              </div>
              <div className="text-sm font-bold text-slate-900 leading-relaxed">
                {currentQuestion.question}
              </div>
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Your Technical Answer</label>
              <textarea
                rows={5}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your structured technical explanation here as you would in a real interview..."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-600 outline-hidden bg-slate-50/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                onClick={handleSubmitAnswer}
                disabled={evaluatingAnswer || !studentAnswer.trim()}
                className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{evaluatingAnswer ? 'Evaluating Technical Depth...' : 'Submit Answer for AI Feedback'}</span>
              </button>

              {answerFeedback && (
                <button
                  onClick={handleNextQuestion}
                  className="bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Feedback Card */}
          {answerFeedback && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">AI Technical Evaluation</span>
                  <h3 className="text-lg font-black text-slate-900">Score: {answerFeedback.score} / 10</h3>
                </div>
                <div className="text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-bold">
                  {answerFeedback.relevance}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Technical Depth:</div>
                  <div className="text-slate-600">{answerFeedback.technical_depth}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Articulation & Clarity:</div>
                  <div className="text-slate-600">{answerFeedback.clarity_feedback}</div>
                </div>
              </div>

              {answerFeedback.missing_concepts.length > 0 && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Missing Concepts to Strengthen Your Answer:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-amber-900">
                    {answerFeedback.missing_concepts.map((concept, i) => (
                      <li key={i}>{concept}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-blue-950">Model Industry Response Outline:</div>
                <p className="text-blue-900 italic leading-relaxed">
                  {answerFeedback.sample_model_answer}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
