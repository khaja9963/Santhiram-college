import React from 'react';
import Link from 'next/link';
import {
  BookOpen, Award, GraduationCap, Calendar, FileText,
  CheckCircle2, Clock, Download, ArrowRight
} from 'lucide-react';

export const metadata = {
  title: 'Academics & Regulations | Santhiram Engineering College, Nandyal',
  description: 'Undergraduate and Postgraduate programs, Autonomous R23 Regulations, Choice Based Credit System (CBCS), and Examination Cell at SREC Nandyal.',
};

export default function AcademicsPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full">
            Autonomous Academic Excellence &bull; UGC & JNTUA
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Academic Programs & Regulations
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            Empowering students through contemporary industry-aligned syllabi, Choice Based Credit System (CBCS), and rigorous practical laboratory training.
          </p>
        </div>
      </section>

      {/* 1. Undergraduate Programs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Bachelor of Technology (B.Tech)</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">Undergraduate Programs (4-Year)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { code: 'CSE', name: 'Computer Science & Engineering', intake: 180, accredited: 'NBA Accredited', link: '/departments/cse' },
            { code: 'CSM', name: 'CSE (Artificial Intelligence & Machine Learning)', intake: 120, accredited: 'AICTE Approved', link: '/departments/csm' },
            { code: 'CSD', name: 'CSE (Data Science)', intake: 60, accredited: 'AICTE Approved', link: '/departments/csd' },
            { code: 'ECE', name: 'Electronics & Communication Engineering', intake: 120, accredited: 'NBA Accredited', link: '/departments/ece' },
            { code: 'EEE', name: 'Electrical & Electronics Engineering', intake: 60, accredited: 'AICTE Approved', link: '/departments/eee' },
            { code: 'CSG', name: 'Computer Science & Design', intake: 60, accredited: 'AICTE Approved', link: '/departments/cse' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 px-2.5 py-1 rounded-md">
                    {item.code}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {item.accredited}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                <div className="text-xs text-slate-500">Approved Annual Intake: <b>{item.intake} Seats</b></div>
              </div>
              <Link
                href={item.link}
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
              >
                <span>View Syllabus & Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Postgraduate Programs */}
      <section id="pg" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Postgraduate Degrees</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">Postgraduate Programs (M.Tech, MBA, MCA)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <span className="font-mono text-xs font-bold bg-purple-100 text-purple-900 px-2.5 py-1 rounded-md">
              M.Tech
            </span>
            <h3 className="font-bold text-slate-900 text-base">Master of Technology (2-Year)</h3>
            <p className="text-xs text-slate-600">
              Specializations in VLSI System Design, Embedded Systems, and Computer Science & Engineering.
            </p>
            <div className="text-xs text-slate-500">Eligibility: GATE / AP PGECET Rank</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
              MBA
            </span>
            <h3 className="font-bold text-slate-900 text-base">Master of Business Administration</h3>
            <p className="text-xs text-slate-600">
              2-Year full-time program in Marketing, Finance, HR, and Business Analytics. Intake: 120 seats.
            </p>
            <div className="text-xs text-slate-500">Eligibility: AP ICET & Any Bachelor Degree</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md">
              MCA
            </span>
            <h3 className="font-bold text-slate-900 text-base">Master of Computer Applications</h3>
            <p className="text-xs text-slate-600">
              2-Year postgraduate course addressing enterprise full-stack development and cloud architectures. Intake: 60 seats.
            </p>
            <div className="text-xs text-slate-500">Eligibility: AP ICET & BCA/B.Sc/B.Com with Maths</div>
          </div>
        </div>
      </section>

      {/* 3. Autonomous Academic Regulations (R23) */}
      <section id="regulations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Evaluation & Standards</span>
            <h2 className="text-2xl sm:text-3xl font-black">Autonomous Academic Regulations (R23)</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Governed by the SREC Academic Council under UGC Autonomous guidelines. Employs relative and absolute grading scales under the Choice Based Credit System (CBCS).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
              <div className="text-amber-400 font-bold text-sm">Attendance Requirement</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mandatory minimum <b>75% aggregate attendance</b> across all subjects. Condonation permitted between 65% and 74% solely on certified medical grounds. Below 65% leads to semester detention.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
              <div className="text-amber-400 font-bold text-sm">Continuous Internal Evaluation</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Theory courses evaluated via 30 internal marks (Mid-1, Mid-2 objective & descriptive exams, assignments) + 70 marks Semester End Examination (SEE).
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
              <div className="text-amber-400 font-bold text-sm">Mandatory Industry Internship</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Students must complete full semester industry internship or virtual internship (e.g. EduSkills / AICTE partner programs) for graduation eligibility.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
