'use client';

import React from 'react';
import { Briefcase, Search, Plus } from 'lucide-react';

export default function AdminFacultyPage() {
  const facultyList = [
    { empId: 'SREC-FAC-0104', name: 'Dr. K. Subba Reddy', dept: 'CSE', designation: 'Professor & HOD', qual: 'Ph.D.', exp: '16 Years' },
    { empId: 'SREC-FAC-0105', name: 'Dr. P. Mallikarjuna', dept: 'CSM', designation: 'Professor & HOD', qual: 'Ph.D.', exp: '15 Years' },
    { empId: 'SREC-FAC-0106', name: 'Dr. G. Ramesh', dept: 'ECE', designation: 'Professor & HOD', qual: 'Ph.D.', exp: '18 Years' },
    { empId: 'SREC-FAC-0107', name: 'Dr. M. Suresh', dept: 'EEE', designation: 'Professor & HOD', qual: 'Ph.D.', exp: '14 Years' },
    { empId: 'SREC-FAC-0108', name: 'Dr. S. K. Basha', dept: 'MBA', designation: 'Professor & HOD', qual: 'Ph.D.', exp: '13 Years' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Faculty Mentors & Leadership</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Teaching faculty rosters and department chair designations across SREC.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th className="p-4">Employee ID</th>
              <th className="p-4">Faculty Name</th>
              <th className="p-4">Department</th>
              <th className="p-4">Designation</th>
              <th className="p-4">Qualification</th>
              <th className="p-4 text-right">Experience</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {facultyList.map((f, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="p-4 font-mono font-bold text-blue-900">{f.empId}</td>
                <td className="p-4 font-bold text-slate-900">{f.name}</td>
                <td className="p-4 font-bold text-purple-700">{f.dept}</td>
                <td className="p-4">{f.designation}</td>
                <td className="p-4">{f.qual}</td>
                <td className="p-4 text-right font-black text-slate-900">{f.exp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
