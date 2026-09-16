'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Award, FileText, CheckCircle2 } from 'lucide-react';
import { StudentAPI } from '@/lib/api';
import { MarksRecord } from '@/types';

export default function StudentMarksPage() {
  const [marks, setMarks] = useState<MarksRecord[]>([]);

  useEffect(() => {
    StudentAPI.getMarks()
      .then((data) => setMarks(data))
      .catch(() => {
        setMarks([
          { subject_code: '20A05601T', subject_name: 'Database Management Systems', exam_type: 'MID-1', scored_marks: 28.0, max_marks: 30.0, grade: 'A+' },
          { subject_code: '20A05602T', subject_name: 'Operating Systems', exam_type: 'MID-1', scored_marks: 26.5, max_marks: 30.0, grade: 'A' },
          { subject_code: '20A05603T', subject_name: 'Machine Learning & AI', exam_type: 'MID-1', scored_marks: 29.0, max_marks: 30.0, grade: 'O' },
          { subject_code: '20A05604T', subject_name: 'Computer Networks', exam_type: 'MID-1', scored_marks: 25.0, max_marks: 30.0, grade: 'B+' },
          { subject_code: '20A05605T', subject_name: 'Cloud Computing Technologies', exam_type: 'MID-1', scored_marks: 27.5, max_marks: 30.0, grade: 'A+' },
        ]);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Internal Marks & Grades</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Continuous Internal Evaluation (CIE) test scores recorded under SREC Autonomous Examination Cell.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4">Examination</th>
              <th className="p-4">Scored Marks</th>
              <th className="p-4">Max Marks</th>
              <th className="p-4 text-right">Grade Point</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {marks.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{m.subject_name}</div>
                  <div className="text-xs font-mono text-slate-400">{m.subject_code}</div>
                </td>
                <td className="p-4 font-semibold text-slate-600">{m.exam_type}</td>
                <td className="p-4 font-bold text-blue-900">{m.scored_marks}</td>
                <td className="p-4 text-slate-500">{m.max_marks}</td>
                <td className="p-4 text-right">
                  <span className="font-mono font-black text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-900">
                    Grade {m.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
