'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Plus } from 'lucide-react';
import { FacultyAPI } from '@/lib/api';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    FacultyAPI.getStudents()
      .then((data) => setStudents(data))
      .catch(() => {});
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Student Information System</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Enrolled student records across all autonomous undergraduate and postgraduate branches.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student roll or name..."
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
              <th className="p-4">Full Name</th>
              <th className="p-4">Department</th>
              <th className="p-4">Academic Year</th>
              <th className="p-4">Cumulative CGPA</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60">
                <td className="p-4 font-mono font-bold text-blue-900">{s.roll_number}</td>
                <td className="p-4 font-bold text-slate-900">{s.full_name}</td>
                <td className="p-4">{s.department}</td>
                <td className="p-4">{s.year} Year (Sem {s.semester})</td>
                <td className="p-4 font-black text-emerald-700">{s.cgpa}</td>
                <td className="p-4 text-right">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    ACTIVE
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
