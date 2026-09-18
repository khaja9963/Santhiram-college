'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
  User, Lock, ArrowRight, AlertCircle, Eye, EyeOff,
  Briefcase, KeyRound, ShieldCheck, GraduationCap, Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { assetUrl } from '@/lib/assets';
import RequestAccessModal from '@/components/auth/RequestAccessModal';
import ForceChangePasswordModal from '@/components/auth/ForceChangePasswordModal';
import { UserStore } from '@/lib/user-store';

function FacultyLoginForm() {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [forceChangeData, setForceChangeData] = useState<{
    isOpen: boolean;
    userCode: string;
    userId: string;
    role: 'FACULTY';
  } | null>(null);

  const { login, demoLogin } = useAuth();

  useEffect(() => {
    const remembered = localStorage.getItem('srec_faculty_id');
    if (remembered) {
      setEmpId(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = empId.trim();
    if (!cleanId) {
      setErrorMessage('Please enter your Faculty Employee ID (Emp ID).');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Role validation
    const targetUser = UserStore.findUser(cleanId);
    if (targetUser && targetUser.role === 'STUDENT') {
      setErrorMessage('Notice: This is a Student account. Please use the separate Student Login portal.');
      return;
    }
    if (targetUser && targetUser.role === 'ADMIN') {
      setErrorMessage('Notice: This is an Administrator account. Please use the separate Admin Login portal.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('srec_faculty_id', cleanId);
    } else {
      localStorage.removeItem('srec_faculty_id');
    }

    setIsLoading(true);
    try {
      const res = await login(cleanId, password);

      if (res.first_login) {
        const matched = UserStore.findUser(cleanId);
        setForceChangeData({
          isOpen: true,
          userCode: matched?.user_code || cleanId,
          userId: matched?.id || cleanId,
          role: 'FACULTY',
        });
        return;
      }

      if (!res.success) {
        setErrorMessage(
          res.error || 'Invalid faculty credentials. If you are a new faculty member, please request your login credentials below.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      
      {/* Background glow accents */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

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
              SREC Faculty Portal
            </h2>
            <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mt-0.5">
              Santhiram Engineering College (Autonomous)
            </p>
            <p className="text-[10px] text-slate-500">
              Academic Instruction, Attendance &amp; Marks Evaluation Gateway
            </p>
          </div>
        </div>

        {/* Card Header Badge */}
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-700" />
            <span>Faculty Sign In</span>
          </span>
          <span className="text-[10px] bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
            Teaching Staff
          </span>
        </div>

        {/* Instant 1-Click Demo Login for Testing */}
        <div className="p-3.5 bg-gradient-to-r from-indigo-50 to-purple-50/50 border border-indigo-200 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              <span>Instant 1-Click Faculty Demo Login</span>
            </span>
            <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
              Testing Mode
            </span>
          </div>
          <button
            type="button"
            onClick={() => demoLogin('FACULTY')}
            className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>LAUNCH FACULTY DASHBOARD (1-CLICK)</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
          <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <span>Or autofill:</span>
            <button
              type="button"
              onClick={() => {
                setEmpId('FAC-0104');
                setPassword('Faculty@Srec2026');
              }}
              className="text-indigo-700 underline font-mono font-bold hover:text-indigo-900"
            >
              FAC-0104 / Faculty@Srec2026
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-semibold">
              {errorMessage}
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
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
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="Enter your Faculty Emp ID"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-slate-50/70 text-slate-900 text-sm transition-all font-medium uppercase"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Faculty Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-indigo-700 font-semibold hover:text-indigo-900 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-slate-50/70 text-slate-900 text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-indigo-800 focus:ring-indigo-600 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Remember Faculty ID</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-xs sm:text-sm"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Faculty Access...</span>
              </span>
            ) : (
              <>
                <span>SIGN IN TO FACULTY PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* New Faculty Access Request Box */}
        <div className="p-4 bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-slate-50 border border-indigo-200 rounded-2xl space-y-2.5 shadow-2xs">
          <div className="space-y-1">
            <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-indigo-800" />
              <span>New Faculty Member Without Login ID?</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Submit your <strong>Employee ID, Official Email, Phone Number, and Designation</strong>. SREC Central Administration will issue your portal credentials via email.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRequestModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 text-indigo-900 font-bold py-2.5 px-4 rounded-xl border border-indigo-200 shadow-2xs hover:border-indigo-300 transition-all text-xs cursor-pointer active:scale-98"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-700" />
            <span>Request Faculty Login Credentials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer switch */}
        <div className="text-center pt-1 border-t border-slate-100">
          <Link
            href="/student/login"
            className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Enrolled Student? Switch to Student Login Portal</span>
          </Link>
        </div>

      </div>

      {/* Modal: Request SREC Portal Access (pre-selected to FACULTY) */}
      <RequestAccessModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        defaultType="FACULTY"
      />

      {/* Modal: Force Password Change on First Login */}
      {forceChangeData && (
        <ForceChangePasswordModal
          isOpen={forceChangeData.isOpen}
          userCode={forceChangeData.userCode}
          userId={forceChangeData.userId}
          role="FACULTY"
          onSuccess={() => setForceChangeData(null)}
        />
      )}
    </div>
  );
}

export default function FacultyLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-900 text-white">
          <div className="text-xs font-semibold text-slate-300 animate-pulse">Loading Faculty Portal...</div>
        </div>
      }
    >
      <FacultyLoginForm />
    </Suspense>
  );
}
