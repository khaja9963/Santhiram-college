'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History, ArrowLeft, Search, Filter, RefreshCw,
  Shield, CheckCircle2, AlertTriangle, KeyRound, UserCheck,
  UserX, LogIn, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { AdminAPI } from '@/lib/api';

interface AuditLogEntry {
  id: string;
  user_id?: string;
  user_name?: string;
  user_code?: string;
  user_role?: string;
  action: string;
  ip_address?: string;
  user_agent?: string;
  details?: string;
  created_at?: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadLogs();
  }, [page, actionFilter, roleFilter]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const res = await AdminAPI.getAuditLogs({
        action: actionFilter || undefined,
        role: roleFilter || undefined,
        page,
        limit: 15,
      });
      setLogs(res.logs || []);
      setTotalPages(res.total_pages || 1);
      setTotalCount(res.total || 0);
    } catch (e) {
      console.warn('Failed to load audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes('SUCCESS') || action.includes('ACTIVATED')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (action.includes('FAILED') || action.includes('SUSPENDED') || action.includes('LOCKED')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (action.includes('SENT') || action.includes('CREATED')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (action.includes('RESET') || action.includes('PASSWORD')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/users"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <History className="w-6 h-6 text-blue-800" />
              <span>Security & Audit Event Logs</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 ml-6">
            Institutional ledger of logins, account creation, activation, credential changes, and admin actions
          </p>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs border border-slate-200 transition-all shadow-xs"
        >
          <span>Return to User Management</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-semibold text-slate-700"
          >
            <option value="">All Security Actions</option>
            <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
            <option value="LOGIN_FAILED">LOGIN_FAILED</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="ACCOUNT_CREATED">ACCOUNT_CREATED</option>
            <option value="ACCOUNT_ACTIVATED">ACCOUNT_ACTIVATED</option>
            <option value="ACCOUNT_SUSPENDED">ACCOUNT_SUSPENDED</option>
            <option value="PASSWORD_CHANGED">PASSWORD_CHANGED</option>
            <option value="PASSWORD_RESET">PASSWORD_RESET</option>
            <option value="ACTIVATION_LINK_SENT">ACTIVATION_LINK_SENT</option>
            <option value="RESET_LINK_SENT">RESET_LINK_SENT</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-semibold text-slate-700"
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admins</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setActionFilter('');
              setRoleFilter('');
              setPage(1);
            }}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {totalCount} Total Recorded Audit Events
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Subject User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-sans">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading institutional audit trail...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-sans">
                    No audit records found matching current filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold font-sans ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-sans font-semibold">
                      {log.user_name || 'Anonymous'}{' '}
                      {log.user_code && <span className="text-blue-800 font-mono text-[10px]">({log.user_code})</span>}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      {log.user_role ? (
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {log.user_role}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">SYSTEM</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-sans max-w-xs truncate" title={log.details || ''}>
                      {log.details || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
          <span>
            Page {page} of {totalPages}
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

    </div>
  );
}
