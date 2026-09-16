'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Users, BookOpen } from 'lucide-react';
import { CollegeAPI } from '@/lib/api';
import { Department } from '@/types';

export default function AdminDepartmentsPage() {
  const [depts, setDepts] = useState<Department[]>([]);

  useEffect(() => {
    CollegeAPI.getDepartments()
      .then((data) => setDepts(data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Departments & Intake Quota</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Autonomous branch configurations, sanctioned seats, and HOD assignments.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Department Name</th>
              <th className="p-4">Head of Department</th>
              <th className="p-4">Sanctioned Intake</th>
              <th className="p-4">Faculty Count</th>
              <th className="p-4 text-right">Labs Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {depts.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/60">
                <td className="p-4 font-mono font-bold text-blue-900">{d.code}</td>
                <td className="p-4 font-bold text-slate-900">{d.name}</td>
                <td className="p-4">{d.hod_name}</td>
                <td className="p-4 font-bold text-slate-900">{d.intake} Seats</td>
                <td className="p-4">{d.total_faculty} Faculty</td>
                <td className="p-4 text-right font-mono font-bold text-emerald-700">{d.labs_count} Labs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
