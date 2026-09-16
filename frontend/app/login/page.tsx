'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  GraduationCap, User, Shield, Briefcase, Lock,
  Mail, ArrowRight, CheckCircle2, Sparkles, Eye, EyeOff, AlertCircle, KeyRound, HelpCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';

function LoginForm() {
  const [identifier, setIdentifier] = useState('student@srec.local');
  const [password, setPassword] = useState('Student@Srec2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const { login, isLoading } = useAuth();
  const searchParams = useSearchParams();

  const roleQuery = searchParams.get('role');

  useEffect(() => {
    if (roleQuery) {
      const lower = roleQuery.toLowerCase();
      if (lower === 'faculty') {
        handleRolePreset('FACULTY');
      } else if (lower === 'admin') {
        handleRolePreset('ADMIN');
      } else if (lower === 'student') {
        handleRolePreset('STUDENT');
      }
    }
  }, [roleQuery]);

  useEffect(() => {
    // Check remembered identifier
    const remembered = localStorage.getItem('srec_remember_id');
    if (remembered) {
      setIdentifier(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleRolePreset = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'STUDENT') {
      setIdentifier('student@srec.local');
      setPassword('Student@Srec2026');
    } else if (role === 'FACULTY') {
      setIdentifier('faculty@srec.local');
      setPassword('Faculty@Srec2026');
    } else {
      setIdentifier('admin@srec.local');
      setPassword('Admin@Srec2026');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your User ID, College ID, or Email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('srec_remember_id', identifier.trim());
    } else {
      localStorage.removeItem('srec_remember_id');
    }

    const res = await login(identifier.trim(), password);
    if (!res.success) {
      setErrorMessage(res.error || 'Unable to sign in. Please verify your credentials or try again later.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-7 bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 relative z-10">
        
        {/* Institutional Branding */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto flex items-center justify-center p-1.5 bg-white rounded-2xl shadow-md border border-slate-100">
            <img
              src="/images/srec_logo.png"
              alt="SREC Official Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              SREC Smart Campus
            </h2>
            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider mt-0.5">
              Santhiram Engineering College (Autonomous)
            </p>
            <p className="text-[11px] text-slate-500">
              Nandyal, Andhra Pradesh &bull; Estd. 2007
            </p>
          </div>
        </div>

        {/* Status Error / Notice Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <span className="font-semibold">{errorMessage}</span>
              {errorMessage.includes('activate your account') && (
                <div className="mt-1.5">
                  <Link
                    href="/activate-account"
                    className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 underline"
                  >
                    <span>Proceed to Account Activation</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Development Seed Accounts Helper (Clearly Labeled: DEVELOPMENT ONLY) */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>DEVELOPMENT ONLY &bull; Quick Seed Roles:</span>
            </div>
            <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">DEV</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleRolePreset('STUDENT')}
              className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                selectedRole === 'STUDENT'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRolePreset('FACULTY')}
              className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                selectedRole === 'FACULTY'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => handleRolePreset('ADMIN')}
              className={`py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                selectedRole === 'ADMIN'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>User ID / College ID / Email</span>
              <span className="text-[10px] text-slate-400 font-normal">e.g. 22X51A0501 or email</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="College ID or email"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50/70 text-slate-900 text-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Password</label>
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
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
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
                className="rounded border-slate-300 text-blue-800 focus:ring-blue-600 w-3.5 h-3.5"
              />
              <span>Remember User ID</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </span>
            ) : (
              <>
                <span>LOGIN TO SREC PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* First Time User Link */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="p-3 bg-blue-50/80 rounded-xl text-center border border-blue-100">
            <p className="text-xs text-slate-600">
              First-time user or received an invitation?
            </p>
            <Link
              href="/activate-account"
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-blue-950 hover:underline"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-700" />
              <span>Activate Your SREC Account</span>
            </Link>
          </div>

          <div className="text-center text-[11px] text-slate-500">
            Having difficulty? Contact{' '}
            <a href="mailto:ict@srecnandyal.edu.in" className="text-blue-700 font-semibold hover:underline">
              Campus ICT Center
            </a>{' '}
            or College Administrative Office.
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-900 text-white">
          <div className="text-xs font-semibold text-slate-300 animate-pulse">Loading Portal Login...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
