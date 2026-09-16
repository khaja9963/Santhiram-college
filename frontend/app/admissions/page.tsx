'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, CheckCircle2, FileText, HelpCircle,
  Phone, Mail, Bot, ArrowRight, ShieldCheck, ChevronDown
} from 'lucide-react';

export default function AdmissionsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What is the college counselling code for AP EAPCET?',
      a: 'The official counselling code for Santhiram Engineering College in AP EAPCET / ECET / ICET is SREC.',
    },
    {
      q: 'Are students eligible for Jagananna Vidya Deevena (JVD) fee reimbursement?',
      a: 'Yes, eligible students admitted under Category-A (Convener Quota) through AP EAPCET receive 100% tuition fee reimbursement directly from the Government of Andhra Pradesh as per JVD norms.',
    },
    {
      q: 'Can diploma holders join B.Tech directly into the second year?',
      a: 'Yes. Diploma holders and B.Sc. mathematics graduates can seek direct lateral entry admission into the 2nd year (3rd semester) B.Tech through AP ECET under the 10% supernumerary quota.',
    },
    {
      q: 'What are the hostel accommodations and mess facilities?',
      a: 'SREC provides separate, secured hostels for boys and girls with RO purified water, biometric security, hygienic vegetarian and non-vegetarian dining, and 24/7 medical access with Santhiram General Hospital.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full">
            Admissions 2026-27 &bull; EAPCET Code: SREC
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Admissions & Eligibility Criteria
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            Join an autonomous engineering college recognized for excellence in innovation, industry-driven curriculum, and high-impact campus placements.
          </p>
        </div>
      </section>

      {/* Admission Quota Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category A */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black bg-blue-100 text-blue-900 px-3 py-1 rounded-md">
                Category - A (70% Seats)
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                Convener Quota
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900">AP EAPCET State Counselling</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Admissions are conducted through centralized web counselling by APSCHE based on merit rank secured in AP EAPCET.
            </p>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900">Eligibility:</div>
              <ul className="space-y-1.5 list-disc pl-5">
                <li>Passed 10+2 with Mathematics, Physics, and Chemistry (MPC).</li>
                <li>Minimum 45% aggregate in group subjects (40% for SC/ST/BC categories).</li>
                <li>Qualified rank in AP EAPCET examination.</li>
              </ul>
            </div>
          </div>

          {/* Category B */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-md">
                Category - B (30% Seats)
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded">
                Management / NRI Quota
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900">Institutional Merit Selection</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Admissions are conducted directly by the college management strictly following APSCHE guidelines and merit rankings.
            </p>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900">Eligibility:</div>
              <ul className="space-y-1.5 list-disc pl-5">
                <li>Candidates with qualified JEE (Mains) or AP EAPCET rank.</li>
                <li>Candidates with minimum 50% marks in intermediate (10+2) MPC subjects.</li>
                <li>Applications invited directly through official SREC notification.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents Checklist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Verification Checklist</span>
            <h2 className="text-2xl sm:text-3xl font-black">Mandatory Certificates for Admission</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Students must submit original documents along with 3 sets of self-attested photocopies during reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              'AP EAPCET / ECET Rank Card & Hall Ticket',
              'SSC / 10th Class Marks Memo (Date of Birth Proof)',
              'Intermediate / 10+2 Marks Memorandum',
              'Transfer Certificate (T.C.) & Conduct Certificate',
              'Study & Bonafide Certificates (Class VI to Intermediate)',
              'Caste Certificate (for SC / ST / BC candidates)',
              'Income Certificate issued by competent Tahsildar / MeeSeva',
              'Aadhaar Card copy of Student and Parents',
              'Recent Passport Size Color Photographs (6 copies)',
            ].map((doc, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full text-left p-4 flex items-center justify-between font-bold text-slate-900 text-sm hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
