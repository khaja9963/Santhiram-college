'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, KeyRound, Eye, EyeOff, Check, AlertCircle, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { UserStore } from '@/lib/user-store';
import { useAuth } from '@/lib/auth-context';

interface ForceChangePasswordModalProps {
  isOpen: boolean;
  userCode: string;
  userId: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  onSuccess: () => void;
}

export default function ForceChangePasswordModal({
  isOpen,
  userCode,
  userId,
  role,
  onSuccess,
}: ForceChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  if (!isOpen) return null;

  // Real-time strength checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/`~]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const validCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const isPasswordValid = validCount >= 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Password must meet at least 4 security requirements (minimum 8 characters, uppercase, lowercase, numbers, special characters).');
      return;
    }

    if (!isMatch) {
      setError('Passwords do not match. Please re-type your confirm password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const success = UserStore.changePassword(userId || userCode, newPassword);
      setIsSubmitting(false);

      if (success) {
        onSuccess();
        // Redirect to dashboard
        if (role === 'STUDENT') {
          router.push('/student/dashboard');
        } else if (role === 'FACULTY') {
          router.push('/faculty/dashboard');
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        setError('Failed to update password. Please try again.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-auto space-y-5 text-xs text-slate-800">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner ring-4 ring-amber-50">
            <KeyRound className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
              First-Time Sign In Security
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Create Your New Password
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
              Welcome, <strong className="text-slate-800">{userCode}</strong>! Your temporary admin-issued password must be updated to a private password before entering the portal.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-hidden font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                  confirmPassword && !isMatch ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50'
                } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
              />
            </div>
          </div>

          {/* Password Checklist */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-[11px]">
            <div className="font-bold text-slate-700">Password Checklist:</div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <Check className={`w-3 h-3 ${hasMinLength ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Min 8 characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <Check className={`w-3 h-3 ${hasUpper && hasLower ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Upper &amp; lowercase</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <Check className={`w-3 h-3 ${hasNumber ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>At least 1 number</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                <Check className={`w-3 h-3 ${hasSpecial ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Special character (!@#$)</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isPasswordValid || !isMatch}
            className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving New Password...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Update Password &amp; Enter Portal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
