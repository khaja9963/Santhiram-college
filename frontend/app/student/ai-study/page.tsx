'use client';

import React, { useState } from 'react';
import {
  BookOpen, Sparkles, CheckCircle2, HelpCircle,
  FileText, Award, RefreshCw, Send, Check, X, AlertCircle
} from 'lucide-react';
import { AI_API } from '@/lib/api';
import { QuizQuestion } from '@/types';

export default function AIStudyPage() {
  const [department, setDepartment] = useState('CSE');
  const [year, setYear] = useState('III Year');
  const [semester, setSemester] = useState('II Semester');
  const [subject, setSubject] = useState('Database Management Systems');

  const [activeMode, setActiveMode] = useState<'explain' | 'quiz' | 'summary'>('explain');

  // Concept Explainer state
  const [topicInput, setTopicInput] = useState('Normalization and ACID properties');
  const [explainLoading, setExplainLoading] = useState(false);
  const [explanationResult, setExplanationResult] = useState<any>(null);

  // Quiz state
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizEvaluation, setQuizEvaluation] = useState<any>(null);

  // Explain concept handler
  const handleExplain = async () => {
    if (!topicInput.trim()) return;
    setExplainLoading(true);
    try {
      const res = await AI_API.explainConcept(subject, topicInput);
      setExplanationResult(res);
    } catch (e) {
      alert('Failed to generate explanation. Please try again.');
    } finally {
      setExplainLoading(false);
    }
  };

  // Generate quiz handler
  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setQuizEvaluation(null);
    try {
      const res = await AI_API.generateQuiz(subject, topicInput, 5);
      setQuizQuestions(res.questions);
    } catch (e) {
      alert('Failed to generate quiz questions.');
    } finally {
      setQuizLoading(false);
    }
  };

  // Evaluate quiz handler
  const handleEvaluateQuiz = async () => {
    if (Object.keys(selectedAnswers).length === 0) {
      alert('Please select answers before submitting.');
      return;
    }
    try {
      const res = await AI_API.evaluateQuiz(subject, selectedAnswers, quizQuestions);
      setQuizEvaluation(res);
      setQuizSubmitted(true);
    } catch (e) {
      alert('Evaluation failed.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SREC Autonomous Curriculum AI Tutor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          AI Study Assistant & Quiz Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select your engineering branch, year, and subject to generate concept breakdowns, interactive quizzes, and revision summaries.
        </p>
      </div>

      {/* Curriculum Context Selectors */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option value="CSE">Computer Science & Engg (CSE)</option>
            <option value="CSM">CSE (AI & ML)</option>
            <option value="CSD">CSE (Data Science)</option>
            <option value="ECE">Electronics & Communication (ECE)</option>
            <option value="EEE">Electrical & Electronics (EEE)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Academic Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option>I Year</option>
            <option>II Year</option>
            <option>III Year</option>
            <option>IV Year</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option>I Semester</option>
            <option>II Semester</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option>Database Management Systems</option>
            <option>Operating Systems</option>
            <option>Machine Learning & AI</option>
            <option>Computer Networks</option>
            <option>Cloud Computing Technologies</option>
          </select>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-3">
        <button
          onClick={() => setActiveMode('explain')}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeMode === 'explain'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          1. Concept Explainer & Analogy
        </button>

        <button
          onClick={() => {
            setActiveMode('quiz');
            if (quizQuestions.length === 0) handleGenerateQuiz();
          }}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeMode === 'quiz'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2. Interactive MCQ Quiz
        </button>
      </div>

      {/* Mode 1: Concept Explainer */}
      {activeMode === 'explain' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                What concept or topic in {subject} would you like explained?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g. Normalization (1NF, 2NF, 3NF, BCNF) or Deadlock Coffman Conditions"
                  className="flex-1 p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-600 outline-hidden bg-slate-50/60"
                />
                <button
                  onClick={handleExplain}
                  disabled={explainLoading}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-transform active:scale-95 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{explainLoading ? 'Analyzing...' : 'Ask AI Tutor'}</span>
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Try:</span>
              {['Normalization in DBMS', 'Virtual Memory & Paging in OS', 'Transformers Self-Attention in AI', 'TCP 3-Way Handshake in Networks'].map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopicInput(t);
                  }}
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-600 px-2.5 py-1 rounded-full text-[11px] font-medium border border-slate-200 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation Output */}
          {explanationResult && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Concept Analysis</span>
                <h3 className="text-xl font-black text-slate-900">{explanationResult.topic}</h3>
              </div>

              {/* Main Explanation Body */}
              <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {explanationResult.explanation}
              </div>

              {/* Real World Analogy Box */}
              <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-5 space-y-2">
                <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Intuitive Real-World Analogy:</span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed italic">
                  {explanationResult.real_world_analogy}
                </p>
              </div>

              {/* Practice Problem */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>University Examination Practice Problem:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-mono">
                  {explanationResult.practice_problem}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Interactive MCQ Quiz */}
      {activeMode === 'quiz' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Subject Quiz: {subject}
              </h3>
              <p className="text-xs text-slate-500">
                Answer each multiple choice question and receive instant evaluation with verified explanations.
              </p>
            </div>
            <button
              onClick={handleGenerateQuiz}
              disabled={quizLoading}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${quizLoading ? 'animate-spin' : ''}`} />
              <span>New Questions</span>
            </button>
          </div>

          {/* Quiz Score Banner (if submitted) */}
          {quizSubmitted && quizEvaluation && (
            <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Evaluation Score</div>
              <div className="text-3xl font-black">
                {quizEvaluation.score} / {quizEvaluation.total}{' '}
                <span className="text-lg font-bold text-amber-300">({quizEvaluation.percentage}%)</span>
              </div>
              <p className="text-xs text-slate-300">{quizEvaluation.feedback}</p>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-6">
            {quizQuestions.map((q, qIndex) => {
              const selected = selectedAnswers[q.id];
              const evalItem = quizEvaluation?.breakdown?.find((b: any) => b.question_id === q.id);

              return (
                <div
                  key={q.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-bold text-sm text-slate-900">
                      Question {qIndex + 1}. {q.question}
                    </span>
                    {quizSubmitted && evalItem && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
                        evalItem.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {evalItem.is_correct ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>{evalItem.is_correct ? 'Correct' : 'Incorrect'}</span>
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIndex) => {
                      const optLetter = opt[0]; // 'A', 'B', 'C', 'D'
                      const isChosen = selected === optLetter;
                      const isCorrect = quizSubmitted && q.correct_option === optLetter;

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => {
                            setSelectedAnswers((prev) => ({ ...prev, [q.id]: optLetter }));
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                              : isChosen
                              ? 'bg-blue-50 border-blue-600 text-blue-900'
                              : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {quizSubmitted && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                      <div className="font-bold text-slate-800">Explanation:</div>
                      <div>{q.explanation}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          {quizQuestions.length > 0 && !quizSubmitted && (
            <button
              onClick={handleEvaluateQuiz}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition-transform active:scale-98"
            >
              Submit & Evaluate Answers
            </button>
          )}
        </div>
      )}
    </div>
  );
}
