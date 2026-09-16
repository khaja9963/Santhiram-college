'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, UserPlus, ArrowLeft, CheckCircle2, AlertCircle,
  KeyRound, ShieldCheck, Copy, Check, Send
} from 'lucide-react';
import { AdminAPI } from '@/lib/api';

export default function AddStudentPage() {
  const router = useRouter();

  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [year, setYear] = useState(1);
  const [semester, setSemester] = useState(1);
  const [section, setSection] = useState('A');
  const [admissionYear, setAdmissionYear] = useState(2025);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<{
    user_code: string;
    email: string;
    dev_activation_token?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !fullName.trim() || !email.trim()) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await AdminAPI.createStudent({
        student_id: studentId.trim().toUpperCase(),
        full_name: fullName.trim(),
        college_email: email.trim().toLowerCase(),
        mobile_number: mobile.trim() || undefined,
        department,
        year: Number(year),
        semester: Number(semester),
        section: section.trim().toUpperCase(),
        admission_year: Number(admissionYear),
        status: 'INVITED',
      });

      setCreatedResult({
        user_code: res.user_code || studentId.trim().toUpperCase(),
        email: res.email || email.trim(),
        dev_activation_token: res.dev_activation_token,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create student account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyActivationLink = () => {
    if (!createdResult?.dev_activation_token) return;
    const link = `${window.location.origin}/activate-account?token=${createdResult.dev_activation_token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to User Management</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">Admin &gt; Users &gt; Add Student</span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Add Student Account</h1>
            <p className="text-xs text-slate-500">
              Admin-controlled creation. Account is initialized as <span className="font-bold text-amber-700">INVITED</span> until student activates password.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {createdResult ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Student Account Created Successfully!</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-100 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Student ID / Roll No:</span>
                <span className="font-mono font-bold text-blue-900">{createdResult.user_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">College Email:</span>
                <span className="font-semibold text-slate-800">{createdResult.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Status:</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">INVITED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-bold text-slate-800">STUDENT</span>
              </div>
            </div>

            {createdResult.dev_activation_token && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-900 text-[11px]">
                  <span>Secure Account Activation Token:</span>
                  <span className="bg-amber-200 text-amber-900 px-1 rounded text-[9px]">VALID 72H</span>
                </div>
                <div className="font-mono bg-white p-2 rounded-lg border border-amber-200 text-blue-900 font-bold select-all break-all text-[11px]">
                  {createdResult.dev_activation_token}
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={copyActivationLink}
                    className="flex-1 bg-white hover:bg-slate-50 text-blue-800 font-bold py-2 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Activation Link'}</span>
                  </button>
                  <Link
                    href={`/activate-account?token=${createdResult.dev_activation_token}`}
                    target="_blank"
                    className="bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <span>Test Activation</span>
                  </Link>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCreatedResult(null);
                  setStudentId('');
                  setFullName('');
                  setEmail('');
                  setMobile('');
                }}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl border border-slate-200 text-xs"
              >
                Add Another Student
              </button>
              <Link
                href="/admin/users"
                className="flex-1 bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs text-center"
              >
                Back to Directory
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Student ID / Roll No *</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 24CSE001"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 uppercase font-mono bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">College Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. 24cse001@srecnandyal.edu.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91-9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50 font-semibold text-slate-700"
                >
                  <option value="CSE">CSE - Computer Science & Engineering</option>
                  <option value="CSM">CSM - CSE (AI & ML)</option>
                  <option value="CSD">CSD - CSE (Data Science)</option>
                  <option value="ECE">ECE - Electronics & Communication</option>
                  <option value="EEE">EEE - Electrical & Electronics</option>
                  <option value="MBA">MBA - Management Studies</option>
                  <option value="MCA">MCA - Computer Applications</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Admission Year *</label>
                <input
                  type="number"
                  required
                  value={admissionYear}
                  onChange={(e) => setAdmissionYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Current Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Sem {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 bg-slate-50"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                <strong>Admin Security Constraint:</strong> Administrators cannot set or view student passwords. The student will receive an official activation link to establish their own credentials.
              </span>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <Link
                href="/admin/users"
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Student Account...' : 'Add Student & Dispatch Link'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
