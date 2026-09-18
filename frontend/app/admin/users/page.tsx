'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, UserPlus, Shield, GraduationCap, Briefcase, Search,
  Filter, CheckCircle2, AlertTriangle, RefreshCw, Send, KeyRound,
  Eye, MoreVertical, X, Check, Lock, ChevronLeft, ChevronRight,
  Clock, ShieldAlert, History, FileCheck, Mail, Inbox, UserCheck,
  AlertCircle, Sparkles, CheckCircle, ShieldCheck, Copy
} from 'lucide-react';
import { AdminAPI } from '@/lib/api';
import { UserStore, AccessRequest, StoredUser, DispatchedEmail } from '@/lib/user-store';

interface UserItem {
  id: string;
  user_code: string;
  name: string;
  full_name: string;
  email: string;
  mobile?: string;
  role: 'ADMIN' | 'STUDENT' | 'FACULTY';
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED' | 'GRADUATED';
  department_id?: string;
  department_name?: string;
  last_login?: string;
  created_at?: string;
  mustChangePassword?: boolean;
  student_details?: any;
  faculty_details?: any;
}

interface UserStats {
  total_users: number;
  students: number;
  faculty: number;
  admins: number;
  active_users: number;
  invited_users: number;
  suspended_users: number;
  deactivated_users: number;
}

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'directory' | 'emails'>('requests');

  // Directory state
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Access Requests state
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [reqFilterType, setReqFilterType] = useState<string>('ALL');
  const [reqFilterStatus, setReqFilterStatus] = useState<string>('ALL');
  const [selectedReq, setSelectedReq] = useState<AccessRequest | null>(null);
  const [assignedLoginId, setAssignedLoginId] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Dispatched Emails state
  const [dispatchedEmails, setDispatchedEmails] = useState<DispatchedEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<DispatchedEmail | null>(null);

  // Modals & Action States
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Load all data
  useEffect(() => {
    loadStats();
    loadUsers();
    loadRequests();
    loadEmails();
  }, [page, roleFilter, statusFilter]);

  const loadRequests = () => {
    try {
      const data = UserStore.getRequests();
      setRequests(data);
    } catch (e) {
      console.warn('Failed to load access requests:', e);
    }
  };

  const loadEmails = () => {
    try {
      const data = UserStore.getEmails();
      setDispatchedEmails(data);
    } catch (e) {
      console.warn('Failed to load dispatched emails:', e);
    }
  };

  const loadStats = async () => {
    try {
      const s = await AdminAPI.getUserStats();
      setStats(s);
    } catch (e) {
      // Fallback compute stats from local UserStore
      const localUsers = UserStore.getUsers();
      const localRequests = UserStore.getRequests();
      setStats({
        total_users: localUsers.length,
        students: localUsers.filter((u) => u.role === 'STUDENT').length,
        faculty: localUsers.filter((u) => u.role === 'FACULTY').length,
        admins: localUsers.filter((u) => u.role === 'ADMIN').length,
        active_users: localUsers.filter((u) => u.status === 'ACTIVE').length,
        invited_users: localRequests.filter((r) => r.status === 'PENDING').length,
        suspended_users: localUsers.filter((u) => u.status === 'SUSPENDED').length,
        deactivated_users: 0,
      });
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const res = await AdminAPI.getUsers({
        search: search.trim() || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        page,
        limit: 10,
      });
      if (res && res.users && res.users.length > 0) {
        setUsers(res.users);
        setTotalPages(res.total_pages || 1);
        setTotalCount(res.total || res.users.length);
      } else {
        // Fallback to UserStore
        loadLocalUsers();
      }
    } catch (err: any) {
      loadLocalUsers();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalUsers = () => {
    const local = UserStore.getUsers();
    let filtered = local.map((u) => ({
      id: u.id,
      user_code: u.user_code,
      name: u.full_name,
      full_name: u.full_name,
      email: u.email,
      mobile: u.mobile,
      role: u.role,
      status: u.status,
      department_name: u.department_name,
      mustChangePassword: u.mustChangePassword,
      created_at: u.created_at,
    }));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.user_code.toLowerCase().includes(q) ||
          u.full_name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    setUsers(filtered);
    setTotalPages(1);
    setTotalCount(filtered.length);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleOpenReviewModal = (req: AccessRequest) => {
    setSelectedReq(req);
    setShowRejectForm(false);
    setRejectionReason('');

    // Pre-populate login ID
    if (req.type === 'STUDENT') {
      setAssignedLoginId(req.idCardNumber || `24X51A0${Math.floor(100 + Math.random() * 900)}`);
    } else {
      setAssignedLoginId(req.empId || `FAC-0${Math.floor(100 + Math.random() * 900)}`);
    }

    // Pre-populate strong temporary password
    setTempPassword(UserStore.generateRandomPassword());
  };

  const handleGenerateNewPassword = () => {
    setTempPassword(UserStore.generateRandomPassword());
  };

  const handleApproveAndSendEmail = async () => {
    if (!selectedReq) return;
    if (!assignedLoginId.trim()) {
      alert('Please provide a valid Login ID for the user.');
      return;
    }
    if (!tempPassword.trim()) {
      alert('Please provide a temporary password.');
      return;
    }

    setIsProcessingAction(true);
    try {
      const res = UserStore.approveRequest(selectedReq.id, assignedLoginId.trim(), tempPassword.trim());
      
      // Attempt backend SMTP dispatch if configured
      try {
        await AdminAPI.sendCredentialsEmail({
          email: selectedReq.email,
          name: selectedReq.fullName,
          user_code: assignedLoginId.trim(),
          temp_password: tempPassword.trim(),
          role: selectedReq.type,
        });
      } catch (smtpErr) {
        console.warn('Backend SMTP offline or credentials not set in backend/.env:', smtpErr);
      }

      if (res.success) {
        setActionSuccess(
          `Success! Access approved for ${selectedReq.fullName}. Login ID (${assignedLoginId.trim()}) and temporary password issued. Check the Dispatched Credentials tab to preview or send directly via Gmail/Outlook!`
        );
        setSelectedReq(null);
        loadRequests();
        loadEmails();
        loadStats();
        loadUsers();
      } else {
        setActionError('Failed to approve access request. Please try again.');
      }
    } catch (err: any) {
      setActionError(err.message || 'Error granting access.');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleRejectRequest = () => {
    if (!selectedReq) return;
    if (!rejectionReason.trim()) {
      alert('Please specify a rejection reason for the applicant.');
      return;
    }

    setIsProcessingAction(true);
    try {
      const ok = UserStore.rejectRequest(selectedReq.id, rejectionReason.trim());
      if (ok) {
        setActionSuccess(`Request rejected for ${selectedReq.fullName}. Reason logged.`);
        setSelectedReq(null);
        loadRequests();
      } else {
        setActionError('Failed to reject request.');
      }
    } catch (err: any) {
      setActionError(err.message || 'Error rejecting request.');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;

  const filteredRequests = requests.filter((r) => {
    if (reqFilterType !== 'ALL' && r.type !== reqFilterType) return false;
    if (reqFilterStatus !== 'ALL' && r.status !== reqFilterStatus) return false;
    return true;
  });

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'INVITED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SUSPENDED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'DEACTIVATED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'GRADUATED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'FACULTY':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'STUDENT':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-blue-800" />
            <span>Institutional User Management & Access Control</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin verification of Student & Faculty access requests, credential issuance, email dispatch, and security policies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs active:scale-95"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admissions</span>
          </Link>

          <Link
            href="/admin/users/faculty"
            className="inline-flex items-center gap-1.5 bg-blue-800 hover:bg-blue-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs active:scale-95"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Faculty Roster</span>
          </Link>

          <Link
            href="/admin/audit-logs"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs border border-slate-200 transition-all shadow-xs"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Audit Logs</span>
          </Link>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold leading-relaxed">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold leading-relaxed">{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-700 hover:text-rose-900 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Total Accounts</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{stats?.total_users ?? '...'}</span>
          <span className="text-[10px] text-slate-500 font-medium">In Institutional DB</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 block">Pending Requests</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{pendingRequestsCount}</span>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting Approval</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 block">Enrolled Students</span>
          <span className="text-2xl font-black text-blue-950 mt-1 block">{stats?.students ?? '...'}</span>
          <span className="text-[10px] text-slate-500 font-medium">Active IDs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 block">Faculty Members</span>
          <span className="text-2xl font-black text-indigo-950 mt-1 block">{stats?.faculty ?? '...'}</span>
          <span className="text-[10px] text-slate-500 font-medium">Teaching Faculty</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 block">Active Status</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{stats?.active_users ?? '...'}</span>
          <span className="text-[10px] text-emerald-600 font-medium">Verified Accounts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-600 block">Emails Dispatched</span>
          <span className="text-2xl font-black text-purple-900 mt-1 block">{dispatchedEmails.length}</span>
          <span className="text-[10px] text-purple-600 font-medium">Credentials Sent</span>
        </div>
      </div>

      {/* Main Tabs Segmented Control */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'requests'
              ? 'text-blue-900 border-b-2 border-blue-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Access Requests & Approvals</span>
          {pendingRequestsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
              {pendingRequestsCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'directory'
              ? 'text-blue-900 border-b-2 border-blue-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Institutional Accounts Directory</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
            {totalCount || users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
            activeTab === 'emails'
              ? 'text-blue-900 border-b-2 border-blue-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Dispatched Credentials Log</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
            {dispatchedEmails.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ACCESS REQUESTS & APPROVALS */}
      {activeTab === 'requests' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Requests Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Filter Requests:</span>
              
              <select
                value={reqFilterType}
                onChange={(e) => setReqFilterType(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-semibold text-slate-700"
              >
                <option value="ALL">All Applicants</option>
                <option value="STUDENT">Students (ID Card No)</option>
                <option value="FACULTY">Faculty (Employee ID)</option>
              </select>

              <select
                value={reqFilterStatus}
                onChange={(e) => setReqFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-semibold text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="APPROVED">Approved & Issued</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-800">{filteredRequests.length}</span> portal requests
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Applicant Name & Role</th>
                    <th className="py-3.5 px-4">College ID / Emp ID</th>
                    <th className="py-3.5 px-4">Phone Number</th>
                    <th className="py-3.5 px-4">Email ID</th>
                    <th className="py-3.5 px-4">Department / Program</th>
                    <th className="py-3.5 px-4">Submitted At</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-600">No requests found matching this filter.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          New student and faculty requests will automatically appear here for Admin review.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{r.fullName}</div>
                          <span
                            className={`inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.type === 'STUDENT'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}
                          >
                            {r.type === 'STUDENT' ? <GraduationCap className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                            {r.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                          {r.type === 'STUDENT' ? (
                            <span title="Student ID Card / Roll No">{r.idCardNumber || 'N/A'}</span>
                          ) : (
                            <span title="Faculty Employee ID">{r.empId || 'N/A'}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {r.mobile}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {r.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{r.department}</div>
                          <div className="text-[11px] text-slate-500">{r.yearOrDesignation}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {new Date(r.submittedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          {r.status === 'PENDING' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              Pending Admin
                            </span>
                          )}
                          {r.status === 'APPROVED' && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Approved & Issued
                            </span>
                          )}
                          {r.status === 'REJECTED' && (
                            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {r.status === 'PENDING' ? (
                            <button
                              onClick={() => handleOpenReviewModal(r)}
                              className="bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                              <span>Review & Issue Login ID</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenReviewModal(r)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>View Details</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE ACCOUNTS DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search registered accounts by Student ID, Employee ID, Name, or Email..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden text-xs bg-slate-50"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:border-blue-600 outline-hidden text-slate-700 font-semibold"
                >
                  <option value="">All Roles</option>
                  <option value="STUDENT">Students</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="ADMIN">Admins</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:border-blue-600 outline-hidden text-slate-700 font-semibold"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INVITED">Invited (Pending)</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>

                <button
                  type="submit"
                  className="bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Filter
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setRoleFilter('');
                    setStatusFilter('');
                    setPage(1);
                    loadUsers();
                  }}
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                  title="Reset Filters"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Login User ID</th>
                    <th className="py-3.5 px-4">Full Name</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Mobile</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Password Policy</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <div className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span>Loading institutional accounts...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        No accounts matching current criteria.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                          {u.user_code}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {u.full_name || u.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getRoleBadge(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {u.department_name || 'Engineering'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {u.mobile || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold ${getStatusBadge(u.status)}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.mustChangePassword ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <KeyRound className="w-3 h-3 text-amber-600" />
                              Must Change on Login
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-medium flex items-center gap-1 w-fit">
                              <Check className="w-3 h-3 text-emerald-600" />
                              Password Updated
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Account Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Total {totalCount || users.length} accounts in directory
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DISPATCHED CREDENTIALS EMAIL LOGS */}
      {activeTab === 'emails' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Automated Email Dispatch Audit Log</p>
              <p className="text-slate-600 mt-0.5">
                Every time the Admin approves a student or faculty access request, the system issues their Login ID, generates a temporary password, and sends an official notification email to their registered address.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Recipient</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Recipient Email</th>
                    <th className="py-3.5 px-4">Issued Login ID</th>
                    <th className="py-3.5 px-4">Dispatched Temporary Password</th>
                    <th className="py-3.5 px-4">Sent Timestamp</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {dispatchedEmails.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-600">No credential emails dispatched yet.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          When you approve requests in the first tab, the generated credentials email records will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    dispatchedEmails.map((em) => (
                      <tr key={em.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {em.recipientName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRoleBadge(em.role)}`}>
                            {em.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {em.to}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                          {em.loginId}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {em.tempPassword}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {em.sentAt}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedEmail(em)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Email</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADMIN REVIEW & ISSUE CREDENTIALS MODAL */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  selectedReq.type === 'STUDENT' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {selectedReq.type === 'STUDENT' ? <GraduationCap className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedReq.status === 'PENDING' ? 'Review & Issue Portal Login Credentials' : 'Access Request Details'}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Request Reference: {selectedReq.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Submitted Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Applicant Submitted Information
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  selectedReq.status === 'PENDING'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : selectedReq.status === 'APPROVED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  Status: {selectedReq.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Applicant Name</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{selectedReq.fullName}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Role Type</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${getRoleBadge(selectedReq.type)}`}>
                    {selectedReq.type}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    {selectedReq.type === 'STUDENT' ? 'Student ID Card / Roll No' : 'Faculty Employee ID'}
                  </span>
                  <span className="font-mono font-bold text-blue-900 mt-0.5 block">
                    {selectedReq.type === 'STUDENT' ? selectedReq.idCardNumber : selectedReq.empId}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Verified Email ID</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedReq.email}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone Number</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedReq.mobile}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Department / Program</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {selectedReq.department} ({selectedReq.yearOrDesignation})
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Configuration Form (When Pending) */}
            {selectedReq.status === 'PENDING' && !showRejectForm && (
              <div className="space-y-4 pt-1">
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200/80 space-y-3">
                  <div className="flex items-center gap-1.5 text-blue-950 font-bold text-xs">
                    <KeyRound className="w-4 h-4 text-blue-800" />
                    <span>Admin Credential Assignment</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Login ID Input */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Assigned Portal Login ID:
                      </label>
                      <input
                        type="text"
                        value={assignedLoginId}
                        onChange={(e) => setAssignedLoginId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-blue-900 text-xs bg-white focus:border-blue-600 outline-hidden"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Used by {selectedReq.type.toLowerCase()} to sign in. Pre-filled from submitted ID.
                      </span>
                    </div>

                    {/* Temporary Password Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Temporary Password:
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateNewPassword}
                          className="text-[10px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Regenerate
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 text-xs bg-white focus:border-blue-600 outline-hidden"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Dispatched in the welcome email.
                      </span>
                    </div>
                  </div>

                  {/* Mandatory Security Notice */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Enforced First-Time Password Reset:</span> Upon signing in with this temporary password, the {selectedReq.type.toLowerCase()} will be immediately forced to create a new secure password before accessing any campus features.
                    </div>
                  </div>
                </div>

                {/* Email Dispatch Live Preview */}
                <div className="space-y-1.5">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block">
                    Automated Email Dispatch Preview (Dispatched to: {selectedReq.email})
                  </span>
                  
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-xs space-y-2 font-mono border border-slate-800">
                    <div className="text-[11px] text-slate-400 pb-2 border-b border-slate-800 flex justify-between">
                      <span><strong>To:</strong> {selectedReq.fullName} &lt;{selectedReq.email}&gt;</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Send className="w-3 h-3" /> Auto-Dispatched on Approval
                      </span>
                    </div>
                    <div className="text-amber-400 font-bold">
                      Subject: Official SREC Portal Login Credentials - Access Approved
                    </div>
                    <div className="text-slate-300 space-y-1.5 pt-1 text-[11px]">
                      <p>Dear {selectedReq.fullName},</p>
                      <p>
                        Your institutional portal access request for Santhiram Engineering College (Autonomous) has been verified and approved by the Administrator.
                      </p>
                      <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 space-y-1 my-2">
                        <div><strong>Portal Access URL:</strong> /login</div>
                        <div><strong>Assigned Login ID:</strong> <span className="text-cyan-400 font-bold">{assignedLoginId}</span></div>
                        <div><strong>Temporary Password:</strong> <span className="text-amber-300 font-bold">{tempPassword}</span></div>
                      </div>
                      <p className="text-rose-300 font-sans text-[10px]">
                        * Security Notice: For your security, you are required to change this temporary password to your own private password immediately upon your first sign in.
                      </p>
                      <p className="text-slate-400 text-[10px]">
                        Warm regards,<br />
                        Central ICT Administration, Santhiram Engineering College, Nandyal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Form view */}
            {selectedReq.status === 'PENDING' && showRejectForm && (
              <div className="space-y-3 pt-2 bg-rose-50/60 p-4 rounded-2xl border border-rose-200 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Reject Access Request</span>
                </div>
                <p className="text-xs text-rose-800">
                  Please provide the reason why this application is being rejected (e.g. invalid ID card number, mismatched email, unverified department records):
                </p>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. ID card number could not be verified in the institutional student records..."
                  className="w-full p-2.5 rounded-xl border border-rose-300 text-xs bg-white text-slate-800 outline-hidden focus:border-rose-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                  >
                    Back to Approval
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectRequest}
                    disabled={isProcessingAction}
                    className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Confirm Rejection</span>
                  </button>
                </div>
              </div>
            )}

            {/* Already Approved Details View */}
            {selectedReq.status === 'APPROVED' && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Credentials Successfully Approved & Dispatched</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] font-sans block">Assigned Portal Login ID:</span>
                    <strong className="text-blue-900">{selectedReq.assignedLoginId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-sans block">Issued Temporary Password:</span>
                    <strong className="text-slate-800">{selectedReq.tempPassword}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800 pt-1">
                  The user can now log in at <Link href="/login" className="underline font-bold">/login</Link> with these credentials, where they will be prompted to set a new password.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
              {selectedReq.status === 'PENDING' && !showRejectForm ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(true)}
                    className="text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reject Request
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReq(null)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleApproveAndSendEmail}
                      disabled={isProcessingAction}
                      className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      {isProcessingAction ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Issuing & Sending Email...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-amber-300" />
                          <span>Approve & Dispatch Login Details via Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedReq(null)}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: PREVIEW DISPATCHED EMAIL RECEIPT */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-800" />
                <h3 className="font-bold text-slate-900 text-sm">Dispatched Email Audit Record</h3>
              </div>
              <button onClick={() => setSelectedEmail(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div><strong>To:</strong> {selectedEmail.recipientName} ({selectedEmail.to})</div>
              <div><strong>Role:</strong> {selectedEmail.role}</div>
              <div><strong>Dispatched At:</strong> {selectedEmail.sentAt}</div>
              <div><strong>Subject:</strong> {selectedEmail.subject}</div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono space-y-2 border border-slate-800">
              <p>Dear {selectedEmail.recipientName},</p>
              <p>Your institutional portal access request for Santhiram Engineering College (Autonomous) has been approved.</p>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1 text-cyan-300">
                <div><strong>Assigned Login ID:</strong> {selectedEmail.loginId}</div>
                <div><strong>Temporary Password:</strong> {selectedEmail.tempPassword}</div>
              </div>
              <p className="text-rose-300 text-[11px] font-sans">
                You are required to change your temporary password to a new private password upon your first sign in.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedEmail.to)}&su=${encodeURIComponent(selectedEmail.subject)}&body=${encodeURIComponent(
                    `Dear ${selectedEmail.recipientName},\n\nYour institutional portal access request for Santhiram Engineering College (Autonomous) has been approved.\n\nPortal Login URL: https://khaja9963.github.io/Santhiram-college/login/\nAssigned Login ID: ${selectedEmail.loginId}\nTemporary Password: ${selectedEmail.tempPassword}\n\n* Security Notice: You are required to change this temporary password to your own private password upon your first sign in.\n\nWarm regards,\nCentral ICT Administration,\nSanthiram Engineering College (Autonomous), Nandyal.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send via Gmail</span>
                </a>

                <a
                  href={`mailto:${encodeURIComponent(selectedEmail.to)}?subject=${encodeURIComponent(selectedEmail.subject)}&body=${encodeURIComponent(
                    `Dear ${selectedEmail.recipientName},\n\nYour institutional portal access request for Santhiram Engineering College (Autonomous) has been approved.\n\nPortal Login URL: https://khaja9963.github.io/Santhiram-college/login/\nAssigned Login ID: ${selectedEmail.loginId}\nTemporary Password: ${selectedEmail.tempPassword}\n\n* Security Notice: You are required to change this temporary password to your own private password upon your first sign in.\n\nWarm regards,\nCentral ICT Administration,\nSanthiram Engineering College (Autonomous), Nandyal.`
                  )}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via Mail App</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const text = `Dear ${selectedEmail.recipientName},\n\nYour institutional portal access request for Santhiram Engineering College (Autonomous) has been approved.\n\nPortal Login URL: https://khaja9963.github.io/Santhiram-college/login/\nAssigned Login ID: ${selectedEmail.loginId}\nTemporary Password: ${selectedEmail.tempPassword}\n\n* Security Notice: You are required to change this temporary password to your own private password upon your first sign in.\n\nWarm regards,\nCentral ICT Administration,\nSanthiram Engineering College (Autonomous), Nandyal.`;
                    navigator.clipboard.writeText(text);
                    alert('Credentials email text copied to clipboard! You can paste it into WhatsApp or email.');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedEmail(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-xl text-xs font-bold ml-auto cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  {selectedUser.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedUser.full_name}</h3>
                  <span className="text-[11px] font-mono text-slate-500">{selectedUser.user_code}</span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Role</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${getStatusBadge(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Email</span>
                  <span className="font-semibold text-slate-800">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mobile</span>
                  <span className="font-semibold text-slate-800">{selectedUser.mobile || 'N/A'}</span>
                </div>
              </div>

              {/* Security policy badge */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {selectedUser.mustChangePassword
                    ? 'Security Flag: User has not yet reset their temporary password.'
                    : 'Security Verified: User has set their private password.'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
