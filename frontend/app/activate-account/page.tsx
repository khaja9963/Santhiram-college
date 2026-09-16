'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  KeyRound, ShieldCheck, Lock, Check, X, AlertCircle,
  ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2
} from 'lucide-react';
import { AuthAPI } from '@/lib/api';

function ActivateAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tokenInput, setTokenInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [tokenData, setTokenData] = useState<{
    valid: boolean;
    user_code?: string;
    name?: string;
    email?: string;
    role?: string;
    message?: string;
  } | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activatedSuccess, setActivatedSuccess] = useState<boolean>(false);
  const [welcomeInfo, setWelcomeInfo] = useState<{ name: string; role: string; user_code: string } | null>(null);

  const queryToken = searchParams.get('token');

  // Verify token when query param is present or user enters token
  useEffect(() => {
    if (queryToken) {
      setTokenInput(queryToken);
      verifyToken(queryToken);
    }
  }, [queryToken]);

  const verifyToken = async (tok: string) => {
    if (!tok.trim()) return;
    setIsVerifying(true);
    setErrorMsg(null);
    try {
      const data = await AuthAPI.verifyActivationToken(tok.trim());
      setTokenData(data);
      if (!data.valid) {
        setErrorMsg(data.message || 'Invalid or expired activation link.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error checking activation link.');
      setTokenData({ valid: false });
    } finally {
      setIsVerifying(false);
    }
  };

  // Real-time password strength checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/`~]/.test(password);
  const isMatch = password.length > 0 && password === confirmPassword;

  const validCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500';
  let strengthTextColor = 'text-red-600';

  if (validCount >= 5) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
    strengthTextColor = 'text-emerald-600';
  } else if (validCount >= 3) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-500';
    strengthTextColor = 'text-amber-600';
  }

  const isFormValid = validCount === 5 && isMatch;

  const handleActivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !tokenInput) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await AuthAPI.activateAccount({
        token: tokenInput.trim(),
        password,
        confirm_password: confirmPassword,
      });

      setWelcomeInfo({
        name: res.name || tokenData?.name || 'SREC Scholar',
        role: res.role || tokenData?.role || 'STUDENT',
        user_code: res.user_code || tokenData?.user_code || '',
      });
      setActivatedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to activate account. Please check requirements.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // First Login / Welcome Page Experience (Section 26)
  if (activatedSuccess && welcomeInfo) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Account Activated
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Welcome to SREC Smart Campus!
            </h2>
            <p className="text-xs text-slate-500">
              Your institutional password has been securely configured.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Full Name:</span>
              <span className="font-bold text-slate-900">{welcomeInfo.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Institutional ID:</span>
              <span className="font-mono font-bold text-blue-800">{welcomeInfo.user_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Institutional Role:</span>
              <span className="font-bold text-slate-900">{welcomeInfo.role}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-xs font-semibold text-slate-700">
              Your account is ready. You can now sign in with your College ID and new password.
            </p>
            <Link
              href="/login"
              className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative">
      <div className="max-w-md w-full space-y-6 bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center shadow-xs border border-blue-100">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Activate Your SREC Account
          </h2>
          <p className="text-xs text-slate-500">
            Enter your official activation link or token to initialize your password
          </p>
        </div>

        {/* Dev Token Quick-Fill */}
        {!queryToken && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-amber-900 font-bold text-[11px]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>DEVELOPMENT ONLY &bull; Sample Invited Student:</span>
              </span>
              <span className="bg-amber-200 text-amber-900 px-1 rounded text-[9px]">DEV</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const sampleToken = 'DEV_ACTIVATION_TOKEN_23CSE099';
                setTokenInput(sampleToken);
                verifyToken(sampleToken);
              }}
              className="text-blue-800 hover:text-blue-950 font-semibold underline text-left block"
            >
              Use sample token for 23CSE099 (Ananya Sharma)
            </button>
          </div>
        )}

        {/* Step 1: Token Input if not provided or valid */}
        {(!tokenData || !tokenData.valid) && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Activation Token</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste activation token here..."
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 text-xs font-mono bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => verifyToken(tokenInput)}
                  disabled={isVerifying || !tokenInput.trim()}
                  className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-xl text-xs disabled:opacity-50"
                >
                  {isVerifying ? 'Checking...' : 'Verify'}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Set Password Form when token verified */}
        {tokenData && tokenData.valid && (
          <form onSubmit={handleActivateSubmit} className="space-y-5 animate-in fade-in">
            {/* Account Details Box */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Student / Faculty Name:</span>
                <span className="font-bold text-slate-900">{tokenData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Institutional ID:</span>
                <span className="font-mono font-bold text-blue-900">{tokenData.user_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-semibold text-slate-700">{tokenData.role}</span>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Create New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters..."
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden text-xs sm:text-sm bg-slate-50/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden text-xs sm:text-sm bg-slate-50/70"
                />
              </div>
            </div>

            {/* Real-time Password Requirements & Strength Indicator (Section 8) */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Password Strength:</span>
                <span className={`font-bold ${strengthTextColor}`}>{strengthLabel}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strengthColor}`}
                  style={{ width: `${(validCount / 5) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5" />}
                  <span>8+ Characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5" />}
                  <span>Uppercase [A-Z]</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasLower ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5" />}
                  <span>Lowercase [a-z]</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5" />}
                  <span>Number [0-9]</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5" />}
                  <span>Special character</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isMatch ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {isMatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5" />}
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Activate Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Activating Account...</span>
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Activate SREC Account</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already activated?{' '}
          <Link href="/login" className="text-blue-700 font-bold hover:underline">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function ActivateAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading activation...</div>}>
      <ActivateAccountContent />
    </Suspense>
  );
}
