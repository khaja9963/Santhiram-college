'use client';

import React from 'react';
import { FileCheck2, Clock, CheckCircle2, UploadCloud } from 'lucide-react';

export default function StudentAssignmentsPage() {
  const assignments = [
    {
      title: 'Database Normalization & BCNF Decomposition Problem Set',
      subject: 'Database Management Systems (20A05601T)',
      due: 'Friday, 11:59 PM',
      status: 'PENDING',
      marks: '10 Marks',
    },
    {
      title: 'Operating Systems CPU Scheduling & Banker’s Algorithm Simulation',
      subject: 'Operating Systems (20A05602T)',
      due: 'Next Monday, 05:00 PM',
      status: 'PENDING',
      marks: '10 Marks',
    },
    {
      title: 'Supervised Learning Regression & Classification Pipeline',
      subject: 'Machine Learning & AI (20A05603T)',
      due: 'Submitted on 12 Sep',
      status: 'GRADED',
      marks: '9.5 / 10',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Continuous Assessment & Assignments</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Faculty assignment submissions, due dates, and graded evaluation scores.
        </p>
      </div>

      <div className="space-y-4">
        {assignments.map((a, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {a.subject}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  a.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {a.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{a.title}</h3>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Due: {a.due} &bull; Weightage: {a.marks}</span>
              </div>
            </div>

            <div>
              {a.status === 'PENDING' ? (
                <button className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Submit Assignment</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Scored: {a.marks}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
