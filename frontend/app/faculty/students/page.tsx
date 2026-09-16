'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Award } from 'lucide-react';
import { FacultyAPI } from '@/lib/api';

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    FacultyAPI.getStudents()
      .then((data) => setStudents(data))
      .catch(() => {
        setStudents([
          { id: '1', roll_number: '22X51A0501', full_name: 'Sai Teja Reddy', department: 'CSE', year: 3, semester: 6, section: 'A', cgpa: 8.64 },
          { id: '2', roll_number: '22X51A0502', full_name: 'B. Anusha', department: 'CSE', year: 3, semester: 6, section: 'A', cgpa: 8.52 },
          { id: '3', roll_number: '22X51A0503', full_name: 'C. Harish', department: 'CSE', year: 3, semester: 6, section: 'A', cgpa: 8.10 },
          { id: '4', roll_number: '22X51A0504', full_name: 'D. Kalyan', department: 'CSE', year: 3, semester: 6, section: 'A', cgpa: 7.85 },
          { id: '5', roll_number: '22X51A0505', full_name: 'E. Meena', department: 'CSE', year: 3, semester: 6, section: 'A', cgpa: 8.92 },
        ]);
      });
  }, []);

  const filtered = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(query.toLowerCase()) ||
      s.roll_number.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Department Student Roster</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Enrolled student profiles across III B.Tech Computer Science & Engineering.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name or roll..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-blue-600 outline-hidden bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th className="p-4">Roll Number</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Branch & Section</th>
              <th className="p-4">Cumulative CGPA</th>
              <th className="p-4 text-right">Academic Standing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60">
                <td className="p-4 font-mono font-bold text-blue-900">{s.roll_number}</td>
                <td className="p-4 font-bold text-slate-900">{s.full_name}</td>
                <td className="p-4">{s.department} &bull; Year {s.year} (Sec {s.section})</td>
                <td className="p-4 font-black text-emerald-700">{s.cgpa}</td>
                <td className="p-4 text-right">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    s.cgpa >= 8.5 ? 'bg-emerald-100 text-emerald-800' :
                    s.cgpa >= 8.0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {s.cgpa >= 8.5 ? 'Distinction' : 'First Class'}
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
