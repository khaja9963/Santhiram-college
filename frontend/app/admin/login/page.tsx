'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
  Shield, Lock, ArrowRight, AlertCircle,
  Eye, EyeOff, ShieldAlert, ShieldCheck, KeyRound, GraduationCap
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { assetUrl } from '@/lib/assets';
import ForceChangePasswordModal from '@/components/auth/ForceChangePasswordModal';
import { UserStore } from '@/lib/user-store';

function AdminLoginForm() {
  const [adminId, setAdminId] = useState('ADM-001');
  const [adminPassword, setAdminPassword] = useState('Admin@Srec2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forceChangeData, setForceChangeData] = useState<{
    isOpen: boolean;
    userCode: string;
    userId: string;
    role: 'ADMIN';
  } | null>(null);

  const { login } = useAuth();

  useEffect(() => {
    const remembered = localStorage.getItem('srec_admin_id');
    if (remembered) {
      setAdminId(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = adminId.trim();
    if (!cleanId) {
      setErrorMessage('Please enter your Administrator User ID or official email.');
      return;
    }

    if (!adminPassword) {
      setErrorMessage('Please enter your administrator passkey / password.');
      return;
    }

    // Strict validation: if student or faculty tries to sign in here, guide them to /login
    const targetUser = UserStore.findUser(cleanId);
    if (targetUser && (targetUser.role === 'STUDENT' || targetUser.role === 'FACULTY')) {
      setErrorMessage(`Notice: Account "${cleanId}" is registered as ${targetUser.role}. Please use the Student / Faculty Login button.`);
      return;
    }

    if (rememberMe) {
      localStorage.setItem('srec_admin_id', cleanId);
    } else {
      localStorage.removeItem('srec_admin_id');
    }

    setIsLoading(true);
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
        setErrorMessage(res.error || 'Administrator authentication failed. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-[#0B1E38] to-slate-950 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-10 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 bg-slate-900/95 backdrop-blur-md p-7 sm:p-9 rounded-3xl shadow-2xl border border-slate-700/60 relative z-10 text-white">
        
        {/* Institutional Authority Branding */}
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 mx-auto flex items-center justify-center p-1.5 bg-white rounded-2xl shadow-md border border-slate-800">
            <img
              src={assetUrl('/images/srec_logo.png')}
              alt="SREC Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <span>SREC Administrator Portal</span>
              <Shield className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-[11px] font-bold text-amber-300 uppercase tracking-widest mt-0.5">
              Autonomous Institution &bull; Central IT Administration
            </p>
            <p className="text-[10px] text-slate-400">
              Restricted to Principal, Registrar, Deans, and Examination Authorities.
            </p>
          </div>
        </div>

        {/* Restricted Zone Badge */}
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Restricted Authority Zone</span>
          </span>
          <span className="text-[10px] text-amber-500/80 font-mono font-bold tracking-wider">
            RBAC LEVEL 1
          </span>
        </div>


        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-semibold">
              {errorMessage}
            </div>
          </div>
        )}

        {/* Administrator Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
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
                placeholder="Enter Administrator ID (e.g. ADM-001)"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-slate-800/80 text-white text-sm font-medium transition-all"
              />
            </div>
          </div>

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
                type={showPassword ? 'text' : 'password'}
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-hidden bg-slate-800/80 text-white text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Remember Administrator ID</span>
            </label>
          </div>

          {/* Authenticate Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-xs sm:text-sm"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Authority Credentials...</span>
              </span>
            ) : (
              <>
                <span>AUTHENTICATE AS ADMINISTRATOR</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Audit Notice */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional IT Governance &amp; Audit Notice</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Administrative sessions grant privileged access to student and faculty credential issuance, attendance governance, and system configurations. All sign-in attempts are cryptographically timestamped and audited.
            </p>
          </div>

          <div className="text-center pt-1">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student or Faculty Member? Go to Student/Faculty Portal</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Force Change Password Modal if required */}
      {forceChangeData && (
        <ForceChangePasswordModal
          isOpen={forceChangeData.isOpen}
          userCode={forceChangeData.userCode}
          userId={forceChangeData.userId}
          role="ADMIN"
          onSuccess={() => setForceChangeData(null)}
        />
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[92vh] flex items-center justify-center bg-slate-950 text-white">
          <div className="text-xs font-semibold text-slate-300 animate-pulse">Loading Administrator Portal...</div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
