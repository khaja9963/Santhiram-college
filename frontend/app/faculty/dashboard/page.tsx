'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, CalendarCheck, BarChart3, FileCheck2,
  CheckCircle2, Clock, ArrowRight, BookOpen, AlertCircle
} from 'lucide-react';
import { FacultyAPI } from '@/lib/api';

export default function FacultyDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    FacultyAPI.getSummary()
      .then((data) => setSummary(data))
      .catch(() => {});
    FacultyAPI.getStudents()
      .then((data) => setStudents(data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] to-blue-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs px-3 py-1 rounded-full font-semibold">
            Faculty Portal &bull; Department of Computer Science & Engineering
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Dr. K. Subba Reddy
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Emp ID: <span className="font-mono text-amber-300 font-bold">SREC-FAC-0104</span> &bull; Professor & Head of Department &bull; Room CS-204
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/faculty/attendance"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mark Attendance</span>
          </Link>
          <Link
            href="/faculty/marks"
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-white/20 flex items-center gap-1.5 backdrop-blur-xs transition-transform hover:scale-105"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Upload Marks</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Assigned Subjects</span>
            <BookOpen className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">2 Courses</div>
          <div className="text-[11px] text-slate-500">DBMS & Machine Learning</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Students</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">124 Students</div>
          <div className="text-[11px] text-slate-500">III Year Sections A & B</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending Grading</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">18 Submissions</div>
          <div className="text-[11px] text-slate-500">DBMS Normalization Problem Set</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Average Attendance</span>
            <CalendarCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">87.2%</div>
          <div className="text-[11px] text-emerald-600 font-medium">Cohort in good standing</div>
        </div>
      </div>

      {/* Assigned Classes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Active Teaching Subjects & Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                20A05601T
              </span>
              <span className="text-xs font-bold text-slate-600">64 Enrolled</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">Database Management Systems</div>
            <div className="text-xs text-slate-500">Branch: CSE &bull; III B.Tech Section A &bull; Turing Lab 1</div>
            <div className="pt-2 flex gap-2">
              <Link
                href="/faculty/attendance"
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                Mark Attendance &rarr;
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                20A05603T
              </span>
              <span className="text-xs font-bold text-slate-600">60 Enrolled</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">Machine Learning & Artificial Intelligence</div>
            <div className="text-xs text-slate-500">Branch: CSM &bull; III B.Tech Section B &bull; GPU Lab</div>
            <div className="pt-2 flex gap-2">
              <Link
                href="/faculty/attendance"
                className="text-xs font-bold text-purple-700 hover:underline"
              >
                Mark Attendance &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Students Quick Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Student Roll Roster Preview</h2>
          <span className="text-xs text-slate-500">Autonomous Batch 2022-26</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="p-3">Roll Number</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Year / Sem</th>
                <th className="p-3">CGPA</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {students.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="p-3 font-mono font-bold text-blue-900">{s.roll_number}</td>
                  <td className="p-3 font-bold text-slate-900">{s.full_name}</td>
                  <td className="p-3">{s.department}</td>
                  <td className="p-3">{s.year} Year / Sem {s.semester} (Sec {s.section})</td>
                  <td className="p-3 font-black text-emerald-700">{s.cgpa}</td>
                  <td className="p-3 text-right">
                    <button className="text-xs text-blue-700 font-bold hover:underline">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
