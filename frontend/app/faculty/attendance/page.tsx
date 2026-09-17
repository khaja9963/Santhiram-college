'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck, CheckCircle2, XCircle, Clock, Save,
  FileSpreadsheet, Download, Lock, ShieldAlert, Users, Search,
  Filter, AlertTriangle, ChevronRight, BookOpen, Layers
} from 'lucide-react';
import { FacultyAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  AVAILABLE_SUBJECTS,
  PERIOD_SLOTS,
  StudentRecord,
  AttendanceSession,
  recordAttendanceSession,
  getAllRecordedSessions,
  getStudentsForSection,
  getCandidateSubjectStats,
  getAllCandidatesAttendance,
  CandidateAttendanceItem,
} from '@/lib/attendance-store';

export default function FacultyAttendancePage() {
  const { user } = useAuth();
  const facultyId = user?.user_code || 'SREC-FAC-0104';
  const facultyName = user?.full_name || 'Dr. K. Subba Reddy';
  const facultyDept = user?.department_name || 'Computer Science & Engineering';

  // Active view: 'MARK' (Take attendance) or 'ALL_CANDIDATES' (View all candidates & percentages)
  const [activeTab, setActiveTab] = useState<'MARK' | 'ALL_CANDIDATES'>('MARK');

  // Mark Attendance state
  const [subject, setSubject] = useState(AVAILABLE_SUBJECTS[0].fullName);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState(1);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedSession, setLockedSession] = useState<AttendanceSession | null>(null);

  // All Candidates filter state
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('ALL');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Helper to load faculty attendance history
  const getFacultySessions = (): AttendanceSession[] => {
    return getAllRecordedSessions().filter((s) => s.facultyId === facultyId);
  };

  // Load students and check lock state when subject, date, or period changes
  useEffect(() => {
    const sessions = getAllRecordedSessions();
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
      const sectionStudents = getStudentsForSection(subject);
      setStudents(sectionStudents);
    }
  }, [subject, date, period, refreshTrigger]);

  // Listen to storage events to keep live calculations updated
  useEffect(() => {
    const handleUpdate = () => setRefreshTrigger((prev) => prev + 1);
    window.addEventListener('srec_attendance_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('srec_attendance_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

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

  // Export full candidates attendance percentage report
  const exportCandidatesReport = (items: CandidateAttendanceItem[]) => {
    if (items.length === 0) return;

    const csvRows: any[][] = [
      ['SANTHIRAM ENGINEERING COLLEGE (AUTONOMOUS) - NANDYAL'],
      ['ALL CANDIDATES ATTENDANCE ANALYTICS REPORT'],
      [''],
      ['Generated By Faculty', `"${facultyName}" (${facultyId})`],
      ['Department', `"${facultyDept}"`],
      ['Total Records', items.length],
      ['Generated On', `"${new Date().toLocaleString()}"`],
      [''],
      [
        'Roll Number',
        'Student Name',
        'Class Section',
        'Department',
        'Subject Code',
        'Subject Name',
        'Total Classes',
        'Attended Classes',
        'Absent Classes',
        'Attendance %',
        'Exam Eligibility Standing'
      ]
    ];

    items.forEach((item) => {
      csvRows.push([
        item.roll,
        `"${item.name.replace(/"/g, '""')}"`,
        item.section,
        `"${item.department}"`,
        item.subjectCode,
        `"${item.subjectName.replace(/"/g, '""')}"`,
        item.totalClasses,
        item.attendedClasses,
        item.absentClasses,
        `${item.percentage}%`,
        item.standing
      ]);
    });

    const csvContent = '\uFEFF' + csvRows.map((r) => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `SREC_All_Candidates_Attendance_${new Date().toISOString().split('T')[0]}.csv`);
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

    const subMatch = subject.match(/\(([^)]+)\)/);
    const sectionName = subMatch ? subMatch[1] : 'CSE-III-A';
    const subCode = subject.split(' - ')[0].trim();

    const newSession: AttendanceSession = {
      id: `${facultyId}_${date}_P${period}_${Date.now()}`,
      facultyId,
      facultyName,
      subject,
      subjectCode: subCode,
      section: sectionName,
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
        subject_code: subCode,
        date,
        period,
        records: students.map((s) => ({
          student_id: s.id,
          roll_number: s.roll,
          status: s.status,
        })),
      }).catch(() => {});

      // 2. Append to unified store & faculty's master attendance register
      recordAttendanceSession(newSession);

      // 3. Mark state as saved & locked without triggering an automatic file download
      setIsLocked(true);
      setLockedSession(newSession);
      setSaved(true);
      setRefreshTrigger((prev) => prev + 1);
      setTimeout(() => setSaved(false), 5000);
    } catch {
      recordAttendanceSession(newSession);
      setIsLocked(true);
      setLockedSession(newSession);
      setSaved(true);
      setRefreshTrigger((prev) => prev + 1);
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

  // All Candidates Data & Filtering
  const allCandidatesData = getAllCandidatesAttendance(
    selectedSubjectFilter === 'ALL' ? undefined : selectedSubjectFilter,
    selectedSectionFilter === 'ALL' ? undefined : selectedSectionFilter
  );

  const filteredCandidates = allCandidatesData.filter((c) => {
    const q = candidateSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.roll.toLowerCase().includes(q);
  });

  const totalCandidatesCount = filteredCandidates.length;
  const avgAttendance =
    totalCandidatesCount > 0
      ? Math.round(
          (filteredCandidates.reduce((acc, c) => acc + c.percentage, 0) / totalCandidatesCount) * 10
        ) / 10
      : 0;
  const shortageCandidates = filteredCandidates.filter((c) => c.percentage < 75);
  const goodStandingCandidates = filteredCandidates.filter((c) => c.percentage >= 75);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <span>Faculty Attendance &amp; Analytics</span>
            <span>&bull;</span>
            <span className="font-mono">{facultyId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Attendance Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track real-time biometric attendance, candidate percentages, and examination eligibility.
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

      {/* Navigation Tabs: Mark Attendance vs All Candidates */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('MARK')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'MARK'
              ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-700/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Mark Attendance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ALL_CANDIDATES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ALL_CANDIDATES'
              ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-700/20'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Candidates</span>
          <span
            className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'ALL_CANDIDATES'
                ? 'bg-white/20 text-white'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {allCandidatesData.length} Records
          </span>
        </button>
      </div>

      {/* VIEW 1: MARK ATTENDANCE */}
      {activeTab === 'MARK' && (
        <div className="space-y-6">
          {/* Control Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Select Subject &amp; Section</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-colors"
              >
                {AVAILABLE_SUBJECTS.map((s) => (
                  <option key={s.code} value={s.fullName}>
                    {s.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Class Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-colors"
              >
              </input>
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
                    Period {period} ({currentSlotObj?.time}) has been added to your single faculty master record. You can proceed with other periods without downloading, or download the full sheet anytime.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => exportMasterExcel(getFacultySessions())}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Master Excel</span>
              </button>
            </div>
          )}

          {/* Attendance Sheet */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                Attendance Summary: <b>{presentCount} Present</b> &bull; <b>{students.length - presentCount} Absent</b> ({students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}% Present)
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
                    subjectCode: subject.split(' - ')[0],
                    section: subject.match(/\(([^)]+)\)/)?.[1] || 'CSE-III-A',
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
                    <th className="p-3">Current Attendance %</th>
                    <th className="p-3 text-right">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {students.map((s) => {
                    const stats = getCandidateSubjectStats(s.roll, subject);
                    const isLow = stats.percentage < 75;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-blue-900">{s.roll}</td>
                        <td className="p-3 font-bold text-slate-900">{s.name}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden shrink-0">
                              <div
                                className={`h-full rounded-full ${
                                  stats.percentage >= 85
                                    ? 'bg-emerald-500'
                                    : stats.percentage >= 75
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                              />
                            </div>
                            <span
                              className={`font-mono font-bold text-xs ${
                                stats.percentage >= 85
                                  ? 'text-emerald-700'
                                  : stats.percentage >= 75
                                  ? 'text-amber-700'
                                  : 'text-red-600 font-black'
                              }`}
                            >
                              {stats.percentage}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({stats.attended}/{stats.total})
                            </span>
                            {isLow && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full border border-red-200">
                                <AlertTriangle className="w-2.5 h-2.5 text-red-600" />
                                Shortage
                              </span>
                            )}
                          </div>
                        </td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ALL CANDIDATES & ATTENDANCE PERCENTAGE */}
      {activeTab === 'ALL_CANDIDATES' && (
        <div className="space-y-6">
          {/* KPI Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                <span>Total Candidates</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalCandidatesCount}</div>
              <div className="text-[11px] text-slate-500">Enrolled in selected subjects</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                <span>Average Attendance</span>
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700">{avgAttendance}%</div>
              <div className="text-[11px] text-slate-500">Autonomous minimum threshold: 75%</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                <span>Good Standing (&ge;75%)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">{goodStandingCandidates.length}</div>
              <div className="text-[11px] text-emerald-700 font-medium">Eligible for Semester Exams</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                <span>Shortage Risk (&lt;75%)</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-red-600">{shortageCandidates.length}</div>
              <div className="text-[11px] text-red-700 font-medium">Condonation / Detention Notice</div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Subject Filter */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filter Subject</span>
                </label>
                <select
                  value={selectedSubjectFilter}
                  onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                  className="text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                >
                  <option value="ALL">All Subjects</option>
                  {AVAILABLE_SUBJECTS.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Section Filter */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filter Section</span>
                </label>
                <select
                  value={selectedSectionFilter}
                  onChange={(e) => setSelectedSectionFilter(e.target.value)}
                  className="text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                >
                  <option value="ALL">All Class Sections</option>
                  <option value="CSE-III-A">CSE-III-A (Section A)</option>
                  <option value="CSE-III-B">CSE-III-B (Section B)</option>
                  <option value="CSM-III-B">CSM-III-B (AI &amp; ML)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Candidate Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search candidate name or roll..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-blue-600 outline-hidden bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Export Candidates Report */}
              <button
                type="button"
                onClick={() => exportCandidatesReport(filteredCandidates)}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                title="Export all candidates attendance percentages to Excel"
              >
                <Download className="w-3.5 h-3.5 text-emerald-200" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Candidates Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-3.5">Roll Number</th>
                    <th className="p-3.5">Candidate Name</th>
                    <th className="p-3.5">Class Section</th>
                    <th className="p-3.5">Subject</th>
                    <th className="p-3.5">Attended / Total</th>
                    <th className="p-3.5">Attendance Percentage</th>
                    <th className="p-3.5 text-right">Autonomous Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                        No candidates match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70">
                        <td className="p-3.5 font-mono font-bold text-blue-900">{c.roll}</td>
                        <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                        <td className="p-3.5">
                          <span className="bg-slate-100 text-slate-700 font-mono text-[11px] px-2 py-0.5 rounded-md font-semibold border border-slate-200">
                            {c.section}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800">{c.subjectName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{c.subjectCode}</div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-700">
                          <span className="font-bold text-slate-900">{c.attendedClasses}</span> / {c.totalClasses} classes
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  c.percentage >= 85
                                    ? 'bg-emerald-500'
                                    : c.percentage >= 75
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(c.percentage, 100)}%` }}
                              />
                            </div>
                            <span
                              className={`font-mono font-black text-xs ${
                                c.percentage >= 85
                                  ? 'text-emerald-700'
                                  : c.percentage >= 75
                                  ? 'text-amber-700'
                                  : 'text-red-600'
                              }`}
                            >
                              {c.percentage}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          {c.standing === 'ELIGIBLE' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Eligible</span>
                            </span>
                          )}
                          {c.standing === 'CONDONATION' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-300">
                              <AlertTriangle className="w-3 h-3 text-amber-700" />
                              <span>Condonation Required</span>
                            </span>
                          )}
                          {c.standing === 'DETAINED' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-100 text-red-900 px-2.5 py-1 rounded-lg border border-red-300">
                              <XCircle className="w-3 h-3 text-red-600" />
                              <span>Detention Risk</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
