'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, User, CalendarCheck, BarChart3, Clock,
  FileCheck2, GraduationCap, Award, CreditCard, FileText,
  Bell, BookOpen, Briefcase, LogOut, Menu, X, Bot, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { assetUrl } from '@/lib/assets';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role, token, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', href: '/profile', icon: User },
    { label: 'Attendance', href: '/student/attendance', icon: CalendarCheck },
    { label: 'Marks & Grades', href: '/student/marks', icon: BarChart3 },
    { label: 'Timetable', href: '/student/timetable', icon: Clock },
    { label: 'Assignments', href: '/student/assignments', icon: FileCheck2 },
    { label: 'Semester Results', href: '/student/results', icon: Award },
    { label: 'Fee Status', href: '/student/fees', icon: CreditCard },
    { label: 'AI Study Assistant', href: '/student/ai-study', icon: BookOpen, badge: 'AI' },
    { label: 'AI Placement & Mock', href: '/student/ai-placement', icon: Briefcase, badge: 'AI' },
    { label: 'Security & Password', href: '/settings/security', icon: ShieldCheck },
  ];

  // Standalone login route for students
  if (pathname === '/student/login') {
    return <>{children}</>;
  }

  if (!isLoading && (!token || (role !== 'STUDENT' && role !== 'ADMIN'))) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Student Portal Authentication Required</h2>
          <p className="text-xs text-slate-600">
            Please sign in with your active student credentials (e.g. 22X51A0501) to access your academic dashboard.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/student/login"
              className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Sign In as Student
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
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-[#0B2545] text-white p-3 rounded-full shadow-xl flex items-center justify-center"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
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
                STUDENT PORTAL
              </div>
            </div>
          </Link>

          {/* Student Profile Snippet */}
          <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
              ST
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-white text-xs truncate">Sai Teja Reddy</div>
              <div className="text-[10px] text-amber-400 font-mono">22X51A0501 &bull; CSE</div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
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

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
