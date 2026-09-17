'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  GraduationCap, CheckCircle2, AlertCircle, XCircle, Clock,
  Search, Filter, Download, Eye, Check, X, ArrowLeft,
  FileText, Sparkles, RefreshCw, Printer, Phone, Mail,
  Building2, User, Award, FileCheck, ChevronRight, ExternalLink,
  ShieldCheck, MapPin
} from 'lucide-react';

export interface BTechApplication {
  refNo: string;
  fullName: string;
  fatherName: string;
  dob?: string;
  gender?: string;
  category?: string;
  mobile: string;
  whatsapp?: string;
  email: string;
  address?: string;
  district?: string;
  state?: string;
  firstChoice: string;
  secondChoice?: string;
  hostelRequired?: string;
  interCollege?: string;
  interBoard?: string;
  interPercentage: string;
  entranceExam?: string;
  entranceRank?: string;
  hallTicketNumber?: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  allottedBranch?: string;
  adminRemarks?: string;
  approvedAt?: string;
  approvedBy?: string;
}

const DEFAULT_SAMPLE_APPLICATIONS: BTechApplication[] = [
  {
    refNo: 'SREC-BTECH-2026-94812',
    fullName: 'B. Rajesh Kumar',
    fatherName: 'B. Venkateswarlu',
    dob: '2008-04-18',
    gender: 'Male',
    category: 'OC',
    mobile: '9848022338',
    whatsapp: '9848022338',
    email: 'rajesh.kumar@gmail.com',
    address: 'Plot No. 45, Sanjeeva Nagar',
    district: 'Nandyal',
    state: 'Andhra Pradesh',
    firstChoice: 'CSE - Computer Science & Engineering',
    secondChoice: 'CSM - Artificial Intelligence & Machine Learning',
    hostelRequired: 'No',
    interCollege: 'Sri Chaitanya Junior College, Nandyal',
    interBoard: 'BIEAP (Andhra Pradesh State Board)',
    interPercentage: '94.2%',
    entranceExam: 'AP EAPCET',
    entranceRank: '14250',
    hallTicketNumber: 'EAPCET26-88319',
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'PENDING',
  },
  {
    refNo: 'SREC-BTECH-2026-58102',
    fullName: 'K. Sneha Reddy',
    fatherName: 'K. Pratap Reddy',
    dob: '2008-07-22',
    gender: 'Female',
    category: 'OC',
    mobile: '9440182736',
    whatsapp: '9440182736',
    email: 'sneha.reddy@gmail.com',
    address: 'H.No 3-12, Gandhi Chowk',
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    firstChoice: 'CSM - Artificial Intelligence & Machine Learning',
    secondChoice: 'CSE - Computer Science & Engineering',
    hostelRequired: 'Yes',
    interCollege: 'Narayana Junior College, Kurnool',
    interBoard: 'BIEAP (Andhra Pradesh State Board)',
    interPercentage: '96.5%',
    entranceExam: 'AP EAPCET',
    entranceRank: '9820',
    hallTicketNumber: 'EAPCET26-61902',
    submittedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    status: 'APPROVED',
    allottedBranch: 'CSM - Artificial Intelligence & Machine Learning',
    adminRemarks: 'Verified 10+2 MPC memo (96.5%). Category-B Institutional Merit seat confirmed.',
    approvedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    approvedBy: 'Admin (Dr. M. S. Rao, Principal)',
  },
  {
    refNo: 'SREC-BTECH-2026-72419',
    fullName: 'Shaik Mohammed Irfan',
    fatherName: 'Shaik Mahaboob Basha',
    dob: '2007-11-09',
    gender: 'Male',
    category: 'BC-E',
    mobile: '9177234589',
    whatsapp: '9177234589',
    email: 'shaik.irfan@outlook.com',
    address: 'Near Old Bus Stand, Atmakur Road',
    district: 'Nandyal',
    state: 'Andhra Pradesh',
    firstChoice: 'CSD - Data Science',
    secondChoice: 'CSE - Computer Science & Engineering',
    hostelRequired: 'No',
    interCollege: 'Govt Junior College for Boys, Nandyal',
    interBoard: 'BIEAP (Andhra Pradesh State Board)',
    interPercentage: '88.0%',
    entranceExam: 'AP EAPCET',
    entranceRank: '28410',
    hallTicketNumber: 'EAPCET26-34821',
    submittedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    status: 'PENDING',
  },
  {
    refNo: 'SREC-BTECH-2026-31904',
    fullName: 'P. Ananya Varma',
    fatherName: 'P. Ranga Raju',
    dob: '2008-01-30',
    gender: 'Female',
    category: 'OC',
    mobile: '9676512398',
    whatsapp: '9676512398',
    email: 'ananya.varma@gmail.com',
    address: 'D.No 5-88, NGO Colony',
    district: 'Kadapa',
    state: 'Andhra Pradesh',
    firstChoice: 'ECE - Electronics & Communication Engineering',
    secondChoice: 'CSE - Computer Science & Engineering',
    hostelRequired: 'Yes',
    interCollege: 'Sri Medha Junior College, Kadapa',
    interBoard: 'BIEAP (Andhra Pradesh State Board)',
    interPercentage: '91.8%',
    entranceExam: 'JEE Mains',
    entranceRank: '38210',
    hallTicketNumber: 'JEE26-881249',
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'APPROVED',
    allottedBranch: 'ECE - Electronics & Communication Engineering',
    adminRemarks: 'Eligible for Category-B institutional merit. Hostel accommodation reserved.',
    approvedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    approvedBy: 'Admin (Admissions Convener)',
  }
];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<BTechApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState<BTechApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Approval form state
  const [allotmentBranch, setAllotmentBranch] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    try {
      const raw = localStorage.getItem('srec_btech_applications');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalise items to ensure status exists
          const clean = parsed.map((item: any) => ({
            status: item.status || 'PENDING',
            ...item,
          }));
          setApplications(clean);
          return;
        }
      }
      // If none exist, seed default sample applications
      localStorage.setItem('srec_btech_applications', JSON.stringify(DEFAULT_SAMPLE_APPLICATIONS));
      setApplications(DEFAULT_SAMPLE_APPLICATIONS);
    } catch {
      setApplications(DEFAULT_SAMPLE_APPLICATIONS);
    }
  };

  const saveApplications = (updated: BTechApplication[]) => {
    setApplications(updated);
    try {
      localStorage.setItem('srec_btech_applications', JSON.stringify(updated));
    } catch {}
  };

  const handleOpenModal = (app: BTechApplication) => {
    setSelectedApp(app);
    setAllotmentBranch(app.allottedBranch || app.firstChoice);
    setAdminNote(app.adminRemarks || '');
    setIsModalOpen(true);
  };

  const handleApprove = (appToApprove: BTechApplication, branchOverride?: string, noteOverride?: string) => {
    setIsActionLoading(true);
    const branchToAllot = branchOverride || allotmentBranch || appToApprove.firstChoice;
    const remarks = noteOverride || adminNote || `Approved by Admin for ${branchToAllot} under Category-B Institutional Merit.`;

    const updated = applications.map((item) => {
      if (item.refNo === appToApprove.refNo) {
        return {
          ...item,
          status: 'APPROVED' as const,
          allottedBranch: branchToAllot,
          adminRemarks: remarks,
          approvedAt: new Date().toISOString(),
          approvedBy: 'Academic Administrator (Principal Office)',
        };
      }
      return item;
    });

    saveApplications(updated);
    if (selectedApp?.refNo === appToApprove.refNo) {
      setSelectedApp({
        ...appToApprove,
        status: 'APPROVED',
        allottedBranch: branchToAllot,
        adminRemarks: remarks,
        approvedAt: new Date().toISOString(),
        approvedBy: 'Academic Administrator (Principal Office)',
      });
    }

    setTimeout(() => {
      setIsActionLoading(false);
      setSuccessToast(`Application ${appToApprove.refNo} approved! Seat allotted in ${branchToAllot}.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 300);
  };

  const handleReject = (appToReject: BTechApplication, reason?: string) => {
    setIsActionLoading(true);
    const remarks = reason || adminNote || 'Application rejected: Ineligible criteria or incomplete document verification.';

    const updated = applications.map((item) => {
      if (item.refNo === appToReject.refNo) {
        return {
          ...item,
          status: 'REJECTED' as const,
          adminRemarks: remarks,
          approvedAt: new Date().toISOString(),
          approvedBy: 'Academic Administrator',
        };
      }
      return item;
    });

    saveApplications(updated);
    if (selectedApp?.refNo === appToReject.refNo) {
      setSelectedApp({
        ...appToReject,
        status: 'REJECTED',
        adminRemarks: remarks,
        approvedAt: new Date().toISOString(),
        approvedBy: 'Academic Administrator',
      });
    }

    setTimeout(() => {
      setIsActionLoading(false);
      setSuccessToast(`Application ${appToReject.refNo} marked as Rejected.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 300);
  };

  const handleResetToPending = (app: BTechApplication) => {
    const updated = applications.map((item) => {
      if (item.refNo === app.refNo) {
        return {
          ...item,
          status: 'PENDING' as const,
          allottedBranch: undefined,
          adminRemarks: undefined,
          approvedAt: undefined,
          approvedBy: undefined,
        };
      }
      return item;
    });
    saveApplications(updated);
    if (selectedApp?.refNo === app.refNo) {
      setSelectedApp({
        ...app,
        status: 'PENDING',
        allottedBranch: undefined,
        adminRemarks: undefined,
      });
    }
  };

  const downloadAllotmentLetter = (app: BTechApplication) => {
    const content = `========================================================================
SANTHIRAM ENGINEERING COLLEGE (AUTONOMOUS) - NANDYAL
Approved by AICTE, New Delhi | Affiliated to JNTUA, Ananthapuramu
Accredited by NAAC with 'A' Grade & NBA | EAPCET Code: SREC
NH-40, Nerawada, Nandyal - 518501, Andhra Pradesh
========================================================================
PROVISIONAL ADMISSION ALLOTMENT LETTER - B.TECH 2026-2027
Category - B (Institutional Merit / Management Quota)
========================================================================

Application Reference No : ${app.refNo}
Date of Allotment        : ${app.approvedAt ? new Date(app.approvedAt).toLocaleDateString() : new Date().toLocaleDateString()}
Approval Authority       : ${app.approvedBy || 'Admission Committee, SREC'}

CANDIDATE PARTICULARS:
------------------------------------------------------------------------
Candidate Full Name      : ${app.fullName}
Father / Guardian Name   : ${app.fatherName}
Date of Birth            : ${app.dob || 'As per SSC records'}
Category / Community     : ${app.category || 'OC'}
Contact Mobile           : ${app.mobile}
Email ID                 : ${app.email}
Address                  : ${app.address || 'Nandyal'}, ${app.district || 'Nandyal'}, ${app.state || 'Andhra Pradesh'}

QUALIFYING EXAMINATION DETAILS:
------------------------------------------------------------------------
Intermediate College     : ${app.interCollege || 'Junior College'}
Board of Intermediate    : ${app.interBoard || 'BIEAP'}
MPC Aggregate Percentage : ${app.interPercentage}
Entrance Exam & Rank     : ${app.entranceExam || 'AP EAPCET'} - ${app.entranceRank || 'Merit Score'}
Hall Ticket Number       : ${app.hallTicketNumber || 'N/A'}

PROVISIONAL SEAT ALLOTMENT:
------------------------------------------------------------------------
Allotted Course          : Bachelor of Technology (B.Tech - 4 Years)
Allotted Branch          : ${app.allottedBranch || app.firstChoice}
Quota Category           : Category-B Institutional Merit Selection
Hostel Accommodation     : ${app.hostelRequired === 'Yes' ? 'Opted (Boys/Girls Campus Hostel)' : 'Day Scholar (College Transport)'}
Admin Remarks            : ${app.adminRemarks || 'Document verification satisfactory. Seat confirmed.'}

TERMS & REPORTING INSTRUCTIONS:
------------------------------------------------------------------------
1. The candidate is provisionally allotted a B.Tech seat in ${app.allottedBranch || app.firstChoice} at Santhiram Engineering College.
2. The candidate must report in person to the SREC Admissions Cell within 3 working days with original certificates (10th Marks Memo, Intermediate Marks Memo, Transfer Certificate, Study & Bonafide Certificates, Caste/Income Certificate if applicable).
3. This allotment is strictly subject to the fulfillment of eligibility criteria prescribed by APSCHE and JNTUA.

Sd/-
PRINCIPAL / ADMISSION CONVENER
SANTHIRAM ENGINEERING COLLEGE (AUTONOMOUS), NANDYAL
========================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${app.refNo}_Provisional_Allotment_Letter.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = [
      'Ref No', 'Full Name', 'Father Name', 'Mobile', 'Email',
      '1st Choice', '2nd Choice', 'Inter MPC %', 'Entrance Exam',
      'Entrance Rank', 'Category', 'Hostel', 'Status', 'Allotted Branch', 'Submitted At'
    ];
    const rows = filteredApplications.map(app => [
      `"${app.refNo}"`,
      `"${app.fullName}"`,
      `"${app.fatherName}"`,
      `"${app.mobile}"`,
      `"${app.email}"`,
      `"${app.firstChoice}"`,
      `"${app.secondChoice || ''}"`,
      `"${app.interPercentage}"`,
      `"${app.entranceExam || ''}"`,
      `"${app.entranceRank || ''}"`,
      `"${app.category || ''}"`,
      `"${app.hostelRequired || 'No'}"`,
      `"${app.status}"`,
      `"${app.allottedBranch || ''}"`,
      `"${new Date(app.submittedAt).toLocaleString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SREC_BTech_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const matchesBranch = branchFilter === 'ALL' || app.firstChoice.includes(branchFilter) || (app.allottedBranch && app.allottedBranch.includes(branchFilter));
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        app.fullName.toLowerCase().includes(q) ||
        app.refNo.toLowerCase().includes(q) ||
        app.mobile.includes(q) ||
        app.email.toLowerCase().includes(q) ||
        (app.interCollege && app.interCollege.toLowerCase().includes(q));

      return matchesStatus && matchesBranch && matchesSearch;
    });
  }, [applications, statusFilter, branchFilter, searchQuery]);

  // Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-700 animate-in slide-in-from-top-4 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/admin/dashboard" className="hover:text-blue-900">Admin</Link>
            <span>&gt;</span>
            <span className="text-slate-900 font-bold">New Applications</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileCheck className="w-7 h-7 text-blue-900" />
            <span>New Applications (B.Tech 2026-27)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Institutional Merit (Category-B) &bull; Verify student applications, allot branch seats, and dispatch approval letters
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadApplications}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs border border-slate-200 shadow-xs transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/admissions"
            target="_blank"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors"
          >
            <span>Open Student Form</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Applications</span>
            <FileText className="w-4 h-4 text-blue-800" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">Category-B online intake</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-900">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">Awaiting admin verification</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">Seats Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900">{approvedCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium">Allotment letter issued</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">Rejected / Hold</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-900">{rejectedCount}</div>
          <div className="text-[11px] text-rose-700 font-medium">Ineligible or withdrawn</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search candidate, ref no, mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-700 outline-hidden font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Branch filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="text-xs font-bold p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="ALL">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="CSM">CSM (AI &amp; ML)</option>
            <option value="CSD">CSD (Data Science)</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="ME">Mechanical</option>
            <option value="CE">Civil</option>
          </select>
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Ref No &amp; Date</th>
                <th className="py-3.5 px-4">Candidate Details</th>
                <th className="py-3.5 px-4">Branch Preferences</th>
                <th className="py-3.5 px-4">Qualifying Merit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Admin Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="font-bold text-slate-800 text-sm">No applications found</div>
                      <p className="text-xs text-slate-500">
                        No B.Tech applications match the current search or filters. Click &quot;Open Student Form&quot; to submit an application.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const isApproved = app.status === 'APPROVED';
                  const isPending = app.status === 'PENDING';
                  const isRejected = app.status === 'REJECTED';

                  return (
                    <tr
                      key={app.refNo}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => handleOpenModal(app)}
                    >
                      {/* Ref No & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-blue-900">{app.refNo}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(app.submittedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>

                      {/* Candidate Particulars */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.fullName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{app.mobile}</span>
                          <span>&bull;</span>
                          <span className="font-semibold text-slate-600">{app.category || 'OC'}</span>
                        </div>
                      </td>

                      {/* Branch Preferences */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-blue-950">{app.firstChoice}</div>
                        {app.secondChoice && (
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                            2nd: {app.secondChoice}
                          </div>
                        )}
                        {app.hostelRequired === 'Yes' && (
                          <span className="inline-block mt-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                            Hostel Opted
                          </span>
                        )}
                      </td>

                      {/* Academic Merit */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-emerald-700">
                          {app.interPercentage} <span className="font-medium text-[11px] text-slate-500">MPC</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {app.entranceExam || 'EAPCET'}: <strong className="text-slate-800">{app.entranceRank || 'Direct Merit'}</strong>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Approved</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full border border-rose-300">
                            <XCircle className="w-3.5 h-3.5 text-rose-700" />
                            <span>Rejected</span>
                          </span>
                        )}
                        {isApproved && app.allottedBranch && (
                          <div className="text-[10px] font-bold text-emerald-800 mt-1 truncate max-w-[150px]">
                            {app.allottedBranch}
                          </div>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(app)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            View &amp; Verify
                          </button>

                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleApprove(app)}
                              className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                              title="1-Click Approve"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {isApproved && (
                            <button
                              type="button"
                              onClick={() => downloadAllotmentLetter(app)}
                              className="flex items-center gap-1 bg-blue-900 hover:bg-blue-950 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                              title="Download Allotment Order"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Order</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED APPLICATION REVIEW & APPROVAL MODAL */}
      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white p-5 flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                    {selectedApp.refNo}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedApp.status === 'APPROVED' ? 'bg-emerald-500 text-white' :
                    selectedApp.status === 'REJECTED' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-950'
                  }`}>
                    {selectedApp.status}
                  </span>
                </div>
                <h2 className="text-xl font-black">{selectedApp.fullName}</h2>
                <p className="text-xs text-slate-300">
                  Application Date: {new Date(selectedApp.submittedAt).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
              
              {/* Section 1: Candidate Particulars */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                  <User className="w-4 h-4 text-blue-700" />
                  <span>Personal Particulars</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Full Name</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedApp.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Father / Guardian</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedApp.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Date of Birth</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedApp.dob || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Gender &amp; Category</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedApp.gender || 'Male'} &bull; {selectedApp.category || 'OC'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Mobile Number</span>
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      {selectedApp.mobile}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Email Address</span>
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-600" />
                      {selectedApp.email}
                    </span>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="text-slate-500 block text-[11px]">Residential Address</span>
                    <span className="font-medium text-slate-800 text-xs">
                      {selectedApp.address || 'Nandyal'}, {selectedApp.district || 'Nandyal'}, {selectedApp.state || 'Andhra Pradesh'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Qualifications & Entrance */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>Academic Qualifications &amp; Merit</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">Intermediate College</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedApp.interCollege || 'Junior College'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Board of Exam</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedApp.interBoard || 'BIEAP'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Intermediate MPC %</span>
                    <span className="font-black text-emerald-700 text-sm">{selectedApp.interPercentage}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Entrance Examination</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedApp.entranceExam || 'AP EAPCET'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Rank / Hall Ticket</span>
                    <span className="font-bold text-slate-900 text-xs">
                      {selectedApp.entranceRank || 'Merit Score'} &bull; {selectedApp.hallTicketNumber || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Branch Choices & Hostel */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Program Preferences</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">1st Branch Preference</span>
                    <span className="font-bold text-blue-900 text-xs">{selectedApp.firstChoice}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">2nd Branch Preference</span>
                    <span className="font-bold text-slate-700 text-xs">{selectedApp.secondChoice || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Hostel Facility</span>
                    <span className="font-bold text-slate-900 text-xs">
                      {selectedApp.hostelRequired === 'Yes' ? 'Yes, SREC Campus Hostel Required' : 'No, Day Scholar (Bus)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Admission Category</span>
                    <span className="font-bold text-amber-900 text-xs">Category-B Institutional Merit Selection</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Admin Approval & Seat Allotment Action */}
              <div className="p-4 bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border-2 border-blue-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <div className="flex items-center gap-2 text-blue-950 font-black uppercase tracking-wider text-xs">
                    <ShieldCheck className="w-4 h-4 text-blue-800" />
                    <span>Admin Action &amp; Provisional Allotment</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-800 bg-white px-2.5 py-0.5 rounded-md border border-blue-200">
                    Principal / Convener Authority
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Allot B.Tech Branch Seat:
                    </label>
                    <select
                      value={allotmentBranch}
                      onChange={(e) => setAllotmentBranch(e.target.value)}
                      className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-700"
                    >
                      <option value="CSE - Computer Science & Engineering">CSE - Computer Science &amp; Engineering</option>
                      <option value="CSM - Artificial Intelligence & Machine Learning">CSM - Artificial Intelligence &amp; ML</option>
                      <option value="CSD - Data Science">CSD - Data Science</option>
                      <option value="ECE - Electronics & Communication Engineering">ECE - Electronics &amp; Communication</option>
                      <option value="EEE - Electrical & Electronics Engineering">EEE - Electrical &amp; Electronics</option>
                      <option value="ME - Mechanical Engineering">ME - Mechanical Engineering</option>
                      <option value="CE - Civil Engineering">CE - Civil Engineering</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Admin Remarks &amp; Verification Note:
                    </label>
                    <textarea
                      rows={2}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="e.g. 10+2 MPC certificate verified. Provisional admission approved under Category-B merit."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:border-blue-700 outline-hidden font-medium"
                    />
                  </div>

                  {selectedApp.status === 'APPROVED' && (
                    <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Seat Provisionally Allotted in {selectedApp.allottedBranch || selectedApp.firstChoice}</span>
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        Approved on {selectedApp.approvedAt ? new Date(selectedApp.approvedAt).toLocaleString() : 'N/A'} by {selectedApp.approvedBy || 'Admin'}.
                      </div>
                    </div>
                  )}

                  {selectedApp.status === 'REJECTED' && (
                    <div className="p-3 bg-rose-100 border border-rose-300 text-rose-950 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <XCircle className="w-4 h-4 text-rose-700" />
                        <span>Application Rejected</span>
                      </div>
                      <div className="text-[11px] text-rose-800">
                        Remarks: {selectedApp.adminRemarks || 'Did not meet criteria'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                {selectedApp.status !== 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => handleResetToPending(selectedApp)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline cursor-pointer"
                  >
                    Reset to Pending
                  </button>
                )}
                {selectedApp.status === 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => downloadAllotmentLetter(selectedApp)}
                    className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-950 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Allotment Letter</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedApp.status !== 'REJECTED' && (
                  <button
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => handleReject(selectedApp)}
                    className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-70"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => handleApprove(selectedApp)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-70"
                >
                  <Check className="w-4 h-4" />
                  <span>{selectedApp.status === 'APPROVED' ? 'Update Approval' : 'Approve & Allot Seat'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
