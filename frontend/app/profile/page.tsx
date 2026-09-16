'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User as UserIcon, Shield, Mail, Phone, MapPin, Building,
  GraduationCap, Briefcase, Calendar, KeyRound, CheckCircle2,
  AlertCircle, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { AuthAPI } from '@/lib/api';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [mobile, setMobile] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fullProfile, setFullProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const me = await AuthAPI.getMe();
      setFullProfile(me);
      setMobile(me.mobile || '');
      if (me.student_details) {
        setPhone(me.student_details.phone || '');
        setAddress(me.student_details.address || '');
      }
    } catch (e) {
      console.warn('Could not load detailed profile:', e);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await AuthAPI.updateProfile({
        mobile,
        phone,
        address,
      });
      setSuccessMsg('Profile updated successfully.');
      await refreshUser();
      await loadProfile();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin/dashboard';
    if (user?.role === 'FACULTY') return '/faculty/dashboard';
    return '/student/dashboard';
  };

  const profileData = fullProfile || user;

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 flex justify-center items-start">
      <div className="max-w-2xl w-full space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={getDashboardLink()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <Link
            href="/settings/security"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-blue-950 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-slate-100 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-900 to-blue-700 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white">
              {profileData?.full_name?.charAt(0) || 'S'}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-black text-slate-900">
                  {profileData?.full_name || 'SREC Scholar'}
                </h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                  {profileData?.role}
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  {profileData?.status || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 font-semibold">
                Institutional ID: {profileData?.user_code || profileData?.id}
              </p>
              <p className="text-xs text-slate-600">
                Department of {profileData?.department_name || profileData?.department_id || 'Computer Science & Engineering'}
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Academic / Institutional Details (Read-only / Admin-Controlled) */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Institutional Information (Admin-Controlled)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                <span className="font-semibold text-slate-800">{profileData?.email}</span>
              </div>

              {profileData?.role === 'STUDENT' && profileData?.student_details && (
                <>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Roll / Student ID</span>
                    <span className="font-mono font-bold text-blue-900">{profileData.student_details.student_id}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Year & Semester</span>
                    <span className="font-semibold text-slate-800">
                      Year {profileData.student_details.year}, Sem {profileData.student_details.semester} (Section {profileData.student_details.section})
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Admission Year</span>
                    <span className="font-semibold text-slate-800">{profileData.student_details.admission_year}</span>
                  </div>
                </>
              )}

              {profileData?.role === 'FACULTY' && profileData?.faculty_details && (
                <>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee ID</span>
                    <span className="font-mono font-bold text-blue-900">{profileData.faculty_details.employee_id}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Designation</span>
                    <span className="font-semibold text-slate-800">{profileData.faculty_details.designation}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Joining Year</span>
                    <span className="font-semibold text-slate-800">{profileData.faculty_details.joining_year}</span>
                  </div>
                </>
              )}

              {profileData?.role === 'ADMIN' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Admin Privileges</span>
                  <span className="font-bold text-purple-900">Full System & Portal Administrator</span>
                </div>
              )}
            </div>
          </div>

          {/* Editable Contact Information */}
          <form onSubmit={handleUpdate} className="space-y-4 pt-2 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Editable Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91-9876543210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 text-xs sm:text-sm bg-slate-50/50"
                  />
                </div>
              </div>

              {profileData?.role === 'STUDENT' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Residential Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Nandyal, Andhra Pradesh"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 text-xs sm:text-sm bg-slate-50/50"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving Updates...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
