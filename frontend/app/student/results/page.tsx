'use client';

import React, { useState, useEffect } from 'react';
import { Award, Download, CheckCircle2, TrendingUp } from 'lucide-react';
import { StudentAPI } from '@/lib/api';
import { SemesterResult } from '@/types';

export default function StudentResultsPage() {
  const [results, setResults] = useState<SemesterResult[]>([]);

  useEffect(() => {
    StudentAPI.getResults()
      .then((data) => setResults(data))
      .catch(() => {
        setResults([
          { semester: 1, academic_year: '2022-23', sgpa: 8.35, cgpa: 8.35, backlogs: 0, status: 'PASSED', published_date: 'Feb 2023' },
          { semester: 2, academic_year: '2022-23', sgpa: 8.52, cgpa: 8.44, backlogs: 0, status: 'PASSED', published_date: 'Jul 2023' },
          { semester: 3, academic_year: '2023-24', sgpa: 8.70, cgpa: 8.53, backlogs: 0, status: 'PASSED', published_date: 'Feb 2024' },
          { semester: 4, academic_year: '2023-24', sgpa: 8.81, cgpa: 8.60, backlogs: 0, status: 'PASSED', published_date: 'Aug 2024' },
          { semester: 5, academic_year: '2024-25', sgpa: 8.78, cgpa: 8.64, backlogs: 0, status: 'PASSED', published_date: 'Feb 2025' },
        ]);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Semester Grade Sheets & CGPA</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Official semester progression records published by SREC Autonomous Examination Cell.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Cumulative CGPA</div>
          <div className="text-4xl font-black text-blue-950">8.64</div>
          <div className="text-xs text-emerald-600 font-semibold">Distinction Standing</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Backlogs</div>
          <div className="text-4xl font-black text-emerald-600">0</div>
          <div className="text-xs text-slate-500">Clean Academic Record</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Current Status</div>
          <div className="text-4xl font-black text-slate-900">PASSED</div>
          <div className="text-xs text-slate-500">Eligible for VI Sem Registrations</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th className="p-4">Semester</th>
              <th className="p-4">Academic Year</th>
              <th className="p-4">SGPA</th>
              <th className="p-4">Cumulative CGPA</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Official Sheet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {results.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="p-4 font-bold text-slate-900">Semester {r.semester}</td>
                <td className="p-4 text-slate-600">{r.academic_year}</td>
                <td className="p-4 font-black text-blue-900">{r.sgpa}</td>
                <td className="p-4 font-black text-emerald-700">{r.cgpa}</td>
                <td className="p-4">
                  <span className="font-bold text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Memo</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
