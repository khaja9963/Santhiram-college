'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, UserPlus, Shield, GraduationCap, Briefcase, Search,
  Filter, CheckCircle2, AlertTriangle, RefreshCw, Send, KeyRound,
  Eye, MoreVertical, X, Check, Lock, ChevronLeft, ChevronRight,
  Clock, ShieldAlert, History
} from 'lucide-react';
import { AdminAPI } from '@/lib/api';

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
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Action States
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [recoveryTokenNotice, setRecoveryTokenNotice] = useState<{ userCode: string; token: string } | null>(null);

  useEffect(() => {
    loadStats();
    loadUsers();
  }, [page, roleFilter, statusFilter]);

  const loadStats = async () => {
    try {
      const s = await AdminAPI.getUserStats();
      setStats(s);
    } catch (e) {
      console.warn('Failed to load user stats:', e);
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
      setUsers(res.users || []);
      setTotalPages(res.total_pages || 1);
      setTotalCount(res.total || 0);
    } catch (err: any) {
      setActionError(err.message || 'Failed to load user records.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to change this user status to ${newStatus}?`)) return;
    setIsProcessingAction(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      await AdminAPI.updateUserStatus(userId, newStatus);
      setActionSuccess(`User status updated to ${newStatus}.`);
      await loadStats();
      await loadUsers();
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to change user status.');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleResendActivation = async (userId: string) => {
    setIsProcessingAction(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const res = await AdminAPI.resendActivation(userId);
      setActionSuccess('New activation link generated and dispatched to registered email.');
      if (res.dev_activation_token) {
        setRecoveryTokenNotice({
          userCode: selectedUser?.user_code || 'User',
          token: res.dev_activation_token,
        });
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to resend activation link.');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleResetAccount = async (userId: string) => {
    if (
      !confirm(
        'Are you sure you want to initiate account recovery? This revokes prior tokens and issues a fresh activation link for the user.'
      )
    )
      return;

    setIsProcessingAction(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const res = await AdminAPI.resetAccount(userId);
      setActionSuccess('Account reset initiated. Secure recovery link sent to user.');
      if (res.dev_recovery_token) {
        setRecoveryTokenNotice({
          userCode: selectedUser?.user_code || 'User',
          token: res.dev_recovery_token,
        });
      }
      await loadStats();
      await loadUsers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to reset account.');
    } finally {
      setIsProcessingAction(false);
    }
  };

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
        return 'bg-purple-100 text-purple-800';
      case 'FACULTY':
        return 'bg-indigo-100 text-indigo-800';
      case 'STUDENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-800" />
            <span>Institutional User Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin-controlled account directory, enrollment, credentials lifecycle, and security controls
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/users/students"
            className="inline-flex items-center gap-1.5 bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </Link>

          <Link
            href="/admin/users/faculty"
            className="inline-flex items-center gap-1.5 bg-blue-800 hover:bg-blue-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs active:scale-95"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Add Faculty</span>
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
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-700 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dev Token Notification Box */}
      {recoveryTokenNotice && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1.5 animate-in fade-in">
          <div className="flex items-center justify-between text-amber-900 font-bold">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Generated Secure Activation / Recovery Token for {recoveryTokenNotice.userCode}:</span>
            </span>
            <button onClick={() => setRecoveryTokenNotice(null)} className="text-amber-800">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="font-mono bg-white p-2 rounded-lg border border-amber-200 text-blue-900 font-bold select-all">
            {recoveryTokenNotice.token}
          </p>
          <p className="text-[11px] text-amber-800">
            Link:{' '}
            <Link
              href={`/activate-account?token=${recoveryTokenNotice.token}`}
              target="_blank"
              className="text-blue-700 underline font-semibold"
            >
              /activate-account?token={recoveryTokenNotice.token}
            </Link>
          </p>
        </div>
      )}

      {/* USER MANAGEMENT KPI WIDGET (Section 27: Students, Faculty, Pending Activation, Suspended) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Total Users</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{stats?.total_users ?? '...'}</span>
          <span className="text-[10px] text-slate-500 font-medium">Enrolled</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 block">Students</span>
          <span className="text-2xl font-black text-blue-950 mt-1 block">{stats?.students ?? '...'}</span>
          <span className="text-[10px] text-slate-500 font-medium">B.Tech / MBA</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 block">Faculty</span>
          <span className="text-2xl font-black text-indigo-950 mt-1 block">{stats?.faculty ?? '...'}</span>
          <span className="text-[10px] text-slate-500 font-medium">Professors</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-600 block">Admins</span>
          <span className="text-2xl font-black text-purple-950 mt-1 block">{stats?.admins ?? '...'}</span>
          <span className="text-[10px] text-slate-500 font-medium">System Root</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 block">Active Users</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{stats?.active_users ?? '...'}</span>
          <span className="text-[10px] text-emerald-600 font-medium">Verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 block">Pending Activation</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{stats?.invited_users ?? '...'}</span>
          <span className="text-[10px] text-amber-600 font-medium">Status: INVITED</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-600 block">Suspended</span>
          <span className="text-2xl font-black text-rose-700 mt-1 block">{stats?.suspended_users ?? '...'}</span>
          <span className="text-[10px] text-rose-600 font-medium">Restricted</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Student ID, Employee ID, Name, or Email..."
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
              <option value="DEACTIVATED">Deactivated</option>
              <option value="GRADUATED">Graduated</option>
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
              }}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">User / ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading institutional user directory...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No accounts matching current criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      {u.user_code || u.id.slice(0, 8)}
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
                      {u.department_name || 'CSE'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold ${getStatusBadge(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Status change actions */}
                        {u.status === 'INVITED' && (
                          <button
                            onClick={() => handleResendActivation(u.id)}
                            disabled={isProcessingAction}
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Resend Activation Link"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}

                        {u.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleStatusChange(u.id, 'SUSPENDED')}
                            disabled={isProcessingAction}
                            className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Suspend User"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}

                        {u.status === 'SUSPENDED' && (
                          <button
                            onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                            disabled={isProcessingAction}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Re-activate User"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleResetAccount(u.id)}
                          disabled={isProcessingAction}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Reset Account (Recovery)"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                      </div>
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
            Showing page {page} of {totalPages} ({totalCount} total accounts)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-700">{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isLoading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal (View User - Never showing passwords) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in zoom-in-95">
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

              {selectedUser.role === 'STUDENT' && selectedUser.student_details && (
                <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block">Student Academic Profile</span>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700">
                    <div>Year / Sem: Year {selectedUser.student_details.year}, Sem {selectedUser.student_details.semester}</div>
                    <div>Section: {selectedUser.student_details.section}</div>
                    <div>Admission Year: {selectedUser.student_details.admission_year}</div>
                    <div>Roll Number: {selectedUser.student_details.roll_number}</div>
                  </div>
                </div>
              )}

              {selectedUser.role === 'FACULTY' && selectedUser.faculty_details && (
                <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-wider block">Faculty Profile</span>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700">
                    <div>Designation: {selectedUser.faculty_details.designation}</div>
                    <div>Joining Year: {selectedUser.faculty_details.joining_year}</div>
                  </div>
                </div>
              )}

              {/* Security Safeguard Notice (Section 12: Admin must NEVER view password) */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Password hashes are cryptographically protected and irretrievable per SREC security policy.</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 justify-end border-t border-slate-100">
              {selectedUser.status === 'INVITED' && (
                <button
                  onClick={() => handleResendActivation(selectedUser.id)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Resend Activation Link</span>
                </button>
              )}

              {selectedUser.status === 'ACTIVE' && (
                <button
                  onClick={() => handleStatusChange(selectedUser.id, 'SUSPENDED')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Suspend User</span>
                </button>
              )}

              {selectedUser.status === 'SUSPENDED' && (
                <button
                  onClick={() => handleStatusChange(selectedUser.id, 'ACTIVE')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Activate User</span>
                </button>
              )}

              <button
                onClick={() => handleResetAccount(selectedUser.id)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Reset Account</span>
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs"
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
