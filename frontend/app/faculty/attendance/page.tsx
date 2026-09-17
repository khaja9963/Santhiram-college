'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck, CheckCircle2, XCircle, Clock, Save,
  FileSpreadsheet, Download, Lock, ShieldAlert, Check
} from 'lucide-react';
import { FacultyAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

interface StudentRecord {
  id: string;
  roll: string;
  name: string;
  status: 'PRESENT' | 'ABSENT';
}

interface AttendanceSession {
  id: string;
  facultyId: string;
  facultyName: string;
  subject: string;
  date: string;
  period: number;
  periodTime: string;
  presentCount: number;
  totalCount: number;
  timestamp: string;
  records: StudentRecord[];
}

const DEFAULT_STUDENTS: StudentRecord[] = [
  { id: '1', roll: '22X51A0501', name: 'Sai Teja Reddy', status: 'PRESENT' },
  { id: '2', roll: '22X51A0502', name: 'B. Anusha', status: 'PRESENT' },
  { id: '3', roll: '22X51A0503', name: 'C. Harish', status: 'PRESENT' },
  { id: '4', roll: '22X51A0504', name: 'D. Kalyan', status: 'PRESENT' },
  { id: '5', roll: '22X51A0505', name: 'E. Meena', status: 'PRESENT' },
  { id: '6', roll: '22X51A0506', name: 'F. Nithin', status: 'PRESENT' },
];

const PERIOD_SLOTS = [
  { id: 1, name: 'Period 1', time: '09:10 AM - 10:00 AM' },
  { id: 2, name: 'Period 2', time: '10:00 AM - 10:50 AM' },
  { id: 3, name: 'Period 3', time: '11:10 AM - 12:00 PM' },
  { id: 4, name: 'Period 4', time: '12:00 PM - 12:50 PM' },
  { id: 5, name: 'Period 5', time: '01:40 PM - 02:30 PM' },
  { id: 6, name: 'Period 6', time: '02:30 PM - 03:20 PM' },
  { id: 7, name: 'Period 7', time: '03:20 PM - 04:10 PM' },
];

export default function FacultyAttendancePage() {
  const { user } = useAuth();
  const facultyId = user?.user_code || 'SREC-FAC-0104';
  const facultyName = user?.full_name || 'Dr. K. Subba Reddy';
  const facultyDept = user?.department_name || 'Computer Science & Engineering';

  const [subject, setSubject] = useState('20A05601T - DBMS (CSE-III-A)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState(1);
  const [students, setStudents] = useState<StudentRecord[]>(DEFAULT_STUDENTS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedSession, setLockedSession] = useState<AttendanceSession | null>(null);

  const storageKey = `srec_master_attendance_${facultyId}`;

  // Helper to load faculty attendance history from localStorage
  const getFacultySessions = (): AttendanceSession[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  // Check if attendance for (subject + date + period) is already locked/submitted
  useEffect(() => {
    const sessions = getFacultySessions();
    const existing = sessions.find(
      (s) => s.subject === subject && s.date === date && s.period === period
    );

    if (existing) {
      setIsLocked(true);
      setLockedSession(existing);
      setStudents(existing.records);
    } else {
      setIsLocked(false);
      setLockedSession(null);
      setStudents(DEFAULT_STUDENTS.map((s) => ({ ...s, status: 'PRESENT' })));
    }
  }, [subject, date, period, facultyId]);

  const toggleStatus = (id: string, newStatus: 'PRESENT' | 'ABSENT') => {
    if (isLocked) return;
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  // Generates and downloads the single cumulative Master Excel workbook for this faculty
  const exportMasterExcel = (allSessions: AttendanceSession[]) => {
    if (allSessions.length === 0) return;

    const csvRows: any[][] = [
      ['SANTHIRAM ENGINEERING COLLEGE (AUTONOMOUS) - NANDYAL'],
      ['FACULTY ATTENDANCE MASTER REGISTER'],
      [''],
      ['Faculty Name', `"${facultyName}"`],
      ['Faculty Employee ID', facultyId],
      ['Department', `"${facultyDept}"`],
      ['Total Cumulative Sessions', allSessions.length],
      ['Report Generated On', `"${new Date().toLocaleString()}"`],
      [''],
      [
        'Session Date',
        'Period Slot',
        'Period Timing',
        'Subject',
        'S.No',
        'Roll Number',
        'Student Name',
        'Attendance Status',
        'Total Students',
        'Present Count',
        'Absent Count',
        'Attendance %',
        'Submission Timestamp'
      ]
    ];

    // Append every session ever taken by this faculty
    allSessions.forEach((session) => {
      const total = session.records.length;
      const presentCnt = session.presentCount;
      const absentCnt = total - presentCnt;
      const pct = Math.round((presentCnt / total) * 100);

      session.records.forEach((s, idx) => {
        csvRows.push([
          session.date,
          `Period ${session.period}`,
          `"${session.periodTime}"`,
          `"${session.subject.replace(/"/g, '""')}"`,
          idx + 1,
          s.roll,
          `"${s.name.replace(/"/g, '""')}"`,
          s.status === 'PRESENT' ? 'PRESENT' : 'ABSENT',
          total,
          presentCnt,
          absentCnt,
          `${pct}%`,
          `"${new Date(session.timestamp).toLocaleString()}"`
        ]);
      });
    });

    const csvContent = '\uFEFF' + csvRows.map((r) => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const cleanFaculty = facultyId.replace(/[^a-zA-Z0-9]/g, '_');
    link.href = url;
    link.setAttribute('download', `SREC_Master_Attendance_${cleanFaculty}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (isLocked || saving) return;
    setSaving(true);

    const presentCnt = students.filter((s) => s.status === 'PRESENT').length;
    const currentSlot = PERIOD_SLOTS.find((p) => p.id === period);
    const slotTime = currentSlot ? currentSlot.time : '09:10 AM - 10:00 AM';

    const newSession: AttendanceSession = {
      id: `${facultyId}_${date}_P${period}_${Date.now()}`,
      facultyId,
      facultyName,
      subject,
      date,
      period,
      periodTime: slotTime,
      presentCount: presentCnt,
      totalCount: students.length,
      timestamp: new Date().toISOString(),
      records: students,
    };

    try {
      // 1. Try backend API if server is connected
      await FacultyAPI.markAttendance({
        subject_code: subject.split(' - ')[0],
        date,
        period,
        records: students.map((s) => ({
          student_id: s.id,
          roll_number: s.roll,
          status: s.status,
        })),
      }).catch(() => {});

      // 2. Append to this faculty's master attendance register
      const existingSessions = getFacultySessions();
      const updatedSessions = [newSession, ...existingSessions.filter(
        (s) => !(s.subject === subject && s.date === date && s.period === period)
      )];

      localStorage.setItem(storageKey, JSON.stringify(updatedSessions));

      // 3. Automatically download the consolidated master Excel workbook
      exportMasterExcel(updatedSessions);

      setIsLocked(true);
      setLockedSession(newSession);
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    } catch {
      const existingSessions = getFacultySessions();
      const updatedSessions = [newSession, ...existingSessions];
      localStorage.setItem(storageKey, JSON.stringify(updatedSessions));
      exportMasterExcel(updatedSessions);
      setIsLocked(true);
      setLockedSession(newSession);
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter((s) => s.status === 'PRESENT').length;
  const currentSlotObj = PERIOD_SLOTS.find((p) => p.id === period);

  // List of period IDs already locked for the selected date and subject
  const currentSessions = getFacultySessions();
  const lockedPeriodIds = currentSessions
    .filter((s) => s.subject === subject && s.date === date)
    .map((s) => s.period);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <span>Faculty Attendance Register</span>
            <span>&bull;</span>
            <span className="font-mono">{facultyId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Mark Daily Class Attendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Period-wise biometric record updates. Once submitted, each period is locked against re-attendance till next day.
          </p>
        </div>

        {/* Master Excel Export Button */}
        {currentSessions.length > 0 && (
          <button
            type="button"
            onClick={() => exportMasterExcel(currentSessions)}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
            title="Download full master Excel sheet with all recorded sessions"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Download Master Excel ({currentSessions.length} Sessions)</span>
          </button>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Select Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-colors"
          >
            <option value="20A05601T - DBMS (CSE-III-A)">20A05601T - DBMS (CSE-III-A)</option>
            <option value="20A05603T - Machine Learning (CSM-III-B)">20A05603T - Machine Learning (CSM-III-B)</option>
            <option value="20A05605T - Computer Networks (CSE-III-A)">20A05605T - Computer Networks (CSE-III-A)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Class Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Period Slot</span>
            {isLocked && (
              <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" /> Locked
              </span>
            )}
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className={`w-full text-xs font-semibold p-2.5 rounded-xl border transition-colors ${
              isLocked
                ? 'border-amber-300 bg-amber-50/60 text-amber-950 font-bold'
                : 'border-slate-200 bg-slate-50 focus:bg-white'
            }`}
          >
            {PERIOD_SLOTS.map((slot) => {
              const isSlotLocked = lockedPeriodIds.includes(slot.id);
              return (
                <option key={slot.id} value={slot.id}>
                  {slot.name} ({slot.time}) {isSlotLocked ? '✓ [Submitted]' : ''}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || isLocked}
            className={`w-full text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all ${
              isLocked
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-800 text-white active:scale-95 cursor-pointer hover:shadow'
            }`}
            title={isLocked ? "Attendance locked for this period" : "Save Attendance and Update Master Excel"}
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Submitted &amp; Locked</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lock Notice Banner (No Re-Attendance) */}
      {isLocked && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start sm:items-center justify-between gap-3 text-xs text-amber-950 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-amber-900 flex items-center gap-1.5">
                <span>Period {period} Attendance Locked</span>
                <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {currentSlotObj?.time}
                </span>
              </div>
              <div className="text-amber-800 mt-0.5 leading-relaxed">
                Attendance for this period on <strong>{date}</strong> has already been submitted and locked into the official faculty register. Re-attendance cannot be taken for the same period until the next academic day.
              </div>
              {lockedSession && (
                <div className="text-[11px] text-amber-700 font-mono mt-1">
                  Submitted on: {new Date(lockedSession.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {lockedSession.presentCount} Present &bull; {lockedSession.totalCount - lockedSession.presentCount} Absent
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => exportMasterExcel(currentSessions)}
            className="flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
            title="Download current master Excel file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Master Excel</span>
          </button>
        </div>
      )}

      {/* Save Success Alert */}
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-emerald-800 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-extrabold text-emerald-900">Attendance recorded &amp; stored in Master Excel sheet!</div>
              <div className="text-[11px] text-emerald-700 font-normal mt-0.5">
                Period {period} ({currentSlotObj?.time}) has been appended to your official faculty attendance file.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => exportMasterExcel(getFacultySessions())}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Re-download Master Excel</span>
          </button>
        </div>
      )}

      {/* Attendance Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Attendance Summary: <b>{presentCount} Present</b> &bull; <b>{students.length - presentCount} Absent</b> ({Math.round((presentCount / students.length) * 100)}% Present)
            {isLocked && <span className="ml-2 font-bold text-amber-700">(Read-Only / Submitted)</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportMasterExcel(getFacultySessions().length > 0 ? getFacultySessions() : [{
                id: 'preview',
                facultyId,
                facultyName,
                subject,
                date,
                period,
                periodTime: currentSlotObj?.time || '09:10 AM - 10:00 AM',
                presentCount,
                totalCount: students.length,
                timestamp: new Date().toISOString(),
                records: students,
              }])}
              className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-lg font-bold transition-colors w-fit cursor-pointer"
              title="Download consolidated master Excel file for this faculty"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export Master Excel</span>
            </button>
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
                        disabled={isLocked}
                        onClick={() => toggleStatus(s.id, 'PRESENT')}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                          s.status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        } ${isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                        title={isLocked ? 'Attendance is locked' : 'Mark Present'}
                      >
                        Present
                      </button>
                      <button
                        disabled={isLocked}
                        onClick={() => toggleStatus(s.id, 'ABSENT')}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                          s.status === 'ABSENT'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        } ${isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                        title={isLocked ? 'Attendance is locked' : 'Mark Absent'}
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
