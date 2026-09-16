'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap, ArrowRight, Bot, Sparkles, Award,
  Users, BookOpen, Briefcase, Building, ShieldCheck,
  CheckCircle2, Compass, ChevronRight, Calendar, Bell,
  Maximize2, X, Star, Lock
} from 'lucide-react';
import { CollegeAPI } from '@/lib/api';

export default function HomePage() {
  const [stats, setStats] = useState({
    students: 3650,
    faculty: 245,
    programs: 14,
    placements_percentage: 87.5,
    departments_count: 7,
    alumni: 14500,
  });
  const [news, setNews] = useState<any[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    CollegeAPI.getStats()
      .then((data) => setStats(data))
      .catch(() => {});
    CollegeAPI.getNews()
      .then((data) => setNews(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-[#0B2545] to-slate-900 text-white pt-12 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient backdrops */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-16 flex-shrink-0 filter drop-shadow-md">
                <img
                  src="/images/srec_logo.png"
                  alt="Santhiram Engineering College Official Crest"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-700/60 text-amber-300 text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Autonomous &bull; NAAC &lsquo;A&rsquo; Grade &bull; NBA Accredited</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Santhiram <br />
                <span className="text-gradient-gold">Engineering College</span>
              </h1>
              <p className="text-base sm:text-xl font-medium text-slate-300 max-w-2xl leading-relaxed">
                Empowering Innovation, Engineering Excellence & Future Leaders
              </p>
            </div>

            <p className="text-sm text-slate-300/90 max-w-xl leading-relaxed">
              Established in 2007 on NH-40, Nandyal. SREC combines industry-aligned autonomous curriculum, state-of-the-art AI & computing laboratories, premier faculty mentorship, and a vibrant placement ecosystem.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/admissions"
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-2 text-sm"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="bg-blue-900/60 hover:bg-blue-800/80 text-amber-300 font-bold px-5 py-3.5 rounded-xl border border-amber-400/40 backdrop-blur-sm transition-all hover:scale-105 flex items-center gap-2 text-sm shadow-md"
                title="Student and Faculty Portal Login"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Student / Faculty Login</span>
              </Link>

              <Link
                href="/academics"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3.5 rounded-xl border border-white/20 backdrop-blur-sm transition-all hover:scale-105 flex items-center gap-2 text-sm"
              >
                <span>Explore Programs</span>
                <Compass className="w-4 h-4" />
              </Link>
            </div>

            {/* Key Accreditations Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Affiliated to JNTUA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AICTE Approved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>EAPCET Code: <b>SREC</b></span>
              </div>
            </div>
          </div>

          {/* Right Visual Column — SREC Real Campus Showcase */}
          <div className="lg:col-span-6 relative">
            {/* Ambient Multi-Hue Aura Glow */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-amber-500/30 via-sky-500/25 to-emerald-500/30 rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition duration-700 pointer-events-none" />

            {/* Main Campus Card with Shimmer Border */}
            <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-amber-400/50 via-blue-500/30 to-emerald-400/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] group">
              <div className="relative rounded-[22px] overflow-hidden bg-slate-950">
                {/* Top-left Badge */}
                <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-[11px] tracking-wide">Official SREC Campus View &bull; NH-40</span>
                </div>

                {/* Top-right Lightbox expand button */}
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="absolute top-4 right-4 z-20 bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-white/25 text-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 group/btn"
                  title="Click to Expand Full-Screen Photo"
                >
                  <Maximize2 className="w-4 h-4 text-amber-300 group-hover/btn:rotate-12 transition-transform" />
                </button>

                {/* Campus Image Render with Smooth Transition */}
                <div
                  className="relative cursor-pointer overflow-hidden"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <img
                    src="/images/campus_hero.jpg"
                    alt="Santhiram Engineering College Iconic Quadrangle Campus, Nandyal"
                    className="w-full h-[380px] sm:h-[450px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay & High-Contrast Typography */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent flex flex-col justify-end p-6 sm:p-7 space-y-1.5 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded shadow-sm tracking-wider">
                        Iconic Quadrangle Architecture
                      </span>
                      <span className="text-amber-300 text-xs font-bold drop-shadow-sm">
                        Estd. 2007 &bull; Autonomous
                      </span>
                    </div>

                    <div className="text-white font-black text-xl sm:text-2xl tracking-tight leading-snug drop-shadow-md">
                      Santhiram Engineering College
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed max-w-md drop-shadow">
                      Grand 4-tier collegiate quadrangle with arcaded colonnades, heritage roof domes, and lush palm courtyard along NH-40, Nandyal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* High-Resolution Campus Image Modal Lightbox */}
        {isImageModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
            onClick={() => setIsImageModalOpen(false)}
          >
            <div
              className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="bg-slate-950/80 hover:bg-slate-900 text-white p-2.5 rounded-full border border-white/20 transition-transform hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <img
                src="/images/campus_hero.jpg"
                alt="Santhiram Engineering College High-Resolution Campus Showcase"
                className="w-full max-h-[75vh] object-contain bg-slate-950"
              />

              <div className="p-5 sm:p-6 bg-slate-900 border-t border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-base text-amber-400 flex items-center gap-2">
                    <span>Santhiram Engineering College (Autonomous), Nandyal</span>
                    <span className="text-[11px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                      Code: SREC
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Iconic four-tier academic quadrangle featuring arched colonnades, classical roof cupolas, lush palm courtyard, and serene green gardens situated on NH-40, Nerawada, Nandyal.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-blue-950">
              {stats.students.toLocaleString()}+
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Students</div>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {stats.faculty}+
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Faculty Mentors</div>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-blue-950">
              {stats.programs}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">UG & PG Programs</div>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {stats.placements_percentage}%
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Placement Record</div>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-blue-950">
              12.5 <span className="text-sm font-bold text-slate-500">LPA</span>
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Highest Package</div>
          </div>

          <div className="space-y-1 border-l border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-blue-950">
              {stats.alumni.toLocaleString()}+
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Global Alumni</div>
          </div>
        </div>
      </section>

      {/* 2.5 CAMPUS PORTALS (STUDENT & FACULTY LOGIN ACCESS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#0B2545] to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Digital Campus</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                SREC Smart Campus Portals
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Direct login portals for Students, Faculty Mentors, and Administrative Staff.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md self-start md:self-auto hover:scale-105"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Go to Login Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 relative z-10">
            {/* Student Portal Card */}
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      Student Portal
                    </h3>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">STUDENT</span>
                  </div>
                  <p className="text-xs text-slate-300/80 mt-1.5 leading-relaxed">
                    Access real-time attendance, internal marks, autonomous exam timetables, semester results, and 24/7 AI study assistant.
                  </p>
                </div>
              </div>
              <Link
                href="/login?role=student"
                className="mt-5 inline-flex items-center justify-between w-full bg-blue-600/40 hover:bg-blue-600/70 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-blue-500/40 transition-all hover:translate-x-0.5"
              >
                <span>Student Login &rarr;</span>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </div>

            {/* Faculty Portal Card */}
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      Faculty Portal
                    </h3>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">FACULTY</span>
                  </div>
                  <p className="text-xs text-slate-300/80 mt-1.5 leading-relaxed">
                    Student attendance entry, mid-term marks evaluation, curriculum syllabus tracking, leave applications &amp; research records.
                  </p>
                </div>
              </div>
              <Link
                href="/login?role=faculty"
                className="mt-5 inline-flex items-center justify-between w-full bg-purple-600/40 hover:bg-purple-600/70 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-purple-500/40 transition-all hover:translate-x-0.5"
              >
                <span>Faculty Login &rarr;</span>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </div>

            {/* Admin & Exam Cell Card */}
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      Admin &amp; Examination Cell
                    </h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">ADMIN</span>
                  </div>
                  <p className="text-xs text-slate-300/80 mt-1.5 leading-relaxed">
                    Autonomous regulations, student/faculty account provisioning, audit logging, JNTUA compliance &amp; system settings.
                  </p>
                </div>
              </div>
              <Link
                href="/login?role=admin"
                className="mt-5 inline-flex items-center justify-between w-full bg-emerald-600/40 hover:bg-emerald-600/70 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-500/40 transition-all hover:translate-x-0.5"
              >
                <span>Admin Login &rarr;</span>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEPARTMENTS DIRECTORY HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Academic Disciplines</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">
              Featured Engineering & Technology Departments
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Curricula aligned with modern industry demands, AI research, and autonomous engineering regulations.
            </p>
          </div>
          <Link
            href="/academics"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <span>View All Academic Programs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CSE */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover-lift flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
                CSE
              </div>
              <h3 className="text-lg font-bold text-slate-900">Computer Science & Engineering</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                NBA accredited flagship department with 180 seats. Advanced laboratories in AI, Cloud Computing, and Software Engineering.
              </p>
              <div className="text-xs font-medium text-slate-500">
                <b>HOD:</b> Dr. K. Subba Reddy &bull; 8 Labs
              </div>
            </div>
            <Link
              href="/departments/cse"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              <span>Explore CSE Department</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* CSM AI & ML */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover-lift flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
                CSM
              </div>
              <h3 className="text-lg font-bold text-slate-900">CSE (Artificial Intelligence & ML)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialized in Deep Learning, Computer Vision, Generative AI, and Autonomous Systems with dedicated GPU workstations.
              </p>
              <div className="text-xs font-medium text-slate-500">
                <b>Intake:</b> 120 Seats &bull; 5 Labs
              </div>
            </div>
            <Link
              href="/departments/csm"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900"
            >
              <span>Explore AI & ML Department</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* CSD Data Science */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover-lift flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                CSD
              </div>
              <h3 className="text-lg font-bold text-slate-900">CSE (Data Science)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Big Data engineering, predictive analytics, statistical learning, and business intelligence architectures.
              </p>
              <div className="text-xs font-medium text-slate-500">
                <b>Intake:</b> 60 Seats &bull; 4 Labs
              </div>
            </div>
            <Link
              href="/departments/csd"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              <span>Explore Data Science</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ECE */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover-lift flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                ECE
              </div>
              <h3 className="text-lg font-bold text-slate-900">Electronics & Communication Engg</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                NBA accredited with Cadence VLSI tools, Texas Instruments Embedded systems, and IoT innovation laboratories.
              </p>
              <div className="text-xs font-medium text-slate-500">
                <b>HOD:</b> Dr. G. Ramesh &bull; 7 Labs
              </div>
            </div>
            <Link
              href="/departments/ece"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900"
            >
              <span>Explore ECE Department</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* EEE */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover-lift flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-black text-sm">
                EEE
              </div>
              <h3 className="text-lg font-bold text-slate-900">Electrical & Electronics Engg</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modern power electronics, solar-grid dynamics, electric vehicle traction drives, and automation labs.
              </p>
              <div className="text-xs font-medium text-slate-500">
                <b>HOD:</b> Dr. M. Suresh &bull; 6 Labs
              </div>
            </div>
            <Link
              href="/departments/eee"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900"
            >
              <span>Explore EEE Department</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* MBA / MCA */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm card-hover-lift flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-sm">
                PG
              </div>
              <h3 className="text-lg font-bold text-slate-900">Postgraduate Programs (MBA & MCA)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Premier management and master of computer applications fostering executive leadership and cloud software architectures.
              </p>
              <div className="text-xs font-medium text-slate-500">
                <b>Intake:</b> MBA (120) &bull; MCA (60)
              </div>
            </div>
            <Link
              href="/academics#pg"
              className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900"
            >
              <span>Explore PG Programs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. RECRUITERS & PLACEMENT ECOSYSTEM */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Career Acceleration</span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Top Tier-1 Recruiters & Placement Partners
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Rigorous industry training in Data Structures, Full-Stack, and Soft Skills starting right from second year.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {['Tata Consultancy Services', 'Infosys Technologies', 'Wipro Technologies', 'Capgemini', 'Tech Mahindra', 'Hexaware'].map((company, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <div className="font-bold text-sm text-slate-200">{company}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/placements"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md"
            >
              View Full Placement Statistics & Recruiter Reports
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CAMPUS LABS & INFRASTRUCTURE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">World-Class Infrastructure</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">
              Innovation Labs, Central Digital Library & 40-Acre Campus
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Equipped with high-performance computing centers, dedicated robotics workstations, Cadence VLSI design software, and the Dr. B.R. Ambedkar Central Library housing 45,000+ volumes and IEEE digital journals.
            </p>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>AI & Deep Learning workstation cluster for student research</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Separate secured residential hostels for boys & girls with Wi-Fi & RO water</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Adjacent Santhiram Medical College & General Hospital ensuring 24/7 healthcare</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/campus-life"
                className="inline-flex items-center gap-2 bg-[#0B2545] hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
              >
                <span>Explore Campus Life & Facilities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group relative bg-slate-900">
              <img
                src="/images/campus_hero.jpg"
                alt="SREC Quadrangle Campus Architecture"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Campus Quadrangle</span>
                <span className="text-xs font-bold leading-tight">Iconic 4-Tier Collegiate Architecture & Palms</span>
                <span className="text-[11px] text-slate-300">40+ Acre NH-40 Eco-Campus</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group relative bg-slate-900">
              <img
                src="/images/computing_lab.jpg"
                alt="SREC Advanced Computing & AI Laboratory"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Ramanujan Lab Complex</span>
                <span className="text-xs font-bold leading-tight">1000+ Workstations & GPU Cluster</span>
                <span className="text-[11px] text-slate-300">AI, IoT & Robotics Suites</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Begin Your Engineering Journey at SREC
            </h2>
            <p className="text-sm text-slate-300">
              Admissions open for AP EAPCET / ECET & Management Quota. Join an autonomous community of engineers shaping the future.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link
              href="/admissions"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 text-sm"
            >
              Admissions Information
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 backdrop-blur-sm transition-transform hover:scale-105 text-sm"
            >
              Visit Campus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
