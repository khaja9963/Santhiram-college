'use client';

import React from 'react';
import { Clock, Calendar } from 'lucide-react';

export default function StudentTimetablePage() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = ['09:10 - 10:00', '10:00 - 10:50', '11:10 - 12:00', '12:00 - 12:50', '01:30 - 02:20', '02:20 - 04:00'];

  const schedule: Record<string, string[]> = {
    Monday: ['DBMS', 'Operating Systems', 'Machine Learning', 'Computer Networks', 'Cloud Tech', 'AI Lab (Batch A)'],
    Tuesday: ['Machine Learning', 'DBMS', 'Computer Networks', 'Operating Systems', 'Professional Ethics', 'Cloud Computing Lab'],
    Wednesday: ['Operating Systems', 'Machine Learning', 'DBMS', 'Computer Networks', 'Cloud Tech', 'Sports & Library Hour'],
    Thursday: ['Computer Networks', 'DBMS', 'Operating Systems', 'Machine Learning', 'Quantitative Aptitude', 'Coding Practice'],
    Friday: ['Cloud Tech', 'Machine Learning', 'DBMS', 'Professional Ethics', 'Operating Systems', 'Project Mentoring'],
    Saturday: ['Technical Seminar', 'Industrial Case Studies', 'Mock Placement Test', 'Alumni Guest Lecture', 'Remedial Class', 'Activity Hour'],
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Weekly Academic Timetable</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Semester VI &bull; Class Section CS-A &bull; Room CS-204 &bull; Turing Computing Center
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="p-3.5">Day</th>
                {periods.map((p, i) => (
                  <th key={i} className="p-3.5 font-mono text-[11px] text-slate-600">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {days.map((day) => (
                <tr key={day} className="hover:bg-slate-50/60">
                  <td className="p-3.5 font-bold text-slate-900 bg-slate-50/40">{day}</td>
                  {schedule[day].map((sub, idx) => (
                    <td key={idx} className="p-3.5">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-semibold ${
                        sub.includes('Lab') ? 'bg-purple-100 text-purple-900' :
                        sub.includes('Machine') ? 'bg-blue-100 text-blue-900' :
                        sub.includes('DBMS') ? 'bg-amber-100 text-amber-900' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {sub}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
