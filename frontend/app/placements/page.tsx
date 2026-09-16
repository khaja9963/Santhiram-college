'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award, Briefcase, TrendingUp, Users, CheckCircle2,
  Building, Star, FileText, ArrowRight
} from 'lucide-react';
import { CollegeAPI } from '@/lib/api';
import { PlacementStat } from '@/types';

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<PlacementStat[]>([]);

  useEffect(() => {
    CollegeAPI.getPlacements()
      .then((data) => setPlacements(data))
      .catch(() => {
        setPlacements([
          { academic_year: '2024-25', company_name: 'Tata Consultancy Services (TCS)', package_lpa: 7.5, students_placed: 94, roles: 'Ninja & Digital Engineer' },
          { academic_year: '2024-25', company_name: 'Infosys Technologies', package_lpa: 6.5, students_placed: 82, roles: 'Systems Engineer & Specialist' },
          { academic_year: '2024-25', company_name: 'Capgemini', package_lpa: 5.8, students_placed: 65, roles: 'Software Analyst' },
          { academic_year: '2024-25', company_name: 'Wipro Technologies', package_lpa: 5.5, students_placed: 54, roles: 'Project Engineer' },
          { academic_year: '2024-25', company_name: 'Tech Mahindra', package_lpa: 5.2, students_placed: 42, roles: 'Associate Software Engineer' },
          { academic_year: '2024-25', company_name: 'Hexaware Technologies', package_lpa: 6.0, students_placed: 28, roles: 'Software Developer' },
        ]);
      });
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full">
            Training & Placement Cell &bull; 87.5% Placement Record
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Corporate Placements & Career Acceleration
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            Bridging academic learning and global enterprise expectations with comprehensive aptitude, coding bootcamps, and mock interview preparations.
          </p>
        </div>
      </section>

      {/* Highlights Metric Strip */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-blue-950">12.5 <span className="text-base font-bold text-slate-500">LPA</span></div>
            <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Highest Package</div>
          </div>
          <div className="border-l border-slate-100">
            <div className="text-3xl sm:text-4xl font-black text-amber-600">4.5 <span className="text-base font-bold text-slate-500">LPA</span></div>
            <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Average Package</div>
          </div>
          <div className="border-l border-slate-100">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">450+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Total Offers Received</div>
          </div>
          <div className="border-l border-slate-100">
            <div className="text-3xl sm:text-4xl font-black text-blue-950">#6</div>
            <div className="text-xs font-semibold text-slate-500 uppercase mt-1">EduSkills All India Rank</div>
          </div>
        </div>
      </section>

      {/* Recruiter Roster Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Placement Audit</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">Recent Campus Recruiters & Offers</h2>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-4">Recruiting Organization</th>
                  <th className="p-4">Job Roles</th>
                  <th className="p-4">Package (LPA)</th>
                  <th className="p-4 text-right">Students Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {placements.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{p.company_name}</td>
                    <td className="p-4 text-slate-600">{p.roles}</td>
                    <td className="p-4 font-bold text-emerald-700">₹{p.package_lpa} LPA</td>
                    <td className="p-4 text-right font-black text-blue-950">{p.students_placed} Offers</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Structured Training Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Industry Readiness</span>
            <h2 className="text-2xl sm:text-3xl font-black">4-Stage Career Training Roadmap</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Transforming students through continuous competency development right from second year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border-t-2 border-amber-500 pt-4 space-y-2">
              <div className="text-xs font-mono text-amber-400 font-bold">STAGE 1 &bull; II YEAR</div>
              <h3 className="font-bold text-base text-white">Foundational Aptitude & C/C++</h3>
              <p className="text-xs text-slate-400">Quantitative problem solving, logic deduction, verbal communication, and foundational programming algorithms.</p>
            </div>

            <div className="border-t-2 border-amber-500 pt-4 space-y-2">
              <div className="text-xs font-mono text-amber-400 font-bold">STAGE 2 &bull; III YEAR (SEM 1)</div>
              <h3 className="font-bold text-base text-white">Advanced DSA & Python/Java</h3>
              <p className="text-xs text-slate-400">Trees, Graphs, Dynamic Programming, SQL databases, and weekly competitive programming challenges on LeetCode.</p>
            </div>

            <div className="border-t-2 border-amber-500 pt-4 space-y-2">
              <div className="text-xs font-mono text-amber-400 font-bold">STAGE 3 &bull; III YEAR (SEM 2)</div>
              <h3 className="font-bold text-base text-white">Full-Stack & Cloud Bootcamp</h3>
              <p className="text-xs text-slate-400">Full-stack project building with React, FastAPI, AWS cloud hosting, and EduSkills virtual internships.</p>
            </div>

            <div className="border-t-2 border-amber-500 pt-4 space-y-2">
              <div className="text-xs font-mono text-amber-400 font-bold">STAGE 4 &bull; IV YEAR</div>
              <h3 className="font-bold text-base text-white">Company Drives & Mocks</h3>
              <p className="text-xs text-slate-400">Company-specific mock technical rounds, HR interview simulation, and on-campus recruitment drives.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
