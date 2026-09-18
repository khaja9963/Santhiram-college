'use client';

import React, { useState } from 'react';
import {
  X, Check, AlertCircle, CheckCircle2, GraduationCap,
  Briefcase, Phone, Mail, User, Building2, ShieldCheck, Sparkles, Loader2
} from 'lucide-react';
import { UserStore, AccessRequest } from '@/lib/user-store';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'STUDENT' | 'FACULTY';
}

export default function RequestAccessModal({ isOpen, onClose, defaultType = 'STUDENT' }: RequestAccessModalProps) {
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'FACULTY'>(defaultType);

  React.useEffect(() => {
    if (defaultType) setActiveTab(defaultType);
  }, [defaultType, isOpen]);

  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentIdCard, setStudentIdCard] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentDept, setStudentDept] = useState('Computer Science & Engineering');
  const [studentYear, setStudentYear] = useState('B.Tech 1st Year (Semester 1)');

  // Faculty Form State
  const [facultyName, setFacultyName] = useState('');
  const [facultyEmpId, setFacultyEmpId] = useState('');
  const [facultyPhone, setFacultyPhone] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyDept, setFacultyDept] = useState('Computer Science & Engineering');
  const [facultyDesignation, setFacultyDesignation] = useState('Assistant Professor');

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<AccessRequest | null>(null);

  if (!isOpen) return null;

  const resetForms = () => {
    setStudentName('');
    setStudentIdCard('');
    setStudentPhone('');
    setStudentEmail('');
    setFacultyName('');
    setFacultyEmpId('');
    setFacultyPhone('');
    setFacultyEmail('');
    setErrors({});
    setSubmittedRequest(null);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const validateStudent = () => {
    const errs: Record<string, string> = {};
    if (!studentName.trim() || studentName.trim().length < 3) {
      errs.studentName = 'Full Name is required (minimum 3 characters)';
    }
    if (!studentIdCard.trim() || studentIdCard.trim().length < 5) {
      errs.studentIdCard = 'Valid College ID Card Number / Roll No is required (e.g. 24X51A0501)';
    }
    const cleanPhone = studentPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      errs.studentPhone = 'Valid 10-digit mobile number is required';
    }
    if (!studentEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail.trim())) {
      errs.studentEmail = 'Valid email address is required';
    }
    return errs;
  };

  const validateFaculty = () => {
    const errs: Record<string, string> = {};
    if (!facultyName.trim() || facultyName.trim().length < 3) {
      errs.facultyName = 'Faculty Full Name is required';
    }
    if (!facultyEmpId.trim() || facultyEmpId.trim().length < 3) {
      errs.facultyEmpId = 'Valid Employee ID (Emp ID) is required (e.g. FAC-0105)';
    }
    const cleanPhone = facultyPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      errs.facultyPhone = 'Valid 10-digit mobile number is required';
    }
    if (!facultyEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(facultyEmail.trim())) {
      errs.facultyEmail = 'Valid official or personal email address is required';
    }
    return errs;
  };

  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStudent();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const req = UserStore.submitStudentRequest({
        fullName: studentName,
        idCardNumber: studentIdCard,
        email: studentEmail,
        mobile: studentPhone,
        department: studentDept,
        year: studentYear,
      });
      setIsSubmitting(false);
      setSubmittedRequest(req);
    }, 400);
  };

  const handleSubmitFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateFaculty();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const req = UserStore.submitFacultyRequest({
        fullName: facultyName,
        empId: facultyEmpId,
        email: facultyEmail,
        mobile: facultyPhone,
        department: facultyDept,
        designation: facultyDesignation,
      });
      setIsSubmitting(false);
      setSubmittedRequest(req);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SREC Centralized Account Administration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Request Portal Access Credentials
            </h2>
            <p className="text-xs text-slate-300">
              Admin-verified login credentials for newly admitted students and appointed faculty
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-slate-800 text-xs">
          
          {submittedRequest ? (
            /* SUCCESS CONFIRMATION SCREEN */
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5" />
                  <span>Access Request Registered with Administration</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Request Submitted, {submittedRequest.fullName}!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your credentials request has been forwarded to the <strong>SREC Central Administration / Principal Office</strong> for verification.
                </p>
              </div>

              {/* Request Summary Card */}
              <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Tracking Reference:</span>
                  <span className="font-mono font-black text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-200">
                    {submittedRequest.id}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Account Role</span>
                    <span className="font-bold text-slate-900">{submittedRequest.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{submittedRequest.type === 'STUDENT' ? 'College ID Card No' : 'Employee ID'}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {submittedRequest.type === 'STUDENT' ? submittedRequest.idCardNumber : submittedRequest.empId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Registered Email</span>
                    <span className="font-medium text-slate-900 truncate block">{submittedRequest.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contact Mobile</span>
                    <span className="font-medium text-slate-900">{submittedRequest.mobile}</span>
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
                  <span>Status: <strong className="text-amber-700 font-bold">Pending Admin Approval</strong></span>
                  <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {/* What Happens Next Explainer */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs text-blue-950 space-y-1.5 leading-relaxed max-w-md mx-auto">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Mail className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>What happens next?</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-blue-900">
                  <li>Admin will verify your <strong>{submittedRequest.type === 'STUDENT' ? 'ID card number' : 'Employee ID'}</strong> against institutional records.</li>
                  <li>Admin will generate your <strong>Login ID</strong> and <strong>Temporary Password</strong> and dispatch them to <strong>{submittedRequest.email}</strong>.</li>
                  <li>When you sign in for the first time, you will be prompted to <strong>change the temporary password</strong> and set your own secure password.</li>
                </ol>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-8 py-2.5 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                >
                  Return to Portal Login
                </button>
              </div>
            </div>
          ) : (
            /* REGISTRATION FORMS */
            <div className="space-y-4">
              {/* Role Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('STUDENT');
                    setErrors({});
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'STUDENT'
                      ? 'bg-white text-blue-950 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <span>Student Access Request</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('FACULTY');
                    setErrors({});
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'FACULTY'
                      ? 'bg-white text-blue-950 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-indigo-700" />
                  <span>Faculty Access Request</span>
                </button>
              </div>

              {/* Informative notice */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  {activeTab === 'STUDENT'
                    ? 'Newly enrolled B.Tech / M.Tech / MBA / MCA students: Enter your College ID card / roll number, email, and phone number. Administration will verify your record and email your login credentials.'
                    : 'Appointed teaching & non-teaching faculty: Enter your Employee ID, official/personal email, and contact number to obtain verified credentials.'}
                </p>
              </div>

              {/* STUDENT FORM */}
              {activeTab === 'STUDENT' && (
                <form onSubmit={handleSubmitStudent} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Student Full Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. K. Sneha Latha"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className={`w-full text-xs p-2.5 rounded-xl border ${
                        errors.studentName ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50'
                      } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                    />
                    {errors.studentName && (
                      <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.studentName}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">
                        College ID Card No / Roll No <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 24X51A0501"
                        value={studentIdCard}
                        onChange={(e) => setStudentIdCard(e.target.value.toUpperCase())}
                        className={`w-full text-xs p-2.5 rounded-xl border ${
                          errors.studentIdCard ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50'
                        } focus:bg-white focus:border-blue-600 outline-hidden font-mono uppercase font-bold`}
                      />
                      {errors.studentIdCard && (
                        <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.studentIdCard}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">
                        Phone / Mobile Number <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value.replace(/\D/g, ''))}
                        className={`w-full text-xs p-2.5 rounded-xl border ${
                          errors.studentPhone ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50'
                        } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                      />
                      {errors.studentPhone && (
                        <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.studentPhone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Email Address <span className="text-red-500 font-bold">*</span>{' '}
                      <span className="text-slate-400 font-normal">(Login details will be emailed here)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. student@gmail.com"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className={`w-full text-xs p-2.5 rounded-xl border ${
                        errors.studentEmail ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50'
                      } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                    />
                    {errors.studentEmail && (
                      <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.studentEmail}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Department / Branch</label>
                      <select
                        value={studentDept}
                        onChange={(e) => setStudentDept(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                      >
                        <option value="Computer Science & Engineering">Computer Science &amp; Engineering (CSE)</option>
                        <option value="Artificial Intelligence & Machine Learning">AI &amp; Machine Learning (CSM)</option>
                        <option value="Data Science">Data Science (CSD)</option>
                        <option value="Electronics & Communication Engineering">Electronics &amp; Comm. (ECE)</option>
                        <option value="Electrical & Electronics Engineering">Electrical &amp; Electronics (EEE)</option>
                        <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                        <option value="Civil Engineering">Civil Engineering (CE)</option>
                        <option value="Master of Business Administration">MBA</option>
                        <option value="Master of Computer Applications">MCA</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Academic Year &amp; Semester</label>
                      <select
                        value={studentYear}
                        onChange={(e) => setStudentYear(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                      >
                        <option value="B.Tech 1st Year (Semester 1)">B.Tech 1st Year (Sem 1)</option>
                        <option value="B.Tech 1st Year (Semester 2)">B.Tech 1st Year (Sem 2)</option>
                        <option value="B.Tech 2nd Year (Semester 1)">B.Tech 2nd Year (Sem 1)</option>
                        <option value="B.Tech 2nd Year (Semester 2)">B.Tech 2nd Year (Sem 2)</option>
                        <option value="B.Tech 3rd Year (Semester 1)">B.Tech 3rd Year (Sem 1)</option>
                        <option value="B.Tech 4th Year (Semester 1)">B.Tech 4th Year (Sem 1)</option>
                        <option value="Postgraduate 1st Year">Postgraduate 1st Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Submit Student Access Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* FACULTY FORM */}
              {activeTab === 'FACULTY' && (
                <form onSubmit={handleSubmitFaculty} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Faculty Full Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. V. Ramanjaneyulu"
                      value={facultyName}
                      onChange={(e) => setFacultyName(e.target.value)}
                      className={`w-full text-xs p-2.5 rounded-xl border ${
                        errors.facultyName ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50'
                      } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                    />
                    {errors.facultyName && (
                      <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.facultyName}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">
                        Faculty Employee ID (Emp ID) <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. FAC-0118"
                        value={facultyEmpId}
                        onChange={(e) => setFacultyEmpId(e.target.value.toUpperCase())}
                        className={`w-full text-xs p-2.5 rounded-xl border ${
                          errors.facultyEmpId ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50'
                        } focus:bg-white focus:border-blue-600 outline-hidden font-mono uppercase font-bold`}
                      />
                      {errors.facultyEmpId && (
                        <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.facultyEmpId}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">
                        Phone / Mobile Number <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={facultyPhone}
                        onChange={(e) => setFacultyPhone(e.target.value.replace(/\D/g, ''))}
                        className={`w-full text-xs p-2.5 rounded-xl border ${
                          errors.facultyPhone ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50'
                        } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                      />
                      {errors.facultyPhone && (
                        <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.facultyPhone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      Official / Personal Email <span className="text-red-500 font-bold">*</span>{' '}
                      <span className="text-slate-400 font-normal">(Login details will be emailed here)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. faculty@srecnandyal.edu.in or personal email"
                      value={facultyEmail}
                      onChange={(e) => setFacultyEmail(e.target.value)}
                      className={`w-full text-xs p-2.5 rounded-xl border ${
                        errors.facultyEmail ? 'border-red-500 bg-red-50/20' : 'border-slate-200 bg-slate-50'
                      } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                    />
                    {errors.facultyEmail && (
                      <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.facultyEmail}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Department</label>
                      <select
                        value={facultyDept}
                        onChange={(e) => setFacultyDept(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                      >
                        <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                        <option value="Artificial Intelligence & Machine Learning">AI &amp; Machine Learning</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Electronics & Communication Engineering">Electronics &amp; Communication</option>
                        <option value="Electrical & Electronics Engineering">Electrical &amp; Electronics</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Humanities & Sciences">Humanities &amp; Sciences</option>
                        <option value="Management Studies (MBA)">Management Studies (MBA)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Designation</label>
                      <select
                        value={facultyDesignation}
                        onChange={(e) => setFacultyDesignation(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                      >
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Professor">Professor</option>
                        <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                        <option value="Laboratory Instructor">Laboratory Instructor</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Submit Faculty Access Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
