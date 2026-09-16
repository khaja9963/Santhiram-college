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
import { assetUrl } from '@/lib/assets';

function LoginForm() {
  const [identifier, setIdentifier] = useState('student@srec.local');
  const [password, setPassword] = useState('Student@Srec2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const { login, demoLogin, isLoading } = useAuth();
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
              src={assetUrl('/images/srec_logo.png')}
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

        {/* Instant 1-Click Demo Login Card */}
        <div className="p-4 bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-blue-100/50 border border-blue-200 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#0B2545] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Instant 1-Click Demo Login</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              No Password Needed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => demoLogin('STUDENT')}
              className="py-2.5 px-2 bg-white hover:bg-blue-800 text-slate-800 hover:text-white rounded-xl border border-blue-200/80 shadow-xs transition-all duration-200 flex flex-col items-center gap-1 group text-center active:scale-95 cursor-pointer"
              title="Instant Login as Student"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-700 text-blue-900 group-hover:text-white flex items-center justify-center transition-colors">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">Student</span>
              <span className="text-[9px] text-slate-400 group-hover:text-blue-200 font-mono">22X51A0501</span>
            </button>

            <button
              type="button"
              onClick={() => demoLogin('FACULTY')}
              className="py-2.5 px-2 bg-white hover:bg-blue-800 text-slate-800 hover:text-white rounded-xl border border-blue-200/80 shadow-xs transition-all duration-200 flex flex-col items-center gap-1 group text-center active:scale-95 cursor-pointer"
              title="Instant Login as Faculty"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 group-hover:bg-blue-700 text-indigo-900 group-hover:text-white flex items-center justify-center transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">Faculty</span>
              <span className="text-[9px] text-slate-400 group-hover:text-blue-200 font-mono">FAC-0104</span>
            </button>

            <button
              type="button"
              onClick={() => demoLogin('ADMIN')}
              className="py-2.5 px-2 bg-white hover:bg-blue-800 text-slate-800 hover:text-white rounded-xl border border-blue-200/80 shadow-xs transition-all duration-200 flex flex-col items-center gap-1 group text-center active:scale-95 cursor-pointer"
              title="Instant Login as Admin"
            >
              <div className="w-8 h-8 rounded-full bg-amber-100 group-hover:bg-blue-700 text-amber-900 group-hover:text-white flex items-center justify-center transition-colors">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">Admin</span>
              <span className="text-[9px] text-slate-400 group-hover:text-blue-200 font-mono">ADM-001</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-blue-100">
            <span>Autofill credentials form:</span>
            <div className="flex items-center gap-2 font-bold text-blue-700">
              <button type="button" onClick={() => handleRolePreset('STUDENT')} className="hover:underline">Student</button>
              <span>&bull;</span>
              <button type="button" onClick={() => handleRolePreset('FACULTY')} className="hover:underline">Faculty</button>
              <span>&bull;</span>
              <button type="button" onClick={() => handleRolePreset('ADMIN')} className="hover:underline">Admin</button>
            </div>
          </div>
        </div>

        <div className="relative flex py-0.5 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="shrink-0 mx-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Or Sign In With Credentials
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
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
