'use client';

import React, { useState, useEffect } from 'react';
import { CalendarCheck, CheckCircle2, XCircle, Clock, Save } from 'lucide-react';
import { FacultyAPI } from '@/lib/api';

export default function FacultyAttendancePage() {
  const [subject, setSubject] = useState('20A05601T - DBMS');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState(1);
  const [students, setStudents] = useState<any[]>([
    { id: '1', roll: '22X51A0501', name: 'Sai Teja Reddy', status: 'PRESENT' },
    { id: '2', roll: '22X51A0502', name: 'B. Anusha', status: 'PRESENT' },
    { id: '3', roll: '22X51A0503', name: 'C. Harish', status: 'PRESENT' },
    { id: '4', roll: '22X51A0504', name: 'D. Kalyan', status: 'PRESENT' },
    { id: '5', roll: '22X51A0505', name: 'E. Meena', status: 'PRESENT' },
    { id: '6', roll: '22X51A0506', name: 'F. Nithin', status: 'PRESENT' },
  ]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const hasAbsent = students.some((s) => s.status === 'ABSENT');

  const toggleStatus = (id: string, newStatus: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'PRESENT' })));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await FacultyAPI.markAttendance({
        subject_code: subject.split(' - ')[0],
        date,
        period,
        records: students.map((s) => ({
          student_id: s.id,
          roll_number: s.roll,
          status: s.status,
        })),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter((s) => s.status === 'PRESENT').length;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Mark Daily Class Attendance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Period-wise biometric record updates directly integrated with SREC Student Portals.
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Select Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option>20A05601T - DBMS (CSE-III-A)</option>
            <option>20A05603T - Machine Learning (CSM-III-B)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Class Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Period Slot</label>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option value={1}>Period 1 (09:10 - 10:00 AM)</option>
            <option value={2}>Period 2 (10:00 - 10:50 AM)</option>
            <option value={3}>Period 3 (11:10 - 12:00 PM)</option>
            <option value={4}>Period 4 (12:00 - 12:50 PM)</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={markAllPresent}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-colors"
            title={hasAbsent ? "Click to set all students to Present" : "All students marked Present"}
          >
            {hasAbsent ? '---' : 'All Present'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Attendance records updated successfully!</span>
        </div>
      )}

      {/* Attendance Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div>
            Attendance Summary: <b>{presentCount} Present</b> &bull; <b>{students.length - presentCount} Absent</b> ({Math.round((presentCount / students.length) * 100)}% Present)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="p-3">Roll Number</th>
                <th className="p-3">Student Name</th>
                <th className="p-3 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-mono font-bold text-blue-900">{s.roll}</td>
                  <td className="p-3 font-bold text-slate-900">{s.name}</td>
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => toggleStatus(s.id, 'PRESENT')}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                          s.status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Mark Present"
                      >
                        {hasAbsent ? '---' : 'Present'}
                      </button>
                      <button
                        onClick={() => toggleStatus(s.id, 'ABSENT')}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                          s.status === 'ABSENT'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Mark Absent"
                      >
                        Absent
                      </button>
                    </div>
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
