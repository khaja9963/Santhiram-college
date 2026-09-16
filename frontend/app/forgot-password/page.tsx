'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { AuthAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetToken, setDevResetToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await AuthAPI.forgotPassword(identifier.trim());
      setSubmitted(true);
      if (res.dev_token) {
        setDevResetToken(res.dev_token);
      }
    } catch (err: any) {
      // Always show success/generic message or handle network error
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="max-w-md w-full space-y-6 bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center shadow-xs border border-blue-100">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-xs text-slate-500">
            Enter your SREC College ID or registered institutional email to receive a secure reset link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Reset Link Dispatched</span>
              </div>
              <p className="leading-relaxed text-slate-700">
                If an account matches the information provided, a password reset link has been sent to the registered email address.
              </p>
              <p className="text-[11px] text-slate-500">
                The link is valid for 1 hour. Please check your inbox and spam folder.
              </p>
            </div>

            {/* Dev Assistance Box */}
            {devResetToken && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between text-amber-900 font-bold text-[11px]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>DEVELOPMENT ONLY Reset Link:</span>
                  </span>
                  <span className="bg-amber-200 text-amber-900 px-1 rounded text-[9px]">DEV</span>
                </div>
                <Link
                  href={`/reset-password?token=${devResetToken}`}
                  className="text-blue-800 font-semibold underline block break-all text-[11px]"
                >
                  Click here to open /reset-password?token={devResetToken}
                </Link>
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                SREC College ID or Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 22X51A0501 or student@srec.local"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden text-xs sm:text-sm bg-slate-50/70"
                />
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
              disabled={isSubmitting || !identifier.trim()}
              className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Request...</span>
                </span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
