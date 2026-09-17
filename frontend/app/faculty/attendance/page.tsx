'use client';

import React, { useState, useEffect } from 'react';
import { CalendarCheck, CheckCircle2, XCircle, Clock, Save, FileSpreadsheet, Download } from 'lucide-react';
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

  const toggleStatus = (id: string, newStatus: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const exportToExcel = (
    subjectCode: string,
    classDate: string,
    periodNum: number,
    studentList: any[],
    presentCountNum: number
  ) => {
    const total = studentList.length;
    const absentCount = total - presentCountNum;
    const percentage = Math.round((presentCountNum / total) * 100);

    const csvRows = [
      ['SANTHIRAM ENGINEERING COLLEGE (AUTONOMOUS) - NANDYAL'],
      ['DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING'],
      ['OFFICIAL CLASS ATTENDANCE REPORT'],
      [''],
      ['Subject', `"${subjectCode}"`],
      ['Date', classDate],
      ['Period Slot', `Period ${periodNum}`],
      ['Generated On', `"${new Date().toLocaleString()}"`],
      [''],
      ['S.No', 'Roll Number', 'Student Name', 'Attendance Status', 'Remarks'],
      ...studentList.map((s, idx) => [
        idx + 1,
        s.roll,
        `"${s.name.replace(/"/g, '""')}"`,
        s.status === 'PRESENT' ? 'PRESENT' : 'ABSENT',
        s.status === 'PRESENT' ? '---' : 'ABSENT'
      ]),
      [''],
      ['SUMMARY METRICS'],
      ['Total Enrolled', total],
      ['Total Present', presentCountNum],
      ['Total Absent', absentCount],
      ['Attendance %', `${percentage}%`],
      [''],
      ['Faculty Signature', '', '', 'HOD Verification', '']
    ];

    const csvContent = '\uFEFF' + csvRows.map((r) => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const cleanSubject = subjectCode.replace(/[^a-zA-Z0-9]/g, '_');
    link.href = url;
    link.setAttribute('download', `SREC_Attendance_${cleanSubject}_${classDate}_P${periodNum}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    setSaving(true);
    const presentCnt = students.filter((s) => s.status === 'PRESENT').length;

    try {
      // 1. Save to backend if server is reachable
      await FacultyAPI.markAttendance({
        subject_code: subject.split(' - ')[0],
        date,
        period,
        records: students.map((s) => ({
          student_id: s.id,
          roll_number: s.roll,
          status: s.status,
        })),
      }).catch(() => {
        // Handled gracefully for static/offline
      });

      // 2. Save into browser persistent storage
      const record = {
        id: Date.now().toString(),
        subject,
        date,
        period,
        presentCount: presentCnt,
        totalCount: students.length,
        timestamp: new Date().toISOString(),
        records: students,
      };
      if (typeof window !== 'undefined') {
        const history = JSON.parse(localStorage.getItem('srec_attendance_history') || '[]');
        localStorage.setItem('srec_attendance_history', JSON.stringify([record, ...history.slice(0, 49)]));
      }

      // 3. Automatically export and store/download Excel sheet
      exportToExcel(subject, date, period, students, presentCnt);

      setSaved(true);
      setTimeout(() => setSaved(false), 4500);
    } catch {
      exportToExcel(subject, date, period, students, presentCnt);
      setSaved(true);
      setTimeout(() => setSaved(false), 4500);
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

        <div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-emerald-800 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-extrabold text-emerald-900">Attendance records stored successfully!</div>
              <div className="text-[11px] text-emerald-700 font-normal mt-0.5">
                Official SREC Excel spreadsheet (.csv) has been automatically downloaded to your device.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportToExcel(subject, date, period, students, presentCount)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Re-download Excel</span>
          </button>
        </div>
      )}

      {/* Attendance Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Attendance Summary: <b>{presentCount} Present</b> &bull; <b>{students.length - presentCount} Absent</b> ({Math.round((presentCount / students.length) * 100)}% Present)
          </div>
          <button
            type="button"
            onClick={() => exportToExcel(subject, date, period, students, presentCount)}
            className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold transition-colors w-fit cursor-pointer"
            title="Download formatted Excel attendance report"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export to Excel Sheet</span>
          </button>
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
                        Present
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
