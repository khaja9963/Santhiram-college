'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck, AlertTriangle, CheckCircle2,
  TrendingUp, Clock, FileText, ArrowRight, BookOpen, ShieldCheck, XCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getStudentAttendanceSummary } from '@/lib/attendance-store';

export default function StudentAttendancePage() {
  const { user } = useAuth();
  const studentRoll = user?.user_code || '22X51A0501';

  const [summary, setSummary] = useState(() => getStudentAttendanceSummary(studentRoll));

  // Sync when faculty updates attendance
  useEffect(() => {
    const refreshData = () => {
      setSummary(getStudentAttendanceSummary(user?.user_code || '22X51A0501'));
    };

    refreshData();
    window.addEventListener('srec_attendance_updated', refreshData);
    window.addEventListener('storage', refreshData);

    return () => {
      window.removeEventListener('srec_attendance_updated', refreshData);
      window.removeEventListener('storage', refreshData);
    };
  }, [user]);

  const overall = summary.overall_percentage;
  const isLow = overall < 75.0;

  // Safe classes buffer calculation
  // (attended - 0.75 * total) / 0.75
  const bufferClasses = Math.max(
    0,
    Math.floor((summary.total_attended - 0.75 * summary.total_classes) / 0.75)
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          <span>Student Portal</span>
          <span>&bull;</span>
          <span className="font-mono">{summary.roll}</span>
          <span>&bull;</span>
          <span>{summary.section}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Student Attendance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Continuous biometric &amp; period-wise attendance monitored under SREC Autonomous Examination Regulations.
        </p>
      </div>

      {/* Warning or Good Standing Alert Banner */}
      {isLow ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-red-800">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-900">Low Attendance Warning (&lt; 75%)</div>
            <div>
              Your current aggregate attendance is <b>{overall}%</b>, which is below the mandatory 75% examination threshold. Submit condonation applications or medical certificates to the Academic Cell to avoid semester detention.
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-emerald-900">Good Standing (&gt; 75% Requirement Met)</div>
            <div>
              Your aggregate attendance is <b>{overall}%</b>. You are in full compliance with SREC autonomous semester examination guidelines and eligible for regular hall ticket issuance.
            </div>
          </div>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase">Overall Aggregate</div>
          <div className={`text-4xl font-black ${isLow ? 'text-red-600' : 'text-blue-950'}`}>
            {overall}%
          </div>
          <div className="text-xs text-slate-500">Mandatory SREC minimum is 75.0%</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Periods Attended</div>
          <div className="text-4xl font-black text-emerald-600">
            {summary.total_attended}{' '}
            <span className="text-sm font-normal text-slate-400">/ {summary.total_classes}</span>
          </div>
          <div className="text-xs text-slate-500">Across all registered subjects</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase">Classes Can Safely Miss</div>
          <div className="text-4xl font-black text-purple-600">
            {bufferClasses} {bufferClasses === 1 ? 'Period' : 'Periods'}
          </div>
          <div className="text-xs text-slate-500">While remaining safely above the 75.0% threshold</div>
        </div>
      </div>

      {/* Subject-Wise Attendance Detail Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Subject-wise Attendance Distribution</h2>
          <span className="text-xs text-slate-500 font-mono">Real-time Autonomous Biometric Sync</span>
        </div>

        <div className="space-y-4">
          {summary.subjects.map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{s.subject_name}</span>
                  <span className="text-slate-400 font-mono ml-2">({s.subject_code})</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <span className="font-mono">
                    <b>{s.attended_classes}</b> / {s.total_classes} Classes
                  </span>
                  <span className={`font-black text-sm ${s.percentage < 75 ? 'text-red-600' : 'text-emerald-700'}`}>
                    {s.percentage}%
                  </span>
                  {s.percentage < 75 ? (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Shortage
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Eligible
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    s.percentage < 75 ? 'bg-red-500' : s.percentage < 85 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(s.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Faculty Period Attendance Records */}
      {summary.recentRecords.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Period Attendance Entries</h2>
              <p className="text-xs text-slate-500">Live attendance logs submitted by your subject faculty.</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {summary.recentRecords.length} Live Periods
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Period Slot</th>
                  <th className="p-3">Period Timing</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Faculty</th>
                  <th className="p-3 text-right">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {summary.recentRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/70">
                    <td className="p-3 font-mono font-semibold text-slate-900">{r.date}</td>
                    <td className="p-3 font-bold text-blue-900">Period {r.period}</td>
                    <td className="p-3 font-mono text-slate-600">{r.periodTime}</td>
                    <td className="p-3 font-semibold text-slate-800">{r.subject}</td>
                    <td className="p-3 text-slate-600">{r.facultyName}</td>
                    <td className="p-3 text-right">
                      {r.status === 'PRESENT' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Present</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-100 text-red-800 px-2.5 py-1 rounded-lg border border-red-200">
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span>Absent</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
