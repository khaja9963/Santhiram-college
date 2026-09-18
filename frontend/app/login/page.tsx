'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  User, Lock, Mail, ArrowRight, CheckCircle2,
  Eye, EyeOff, AlertCircle, KeyRound, ShieldCheck,
  GraduationCap, Briefcase, Shield, ShieldAlert, Check
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { assetUrl } from '@/lib/assets';
import RequestAccessModal from '@/components/auth/RequestAccessModal';
import ForceChangePasswordModal from '@/components/auth/ForceChangePasswordModal';
import { UserStore } from '@/lib/user-store';

function LoginForm() {
  // Active mobile view tab (on small screens: 'academic' | 'admin', on lg screens both are shown side-by-side)
  const [mobileTab, setMobileTab] = useState<'academic' | 'admin'>('academic');

  // Student & Faculty Login States
  const [academicId, setAcademicId] = useState('');
  const [academicPassword, setAcademicPassword] = useState('');
  const [academicShowPass, setAcademicShowPass] = useState(false);
  const [academicRemember, setAcademicRemember] = useState(false);
  const [academicError, setAcademicError] = useState<string | null>(null);
  const [academicLoading, setAcademicLoading] = useState(false);

  // Administrator Login States
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminShowPass, setAdminShowPass] = useState(false);
  const [adminRemember, setAdminRemember] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [forceChangeData, setForceChangeData] = useState<{
    isOpen: boolean;
    userCode: string;
    userId: string;
    role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  } | null>(null);

  const { login } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check remembered identifiers
    const rememberedAcademic = localStorage.getItem('srec_academic_id');
    if (rememberedAcademic) {
      setAcademicId(rememberedAcademic);
      setAcademicRemember(true);
    }

    const rememberedAdmin = localStorage.getItem('srec_admin_id');
    if (rememberedAdmin) {
      setAdminId(rememberedAdmin);
      setAdminRemember(true);
    }
  }, []);

  // Handle Student / Faculty Sign In
  const handleAcademicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAcademicError(null);

    const cleanId = academicId.trim();
    if (!cleanId) {
      setAcademicError('Please enter your Student ID Card No, Faculty Emp ID, or Email.');
      return;
    }
    if (!academicPassword) {
      setAcademicError('Please enter your password.');
      return;
    }

    // Strict separation check: prevent admin from accidentally logging in through student form
    const targetUser = UserStore.findUser(cleanId);
    if (targetUser && targetUser.role === 'ADMIN') {
      setAcademicError('Notice: This is an Administrator account. Please use the Administrator Portal beside this form to sign in.');
      return;
    }

    if (academicRemember) {
      localStorage.setItem('srec_academic_id', cleanId);
    } else {
      localStorage.removeItem('srec_academic_id');
    }

    setAcademicLoading(true);
    try {
      const res = await login(cleanId, academicPassword);

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
        setAcademicError(
          res.error || 'Invalid credentials. If you are a new student or faculty, please request your login details below.'
        );
      }
    } finally {
      setAcademicLoading(false);
    }
  };

  // Handle Administrator Sign In
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    const cleanId = adminId.trim();
    if (!cleanId) {
      setAdminError('Please enter your Administrator Authority ID or official email.');
      return;
    }
    if (!adminPassword) {
      setAdminError('Please enter your administrator passkey / password.');
      return;
    }

    // Strict separation check: prevent student/faculty from signing in through admin portal
    const targetUser = UserStore.findUser(cleanId);
    if (targetUser && (targetUser.role === 'STUDENT' || targetUser.role === 'FACULTY')) {
      setAdminError(`Notice: Account "${cleanId}" is registered as ${targetUser.role}. Please sign in using the Student/Faculty Portal beside this card.`);
      return;
    }

    if (adminRemember) {
      localStorage.setItem('srec_admin_id', cleanId);
    } else {
      localStorage.removeItem('srec_admin_id');
    }

    setAdminLoading(true);
    try {
      const res = await login(cleanId, adminPassword);

      if (res.first_login) {
        const matched = UserStore.findUser(cleanId);
        setForceChangeData({
          isOpen: true,
          userCode: matched?.user_code || cleanId,
          userId: matched?.id || cleanId,
          role: 'ADMIN',
        });
        return;
      }

      if (!res.success) {
        setAdminError(res.error || 'Administrator verification failed. Please check your credentials.');
      }
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-[#0B1E38] to-slate-950 relative overflow-hidden">
      
      {/* Decorative background glow accents */}
      <div className="absolute top-10 left-10 w-[32rem] h-[32rem] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl w-full space-y-6 relative z-10">
        
        {/* Unified Institutional Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/15 shadow-md">
            <div className="w-10 h-10 flex items-center justify-center p-1 bg-white rounded-xl shadow-xs">
              <img
                src={assetUrl('/images/srec_logo.png')}
                alt="SREC Crest"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
                SANTHIRAM ENGINEERING COLLEGE
              </h1>
              <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                Autonomous Institution &bull; Estd. 2007 &bull; Nandyal
              </p>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            SREC Smart Campus & Institutional Access Gateways
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Separate, dedicated authentication gates for Academic Members (Students & Faculty) and Institutional Administrators.
          </p>
        </div>

        {/* Mobile View Toggle (Shown only on small screens < lg) */}
        <div className="lg:hidden flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setMobileTab('academic')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'academic'
                ? 'bg-blue-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student & Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('admin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'admin'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Administrator</span>
          </button>
        </div>

        {/* Side-by-Side Login Cards (beside each other on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* ================= CARD 1: STUDENT & FACULTY LOGIN ================= */}
          <div
            className={`bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-100/40 flex flex-col justify-between transition-all ${
              mobileTab === 'admin' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="space-y-5">
              
              {/* Card Header */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                    <span>Student & Faculty Portal</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Academic Access
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Student / Faculty Sign In
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    For B.Tech / MBA students and teaching faculty with admin-issued credentials.
                  </p>
                </div>
              </div>

              {/* Academic Error Alert */}
              {academicError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed font-semibold">{academicError}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAcademicSubmit} className="space-y-4">
                
                {/* Identifier */}
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
                      value={academicId}
                      onChange={(e) => setAcademicId(e.target.value)}
                      placeholder="Enter Student ID Card No or Emp ID"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/70 text-slate-900 text-xs sm:text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
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
                      type={academicShowPass ? 'text' : 'password'}
                      required
                      value={academicPassword}
                      onChange={(e) => setAcademicPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/70 text-slate-900 text-xs sm:text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setAcademicShowPass(!academicShowPass)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                      title={academicShowPass ? 'Hide password' : 'Show password'}
                    >
                      {academicShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={academicRemember}
                      onChange={(e) => setAcademicRemember(e.target.checked)}
                      className="rounded border-slate-300 text-blue-800 focus:ring-blue-600 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Remember Student / Faculty ID</span>
                  </label>
                </div>

                {/* Submit Academic Login */}
                <button
                  type="submit"
                  disabled={academicLoading}
                  className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-xs sm:text-sm"
                >
                  {academicLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Academic Access...</span>
                    </span>
                  ) : (
                    <>
                      <span>SIGN IN AS STUDENT / FACULTY</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Request Access Box for New Students/Faculty */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="p-4 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 rounded-2xl space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">New Student or Faculty Member?</h4>
                    <p className="text-[10px] text-slate-500">Need your login details from Admin?</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Submit your <strong>Phone Number, Email ID, and College ID Card / Employee ID</strong>. SREC Administration will review, assign your Login ID, and dispatch credentials to your email.
                </p>
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-900 font-bold py-2 px-3 rounded-xl border border-blue-200 shadow-2xs hover:border-blue-300 transition-all text-xs cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>Request SREC Portal Login Credentials</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* ================= CARD 2: SEPARATE ADMINISTRATOR LOGIN (BESIDE IT) ================= */}
          <div
            className={`bg-slate-900/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/60 flex flex-col justify-between transition-all relative overflow-hidden ${
              mobileTab === 'academic' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Subtle administrative security badge in background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-5 relative z-10">
              
              {/* Card Header */}
              <div className="space-y-2 pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Restricted Authority Portal</span>
                  </span>
                  <span className="text-[10px] text-amber-500/80 font-mono font-bold tracking-wider">
                    ZONE 1 &bull; RBAC
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>Administrator Sign In</span>
                    <Shield className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Strictly for Principal, Registrar, Deans, and Central ICT Administration.
                  </p>
                </div>
              </div>

              {/* Admin Error Alert */}
              {adminError && (
                <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed font-semibold">{adminError}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                
                {/* Admin Identifier */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>Administrator User ID / Official Email</span>
                    <span className="text-[10px] text-slate-400 font-normal">e.g. ADM-001 or admin@srecnandyal.edu.in</span>
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      placeholder="Enter Admin ID (e.g. ADM-001)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-slate-800/80 text-white text-xs sm:text-sm font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Admin Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      Master Security Passkey / Password
                    </label>
                    <span className="text-[10px] text-amber-400/80 font-mono">
                      TLS Encrypted
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type={adminShowPass ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-slate-800/80 text-white text-xs sm:text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowPass(!adminShowPass)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
                      title={adminShowPass ? 'Hide password' : 'Show password'}
                    >
                      {adminShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Admin ID */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={adminRemember}
                      onChange={(e) => setAdminRemember(e.target.checked)}
                      className="rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Remember Administrator ID</span>
                  </label>
                </div>

                {/* Submit Admin Login */}
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-xs sm:text-sm"
                >
                  {adminLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating Authority Credentials...</span>
                    </span>
                  ) : (
                    <>
                      <span>AUTHENTICATE AS ADMINISTRATOR</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Admin Security Compliance Notice */}
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
              <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Institutional IT Governance & Audit Notice</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Administrator sessions grant privileged access to student/faculty record approval, fee audits, and role assignment. Unauthorized attempts are automatically quarantined and logged to the central institutional audit registry.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Direct Admin Link: <strong className="text-slate-400">/admin/dashboard</strong></span>
                <Link href="/admin/audit-logs" className="text-amber-400 hover:underline">
                  View Audit Logs
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Global Institutional Helpdesk Footer */}
        <div className="text-center text-xs text-slate-400 pt-2">
          Santhiram Engineering College (Autonomous) Smart Campus Portal &bull; Central ICT Helpdesk:{' '}
          <a href="mailto:ict@srecnandyal.edu.in" className="text-blue-400 hover:underline font-semibold">
            ict@srecnandyal.edu.in
          </a>
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
          <div className="text-xs font-semibold text-slate-300 animate-pulse">Loading SREC Portals...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
