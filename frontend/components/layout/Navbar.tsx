'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search, User as UserIcon, Menu, X, ChevronDown,
  GraduationCap, BookOpen, Building2, PhoneCall, Award,
  Sparkles, ExternalLink, Lock, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { assetUrl } from '@/lib/assets';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAI: () => void;
}

export default function Navbar({ onOpenSearch, onOpenAI }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [academicsDropdown, setAcademicsDropdown] = useState(false);
  const [deptDropdown, setDeptDropdown] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  const isPortal = pathname?.startsWith('/student') || pathname?.startsWith('/faculty') || pathname?.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* Main Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & College Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-13 flex-shrink-0 group-hover:scale-105 transition-transform">
              <img
                src={assetUrl('/images/srec_logo.png')}
                alt="Santhiram Engineering College Official Crest"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-[#0B2545] leading-tight group-hover:text-blue-700 transition-colors">
                SANTHIRAM ENGINEERING COLLEGE
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wider">
                AUTONOMOUS &bull; NANDYAL &bull; AFFILIATED TO JNTUA
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 font-medium text-sm text-slate-700">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-blue-900 ${
                pathname === '/' ? 'text-blue-700 font-bold bg-blue-50' : ''
              }`}
            >
              Home
            </Link>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdown(true)}
              onMouseLeave={() => setAboutDropdown(false)}
            >
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-900">
                About Us <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {aboutDropdown && (
                <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-1">
                  <Link href="/about" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    About SREC & History
                  </Link>
                  <Link href="/about#vision-mission" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Vision & Mission
                  </Link>
                  <Link href="/about#leadership" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Chairman & Principal
                  </Link>
                  <Link href="/about#accreditations" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    NAAC & NBA Accreditations
                  </Link>
                </div>
              )}
            </div>

            {/* Academics Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAcademicsDropdown(true)}
              onMouseLeave={() => setAcademicsDropdown(false)}
            >
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-900">
                Academics <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {academicsDropdown && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-1">
                  <Link href="/academics" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Undergraduate & PG Programs
                  </Link>
                  <Link href="/academics#regulations" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Autonomous Regulations (R23)
                  </Link>
                  <Link href="/academics#curriculum" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Curriculum & Syllabi
                  </Link>
                  <Link href="/academics#examination" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Examination Cell
                  </Link>
                </div>
              )}
            </div>

            {/* Departments Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDeptDropdown(true)}
              onMouseLeave={() => setDeptDropdown(false)}
            >
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-900">
                Departments <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {deptDropdown && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-1">
                  <Link href="/departments/cse" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Computer Science & Engg (CSE)
                  </Link>
                  <Link href="/departments/csm" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    CSE (AI & Machine Learning)
                  </Link>
                  <Link href="/departments/csd" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    CSE (Data Science)
                  </Link>
                  <Link href="/departments/ece" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Electronics & Comm. Engg (ECE)
                  </Link>
                  <Link href="/departments/eee" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Electrical & Electronics (EEE)
                  </Link>
                  <Link href="/departments/mba" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Master of Business Admin (MBA)
                  </Link>
                  <Link href="/departments/mca" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-800 text-xs">
                    Master of Computer Apps (MCA)
                  </Link>
                </div>
              )}
            </div>

            <Link href="/admissions" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-900">
              Admissions
            </Link>
            <Link href="/placements" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-900">
              Placements
            </Link>
            <Link href="/events" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-900">
              Events
            </Link>
            <Link href="/contact" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-900">
              Contact
            </Link>
          </div>

          {/* Action Buttons: Ctrl+K, SREC AI Drawer, Portal Login */}
          <div className="flex items-center gap-2">
            {/* Quick Search Ctrl + K */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
              title="Search Campus (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block bg-white px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-mono border border-slate-200 shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* Portal Access */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={
                    user.role === 'STUDENT'
                      ? '/student/dashboard'
                      : user.role === 'FACULTY'
                      ? '/faculty/dashboard'
                      : '/admin/dashboard'
                  }
                  className="flex items-center gap-1.5 bg-[#0B2545] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-900 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">{user.full_name.split(' ')[0]}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded">
                    {user.role}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-red-600 px-1 py-1 font-semibold"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-[#0B2545] hover:bg-[#134074] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all border border-blue-800/50 hover:shadow"
                title="Student, Faculty & Staff Portal Sign In"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Student / Faculty Login</span>
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-slate-200 space-y-2 pb-3 text-sm font-medium text-slate-700">
            {/* Mobile Quick Login CTA */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Campus Portals Access
              </div>
              {user ? (
                <div className="space-y-2">
                  <Link
                    href={
                      user.role === 'STUDENT'
                        ? '/student/dashboard'
                        : user.role === 'FACULTY'
                        ? '/faculty/dashboard'
                        : '/admin/dashboard'
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between bg-[#0B2545] text-white px-3.5 py-2.5 rounded-lg text-xs font-bold shadow-xs"
                  >
                    <span>Go to {user.role} Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-xs text-red-600 font-semibold px-2 py-1"
                  >
                    Sign Out ({user.email})
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#0B2545] hover:bg-[#134074] text-white px-3.5 py-2.5 rounded-lg text-xs font-bold shadow-xs"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Student &amp; Faculty Login</span>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login?role=student"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-semibold py-1.5 rounded-md border border-slate-200"
                    >
                      Student Sign In
                    </Link>
                    <Link
                      href="/login?role=faculty"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-semibold py-1.5 rounded-md border border-slate-200"
                    >
                      Faculty Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
            >
              About SREC
            </Link>
            <Link
              href="/academics"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Academics &amp; Regulations
            </Link>
            <Link
              href="/departments/cse"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Departments
            </Link>
            <Link
              href="/admissions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Admissions 2026
            </Link>
            <Link
              href="/placements"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Placements
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Events &amp; Circulars
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Contact Us
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
