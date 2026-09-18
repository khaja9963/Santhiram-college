'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  User, Lock, ArrowRight, AlertCircle, Eye, EyeOff,
  GraduationCap, Briefcase, KeyRound, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { assetUrl } from '@/lib/assets';
import RequestAccessModal from '@/components/auth/RequestAccessModal';
import ForceChangePasswordModal from '@/components/auth/ForceChangePasswordModal';
import { UserStore } from '@/lib/user-store';

function UnifiedAcademicLoginForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'faculty' ? 'FACULTY' : 'STUDENT';
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'FACULTY'>(initialRole);

  // Student Form State
  const [studentId, setStudentId] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentShowPass, setStudentShowPass] = useState(false);
  const [studentRemember, setStudentRemember] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);

  // Faculty Form State
  const [facultyId, setFacultyId] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [facultyShowPass, setFacultyShowPass] = useState(false);
  const [facultyRemember, setFacultyRemember] = useState(false);
  const [facultyError, setFacultyError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [forceChangeData, setForceChangeData] = useState<{
    isOpen: boolean;
    userCode: string;
    userId: string;
    role: 'STUDENT' | 'FACULTY';
  } | null>(null);

  const { login } = useAuth();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'faculty') setActiveTab('FACULTY');
    if (roleParam === 'student') setActiveTab('STUDENT');

    const remStudent = localStorage.getItem('srec_student_id');
    if (remStudent) {
      setStudentId(remStudent);
      setStudentRemember(true);
    }
    const remFaculty = localStorage.getItem('srec_faculty_id');
    if (remFaculty) {
      setFacultyId(remFaculty);
      setFacultyRemember(true);
    }
  }, [searchParams]);

  // Handle Student Login Submit
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);

    const clean = studentId.trim();
    if (!clean) {
      setStudentError('Please enter your Student ID Card No / Roll No.');
      return;
    }
    if (!studentPassword) {
      setStudentError('Please enter your student password.');
      return;
    }

    const target = UserStore.findUser(clean);
    if (target && target.role === 'FACULTY') {
      setStudentError('Notice: This is a Faculty account. Please switch to the Faculty Login tab.');
      return;
    }
    if (target && target.role === 'ADMIN') {
      setStudentError('Notice: This is an Administrator account. Please use the Admin Login button in the top menu.');
      return;
    }

    if (studentRemember) {
      localStorage.setItem('srec_student_id', clean);
    } else {
      localStorage.removeItem('srec_student_id');
    }

    setIsLoading(true);
    try {
      const res = await login(clean, studentPassword);
      if (res.first_login) {
        const matched = UserStore.findUser(clean);
        setForceChangeData({
          isOpen: true,
          userCode: matched?.user_code || clean,
          userId: matched?.id || clean,
          role: 'STUDENT',
        });
        return;
      }
      if (!res.success) {
        setStudentError(res.error || 'Invalid student credentials. Please request your credentials below if you are a new student.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Faculty Login Submit
  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFacultyError(null);

    const clean = facultyId.trim();
    if (!clean) {
      setFacultyError('Please enter your Faculty Employee ID (Emp ID).');
      return;
    }
    if (!facultyPassword) {
      setFacultyError('Please enter your faculty password.');
      return;
    }

    const target = UserStore.findUser(clean);
    if (target && target.role === 'STUDENT') {
      setFacultyError('Notice: This is a Student account. Please switch to the Student Login tab.');
      return;
    }
    if (target && target.role === 'ADMIN') {
      setFacultyError('Notice: This is an Administrator account. Please use the Admin Login button in the top menu.');
      return;
    }

    if (facultyRemember) {
      localStorage.setItem('srec_faculty_id', clean);
    } else {
      localStorage.removeItem('srec_faculty_id');
    }

    setIsLoading(true);
    try {
      const res = await login(clean, facultyPassword);
      if (res.first_login) {
        const matched = UserStore.findUser(clean);
        setForceChangeData({
          isOpen: true,
          userCode: matched?.user_code || clean,
          userId: matched?.id || clean,
          role: 'FACULTY',
        });
        return;
      }
      if (!res.success) {
        setFacultyError(res.error || 'Invalid faculty credentials. Please request your credentials below if you are a new faculty member.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      
      {/* Background glow accents */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 bg-white/95 backdrop-blur-md p-7 sm:p-9 rounded-3xl shadow-2xl border border-white/20 relative z-10">
        
        {/* Institutional Header */}
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 mx-auto flex items-center justify-center p-1.5 bg-white rounded-2xl shadow-md border border-slate-100">
            <img
              src={assetUrl('/images/srec_logo.png')}
              alt="SREC Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              SREC Smart Campus
            </h2>
            <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mt-0.5">
              Santhiram Engineering College (Autonomous)
            </p>
            <p className="text-[10px] text-slate-500">
              Autonomous Academic &amp; Examination Portals
            </p>
          </div>
        </div>

        {/* Dedicated Separate Portal Switcher Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('STUDENT')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'STUDENT'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FACULTY')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'FACULTY'
                ? 'bg-indigo-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Faculty Portal</span>
          </button>
        </div>

        {/* ================= TAB 1: STUDENT LOGIN ================= */}
        {activeTab === 'STUDENT' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>Student Sign In</span>
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                B.Tech / MBA
              </span>
            </div>

            {studentError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-semibold">{studentError}</div>
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Student ID Card No / Roll No</span>
                  <span className="text-[10px] text-slate-400 font-normal">e.g. 24X51A0501</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Student ID Card / Roll No"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/70 text-slate-900 text-sm font-medium uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Student Password</label>
                  <Link href="/forgot-password" className="text-xs text-blue-700 font-semibold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type={studentShowPass ? 'text' : 'password'}
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/70 text-slate-900 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setStudentShowPass(!studentShowPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    {studentShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={studentRemember}
                    onChange={(e) => setStudentRemember(e.target.checked)}
                    className="rounded border-slate-300 text-blue-800 focus:ring-blue-600 w-3.5 h-3.5"
                  />
                  <span>Remember Student ID</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-xs sm:text-sm"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </span>
                ) : (
                  <>
                    <span>SIGN IN AS STUDENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Request Credentials Box for Students */}
            <div className="p-4 bg-gradient-to-br from-blue-50/80 via-cyan-50/40 to-slate-50 border border-blue-200 rounded-2xl space-y-2 shadow-2xs mt-4">
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-800" />
                <span>New Student Without Login ID?</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Submit your <strong>Phone Number, Email ID, and College ID Card Number</strong> to receive your login credentials from Admin.
              </p>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-900 font-bold py-2 px-4 rounded-xl border border-blue-200 shadow-2xs transition-all text-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Request Student Login Credentials</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: FACULTY LOGIN ================= */}
        {activeTab === 'FACULTY' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-700" />
                <span>Faculty Sign In</span>
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
                Teaching Staff
              </span>
            </div>

            {facultyError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-semibold">{facultyError}</div>
              </div>
            )}

            <form onSubmit={handleFacultySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Faculty Employee ID (Emp ID)</span>
                  <span className="text-[10px] text-slate-400 font-normal">e.g. FAC-0104</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value)}
                    placeholder="Enter Faculty Employee ID"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-slate-50/70 text-slate-900 text-sm font-medium uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Faculty Password</label>
                  <Link href="/forgot-password" className="text-xs text-indigo-700 font-semibold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type={facultyShowPass ? 'text' : 'password'}
                    required
                    value={facultyPassword}
                    onChange={(e) => setFacultyPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-slate-50/70 text-slate-900 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setFacultyShowPass(!facultyShowPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    {facultyShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={facultyRemember}
                    onChange={(e) => setFacultyRemember(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-800 focus:ring-indigo-600 w-3.5 h-3.5"
                  />
                  <span>Remember Faculty ID</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-xs sm:text-sm"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </span>
                ) : (
                  <>
                    <span>SIGN IN AS FACULTY</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Request Credentials Box for Faculty */}
            <div className="p-4 bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-slate-50 border border-indigo-200 rounded-2xl space-y-2 shadow-2xs mt-4">
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-indigo-800" />
                <span>New Faculty Member Without Login ID?</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Submit your <strong>Employee ID, Official Email, Phone Number, and Designation</strong> to receive your login credentials from Admin.
              </p>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 text-indigo-900 font-bold py-2 px-4 rounded-xl border border-indigo-200 shadow-2xs transition-all text-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                <span>Request Faculty Login Credentials</span>
              </button>
            </div>
          </div>
        )}

        {/* Institutional Helpdesk Footer */}
        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          Direct Links:{' '}
          <Link href="/student/login" className="text-blue-700 font-bold hover:underline">
            Student Portal
          </Link>
          {' '}&bull;{' '}
          <Link href="/faculty/login" className="text-indigo-700 font-bold hover:underline">
            Faculty Portal
          </Link>
        </div>

      </div>

      {/* Modal: Request SREC Portal Access */}
      <RequestAccessModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        defaultType={activeTab}
      />

      {/* Modal: Force Password Change on First Login */}
      {forceChangeData && (
        <ForceChangePasswordModal
          isOpen={forceChangeData.isOpen}
          userCode={forceChangeData.userCode}
          userId={forceChangeData.userId}
          role={forceChangeData.role}
          onSuccess={() => setForceChangeData(null)}
        />
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-900 text-white">
          <div className="text-xs font-semibold text-slate-300 animate-pulse">Loading Academic Portals...</div>
        </div>
      }
    >
      <UnifiedAcademicLoginForm />
    </Suspense>
  );
}
