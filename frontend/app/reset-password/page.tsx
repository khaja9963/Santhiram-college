'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock, KeyRound, Check, X, AlertCircle, CheckCircle2,
  ArrowRight, Eye, EyeOff
} from 'lucide-react';
import { AuthAPI } from '@/lib/api';

function ResetPasswordContent() {
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
  const [resetSuccess, setResetSuccess] = useState(false);

  const queryToken = searchParams.get('token');

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
      const data = await AuthAPI.verifyResetToken(tok.trim());
      setTokenData(data);
      if (!data.valid) {
        setErrorMsg(data.message || 'Invalid or expired password reset link.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to verify reset token.');
      setTokenData({ valid: false });
    } finally {
      setIsVerifying(false);
    }
  };

  // Password requirements
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

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !tokenInput) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await AuthAPI.resetPassword({
        token: tokenInput.trim(),
        password,
        confirm_password: confirmPassword,
      });
      setResetSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Password reset failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              Password Reset Successfully!
            </h2>
            <p className="text-xs text-slate-500">
              Your password has been updated. You can now log in using your new credentials.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Return to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="max-w-md w-full space-y-6 bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center shadow-xs border border-blue-100">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Reset Your Password
          </h2>
          <p className="text-xs text-slate-500">
            Create a strong, secure password for your SREC Smart Campus account
          </p>
        </div>

        {/* Token Input if needed */}
        {(!tokenData || !tokenData.valid) && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Reset Token</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste reset token here..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 text-xs font-mono bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => verifyToken(tokenInput)}
                  disabled={isVerifying || !tokenInput.trim()}
                  className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-xl text-xs disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        {tokenData && tokenData.valid && (
          <form onSubmit={handleResetSubmit} className="space-y-5 animate-in fade-in">
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Account:</span>
                <span className="font-bold text-slate-900">{tokenData.name} ({tokenData.user_code})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-semibold text-blue-900">{tokenData.role}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden text-xs sm:text-sm bg-slate-50/70"
                />
              </div>
            </div>

            {/* Real-time Password Strength */}
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

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Resetting Password...</span>
                </span>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-700 font-bold hover:underline">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading reset...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
