'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, CalendarCheck, BarChart3,
  FileCheck2, BookOpen, Bell, LogOut, Menu, X, GraduationCap, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { assetUrl } from '@/lib/assets';

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role, token, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Faculty Dashboard', href: '/faculty/dashboard', icon: LayoutDashboard },
    { label: 'Faculty Profile', href: '/profile', icon: GraduationCap },
    { label: 'Students Roster', href: '/faculty/students', icon: Users },
    { label: 'Mark Attendance', href: '/faculty/attendance', icon: CalendarCheck },
    { label: 'All Candidates', href: '/faculty/candidates', icon: Users },
    { label: 'Upload Marks', href: '/faculty/marks', icon: BarChart3 },
    { label: 'Create Assignment', href: '/faculty/assignments', icon: FileCheck2 },
    { label: 'Security & Password', href: '/settings/security', icon: ShieldCheck },
  ];

  // Standalone login route for faculty
  if (pathname?.startsWith('/faculty/login')) {
    return <>{children}</>;
  }

  if (!isLoading && (!token || (role !== 'FACULTY' && role !== 'ADMIN'))) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Faculty Portal Authentication Required</h2>
          <p className="text-xs text-slate-600">
            Please sign in with your verified faculty credentials (e.g. SREC-FAC-0104) to access faculty tools.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/faculty/login"
              className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Sign In as Faculty
            </Link>
            <Link
              href="/"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100/70">
      {/* Mobile toggle */}
      <div className="lg:hidden fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-[#0B2545] text-white p-3 rounded-full shadow-xl flex items-center justify-center"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Faculty Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0B2545] text-slate-300 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-5">
          {/* SREC Official Branding */}
          <Link href="/" className="flex items-center gap-3 px-2 py-1 group">
            <div className="w-9 h-10 flex-shrink-0 group-hover:scale-105 transition-transform">
              <img
                src={assetUrl('/images/srec_logo.png')}
                alt="SREC Official Crest"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <div className="text-xs font-black text-white tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
                SANTHIRAM ENGG. COLLEGE
              </div>
              <div className="text-[9px] font-bold text-amber-400/90 tracking-wider">
                FACULTY PORTAL
              </div>
            </div>
          </Link>

          {/* Profile snippet */}
          <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
              KSR
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-white text-xs truncate">Dr. K. Subba Reddy</div>
              <div className="text-[10px] text-amber-400 font-mono">HOD &bull; Computer Science</div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="block text-center text-xs text-slate-400 hover:text-white py-1.5"
          >
            &larr; Back to Public College Site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
