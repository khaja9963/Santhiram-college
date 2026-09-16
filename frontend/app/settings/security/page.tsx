'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock, KeyRound, Shield, Check, X, AlertCircle, CheckCircle2,
  ArrowRight, Eye, EyeOff, ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { AuthAPI } from '@/lib/api';

export default function SecuritySettingsPage() {
  const { user, token } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Strength checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/`~]/.test(newPassword);
  const isDifferent = newPassword.length > 0 && newPassword !== currentPassword;
  const isMatch = newPassword.length > 0 && newPassword === confirmNewPassword;

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

  const isFormValid =
    currentPassword.length > 0 &&
    validCount === 5 &&
    isDifferent &&
    isMatch;

  const handleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await AuthAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });
      setSuccessMsg('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to change password. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin/dashboard';
    if (user?.role === 'FACULTY') return '/faculty/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 flex justify-center items-start">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Breadcrumb / Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={getDashboardLink()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs text-slate-400 font-mono">Profile &gt; Security</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Security & Password</h1>
              <p className="text-xs text-slate-500">
                Manage your institutional password and access protection
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleChangeSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden text-xs sm:text-sm bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters..."
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden text-xs sm:text-sm bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden text-xs sm:text-sm bg-slate-50"
                />
              </div>
            </div>

            {/* Password Strength Meter */}
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

              {newPassword && currentPassword && newPassword === currentPassword && (
                <p className="text-[11px] text-red-600 font-semibold pt-1">
                  * New password cannot be the same as your current password.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating Password...</span>
                </span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
