'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  User, Lock, ArrowRight, CheckCircle2,
  Eye, EyeOff, AlertCircle, KeyRound, ShieldCheck,
  GraduationCap, Briefcase
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { assetUrl } from '@/lib/assets';
import RequestAccessModal from '@/components/auth/RequestAccessModal';
import ForceChangePasswordModal from '@/components/auth/ForceChangePasswordModal';
import { UserStore } from '@/lib/user-store';

function StudentFacultyLoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forceChangeData, setForceChangeData] = useState<{
    isOpen: boolean;
    userCode: string;
    userId: string;
    role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  } | null>(null);

  const { login } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const remembered = localStorage.getItem('srec_academic_id');
    if (remembered) {
      setIdentifier(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage('Please enter your Student ID Card No, Faculty Emp ID, or Email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // If an administrator mistakenly tries to log in here, guide them to the separate Admin Login
    const targetUser = UserStore.findUser(cleanId);
    if (targetUser && targetUser.role === 'ADMIN') {
      setErrorMessage('Notice: This is an Administrator account. Please use the separate Admin Login button in the top menu to access the Administrator Portal.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('srec_academic_id', cleanId);
    } else {
      localStorage.removeItem('srec_academic_id');
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
          role: (matched?.role as any) || 'STUDENT',
        });
        return;
      }

      if (!res.success) {
        setErrorMessage(
          res.error || 'Invalid credentials. If you are a new student or faculty, please request your login credentials below.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 bg-white/95 backdrop-blur-md p-7 sm:p-9 rounded-3xl shadow-2xl border border-white/20 relative z-10">
        
        {/* Institutional Branding */}
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 mx-auto flex items-center justify-center p-1.5 bg-white rounded-2xl shadow-md border border-slate-100">
            <img
              src={assetUrl('/images/srec_logo.png')}
              alt="SREC Official Crest"
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
              Nandyal, Andhra Pradesh &bull; Estd. 2007
            </p>
          </div>
        </div>

        {/* Card Header Badge */}
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <span>Student &amp; Faculty Login</span>
          </span>
          <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
            Autonomous Portal
          </span>
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
              <span>Student ID Card No / Faculty Emp ID / Email</span>
              <span className="text-[10px] text-slate-400 font-normal">e.g. 24X51A0501, FAC-0104</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter Student ID Card No or Emp ID"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/70 text-slate-900 text-sm transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Account Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-blue-700 font-semibold hover:text-blue-900 hover:underline"
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
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/70 text-slate-900 text-sm transition-all"
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
                className="rounded border-slate-300 text-blue-800 focus:ring-blue-600 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Remember User ID</span>
            </label>
          </div>

          {/* Submit Button */}
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
                <span>SIGN IN TO SREC PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Access Request Section for New Students & Faculty */}
        <div className="p-4 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 border border-slate-200 rounded-2xl space-y-2.5 shadow-2xs">
          <div className="space-y-1">
            <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-blue-800" />
              <span>New Student or Faculty Member?</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Login accounts are provisioned by <strong>SREC Central Administration</strong>. Submit your Phone number, Email, and College ID Card / Employee ID to receive login credentials via email.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRequestModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-900 font-bold py-2.5 px-4 rounded-xl border border-blue-200 shadow-2xs hover:border-blue-300 transition-all text-xs cursor-pointer active:scale-98"
          >
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Request SREC Portal Login Credentials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Help footer */}
        <div className="text-center text-[11px] text-slate-400 pt-1">
          Need assistance? Contact{' '}
          <a href="mailto:ict@srecnandyal.edu.in" className="text-blue-700 font-semibold hover:underline">
            Campus ICT Center
          </a>{' '}
          or Administrative Office.
        </div>

      </div>

      {/* Modal: Request SREC Portal Access */}
      <RequestAccessModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
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
          <div className="text-xs font-semibold text-slate-300 animate-pulse">Loading SREC Portal...</div>
        </div>
      }
    >
      <StudentFacultyLoginForm />
    </Suspense>
  );
}
