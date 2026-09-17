'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck, Award, CreditCard, Clock, FileCheck2,
  AlertTriangle, CheckCircle2, ArrowRight, BookOpen, Briefcase,
  Bell, ChevronRight, User, Sparkles
} from 'lucide-react';
import { StudentAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getStudentAttendanceSummary } from '@/lib/attendance-store';
import { StudentAttendanceOverview } from '@/types';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const studentRoll = user?.user_code || '22X51A0501';

  const [liveSummary, setLiveSummary] = useState(() => getStudentAttendanceSummary(studentRoll));

  useEffect(() => {
    const refresh = () => {
      setLiveSummary(getStudentAttendanceSummary(user?.user_code || '22X51A0501'));
    };

    refresh();
    window.addEventListener('srec_attendance_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('srec_attendance_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] to-blue-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs px-3 py-1 rounded-full font-semibold">
            B.Tech Autonomous R23 &bull; Semester VI &bull; Section A
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, Sai Teja Reddy
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Roll No: <span className="font-mono text-amber-300 font-bold">22X51A0501</span> &bull; Dept of Computer Science & Engineering
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/student/ai-study"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
          >
            <BookOpen className="w-4 h-4" />
            <span>AI Study Prep</span>
          </Link>
          <Link
            href="/student/ai-placement"
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-white/20 flex items-center gap-1.5 backdrop-blur-xs transition-transform hover:scale-105"
          >
            <Briefcase className="w-4 h-4 text-emerald-300" />
            <span>AI Placement & Mock</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Attendance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {liveSummary.overall_percentage}%
          </div>
          <div className={`text-[11px] font-medium flex items-center gap-1 ${
            liveSummary.is_low_attendance ? 'text-red-600' : 'text-emerald-600'
          }`}>
            {liveSummary.is_low_attendance ? (
              <>
                <AlertTriangle className="w-3 h-3 text-red-600" />
                <span>Attendance Shortage (&lt;75%)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>Eligible for Exams (&gt;75%)</span>
              </>
            )}
          </div>
        </div>

        {/* CGPA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Cumulative GPA</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">8.64</div>
          <div className="text-[11px] text-slate-500">First Class with Distinction</div>
        </div>

        {/* Earned Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Credits Earned</span>
            <FileCheck2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">118 <span className="text-xs font-normal text-slate-400">/ 160</span></div>
          <div className="text-[11px] text-slate-500">On-Track for Graduation</div>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Assignments</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">2 Due</div>
          <div className="text-[11px] text-purple-600 font-medium">DBMS & Cloud Lab due Fri</div>
        </div>

        {/* Semester Fee */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tuition Fee</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">₹0 Due</div>
          <div className="text-[11px] text-emerald-600 font-medium">Fully Paid (JVD Verified)</div>
        </div>
      </div>

      {/* Main Grid: Today's Classes & Subject Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Classes & Subject Attendance */}
        <div className="lg:col-span-8 space-y-8">
          {/* Today's Classes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Today&rsquo;s Class Schedule</h2>
              <span className="text-xs text-slate-500 font-mono">Room CS-204 &bull; Turing Lab</span>
            </div>

            <div className="space-y-2.5">
              {[
                { time: '09:10 - 10:00 AM', subject: 'Database Management Systems (20A05601T)', faculty: 'Dr. K. Subba Reddy', status: 'COMPLETED' },
                { time: '10:00 - 10:50 AM', subject: 'Operating Systems (20A05602T)', faculty: 'Mr. S. Ramesh', status: 'COMPLETED' },
                { time: '11:10 - 12:00 PM', subject: 'Machine Learning & AI (20A05603T)', faculty: 'Dr. P. Mallikarjuna', status: 'ONGOING' },
                { time: '01:30 - 04:00 PM', subject: 'AI Computing & Neural Net Lab', faculty: 'Lab Faculty Team', status: 'UPCOMING' },
              ].map((cls, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{cls.subject}</div>
                    <div className="text-slate-500">{cls.faculty}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-mono font-semibold text-slate-700">{cls.time}</div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cls.status === 'COMPLETED' ? 'bg-slate-200 text-slate-700' :
                      cls.status === 'ONGOING' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {cls.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Attendance Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Subject-wise Attendance Breakdown</h2>
              <Link href="/student/attendance" className="text-xs font-bold text-blue-700 hover:underline">
                View Full Attendance Report &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {liveSummary.subjects.map((sub, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{sub.subject_name} ({sub.subject_code})</span>
                    <span className={sub.percentage < 75 ? 'text-red-600' : 'text-emerald-700'}>
                      {sub.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sub.percentage < 75 ? 'bg-red-500' : sub.percentage < 85 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): AI Tools & Notifications */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Study Assistant Callout */}
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>AI Exam Preparation</span>
            </div>
            <h3 className="font-black text-lg">AI Study Assistant</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate 5-question MCQ quizzes, receive concept explanations, and summarize syllabus chapters for DBMS, OS, and AI.
            </p>
            <Link
              href="/student/ai-study"
              className="inline-flex items-center justify-center gap-2 w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              <span>Launch Quiz & Concept Tutor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* AI Placement & Mock Interview Callout */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Campus Recruitment</span>
            </div>
            <h3 className="font-bold text-base text-slate-900">AI Placement & Mock Interview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your resume for skill gap extraction and practice real-time technical interview questions for Python, Full-Stack, and AI roles.
            </p>
            <Link
              href="/student/ai-placement"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              <span>Analyze Resume & Start Mock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent Circulars */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Official Circulars</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 divide-y divide-slate-100">
              <div className="pt-1.5">
                <span className="font-bold text-slate-800">Mid-2 Examination Schedule</span>
                <p className="text-[11px] text-slate-500">Timetable published for III B.Tech CSE.</p>
              </div>
              <div className="pt-1.5">
                <span className="font-bold text-slate-800">TCS Campus Drive Registration</span>
                <p className="text-[11px] text-slate-500">Submit resumes before September 25th.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
