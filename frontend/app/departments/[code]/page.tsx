'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, Users, BookOpen, Award, CheckCircle2,
  Mail, Phone, Clock, ArrowRight, ExternalLink, ShieldCheck,
  Cpu, Layers, Code, Database, Sparkles
} from 'lucide-react';
import { CollegeAPI } from '@/lib/api';

const DEPT_FALLBACK_DATA: Record<string, any> = {
  cse: {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    established: 2007,
    intake: 180,
    accredited: "NBA Accredited & NAAC 'A' Grade",
    hod: 'Dr. K. Subba Reddy',
    hod_email: 'hodcse@srecnandyal.edu.in',
    description:
      'The Department of Computer Science & Engineering at SREC is a center of excellence in software engineering, computing architectures, and artificial intelligence. With 8 state-of-the-art computer laboratories, accredited faculty mentors, and high placement records, we prepare students for high-impact tech careers.',
    labs: [
      { name: 'AI & Machine Learning Computing Lab', desc: 'High-performance GPU workstations for deep learning and neural network research.' },
      { name: 'Cloud Computing & Virtualization Center', desc: 'Private cloud setup with OpenStack and AWS cloud integration tools.' },
      { name: 'Data Analytics & Big Data Laboratory', desc: 'Hadoop, Spark, and PostgreSQL clusters for big data querying and predictive analysis.' },
      { name: 'Open Source Software Development Lab', desc: 'Linux workstations configured for full-stack, Python, and microservices development.' },
      { name: 'Object Oriented Programming with Java/Python Lab', desc: 'Modern IDEs and testing harnesses for foundational algorithm design.' },
    ],
    faculty: [
      { name: 'Dr. K. Subba Reddy', role: 'Professor & HOD', qual: 'Ph.D. in CSE', exp: '16+ Years' },
      { name: 'Dr. P. Mallikarjuna', role: 'Professor', qual: 'Ph.D. in Computer Science', exp: '14+ Years' },
      { name: 'Mr. S. Ramesh', role: 'Associate Professor', qual: 'M.Tech (Ph.D.)', exp: '11+ Years' },
      { name: 'Mrs. K. Lavanya', role: 'Assistant Professor', qual: 'M.Tech in CSE', exp: '8+ Years' },
    ],
    curriculum_highlights: [
      'Data Structures & Algorithms (Advanced)',
      'Database Management Systems & Vector Databases',
      'Artificial Intelligence & Deep Learning Architectures',
      'Design & Analysis of Algorithms',
      'Full-Stack Web Technologies (React & FastAPI)',
      'Software Testing & Agile Engineering',
    ],
  },
  csm: {
    code: 'CSM',
    name: 'CSE (Artificial Intelligence & Machine Learning)',
    established: 2020,
    intake: 120,
    accredited: 'AICTE Approved & UGC Autonomous',
    hod: 'Dr. P. Mallikarjuna',
    hod_email: 'hodcsm@srecnandyal.edu.in',
    description:
      'The Department of CSE (AI & ML) equips engineering students with advanced foundations in cognitive computing, deep learning algorithms, computer vision, natural language processing, and autonomous robotic systems.',
    labs: [
      { name: 'Deep Learning & Neural Network Lab', desc: 'NVIDIA GPU clusters running PyTorch, TensorFlow, and HuggingFace models.' },
      { name: 'Computer Vision & Robotics Workstation', desc: 'Industrial robotic arms, stereo cameras, and edge computing Jetson boards.' },
      { name: 'NLP & Large Language Models Testbed', desc: 'RAG frameworks, vector similarity engines, and conversational AI pipelines.' },
    ],
    faculty: [
      { name: 'Dr. P. Mallikarjuna', role: 'Professor & HOD', qual: 'Ph.D. in AI & Robotics', exp: '15+ Years' },
      { name: 'Mr. M. Sreenivasulu', role: 'Associate Professor', qual: 'M.Tech (Ph.D.)', exp: '10+ Years' },
    ],
    curriculum_highlights: [
      'Foundations of Machine Learning',
      'Deep Neural Networks & Transformers',
      'Computer Vision & Image Processing',
      'Natural Language Processing & GenAI',
      'Reinforcement Learning & Robotics',
    ],
  },
  ece: {
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    established: 2007,
    intake: 120,
    accredited: 'NBA Accredited Program',
    hod: 'Dr. G. Ramesh',
    hod_email: 'hodece@srecnandyal.edu.in',
    description:
      'The Department of Electronics and Communication Engineering is accredited by the NBA and features industry-sponsored Cadence VLSI labs, Texas Instruments Embedded systems, and Microwave communication hubs.',
    labs: [
      { name: 'Cadence VLSI Design Suite', desc: 'ASIC design, FPGA synthesis, and integrated circuit layout tools.' },
      { name: 'Texas Instruments Embedded Center', desc: 'MSP430, ARM Cortex, and IoT hardware sensor kits.' },
      { name: 'Optical & Microwave Communication Lab', desc: 'High-frequency signal generators, spectrum analyzers, and waveguide apparatus.' },
    ],
    faculty: [
      { name: 'Dr. G. Ramesh', role: 'Professor & HOD', qual: 'Ph.D. in VLSI Systems', exp: '18+ Years' },
      { name: 'Mr. B. Venkat', role: 'Associate Professor', qual: 'M.Tech in Embedded Systems', exp: '12+ Years' },
    ],
    curriculum_highlights: [
      'Electronic Devices & Circuit Theory',
      'VLSI System Design with Verilog',
      'Microprocessors & Microcontrollers (ARM)',
      'Digital Signal Processing & Filter Design',
      'Embedded IoT Architectures',
    ],
  },
};

export default function DepartmentDetailPage() {
  const params = useParams();
  const code = ((params.code as string) || 'cse').toLowerCase();
  const [activeTab, setActiveTab] = useState<'overview' | 'labs' | 'faculty' | 'curriculum'>('overview');

  const dept = DEPT_FALLBACK_DATA[code] || DEPT_FALLBACK_DATA['cse'];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md">
              {dept.code}
            </span>
            <span className="text-xs bg-white/10 text-slate-200 border border-white/20 px-3 py-1 rounded-full">
              {dept.accredited}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{dept.name}</h1>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">{dept.description}</p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div><b>Established:</b> {dept.established}</div>
            <div>&bull;</div>
            <div><b>Annual Intake:</b> {dept.intake} Seats</div>
            <div>&bull;</div>
            <div><b>Head of Department:</b> {dept.hod}</div>
          </div>
        </div>
      </section>

      {/* Main Content Area with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          {[
            { key: 'overview', label: 'Department Overview' },
            { key: 'labs', label: `Laboratories (${dept.labs.length})` },
            { key: 'faculty', label: `Faculty Roster (${dept.faculty.length})` },
            { key: 'curriculum', label: 'Curriculum & Syllabi (R23)' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-blue-50 text-blue-900 border-b-2 border-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Head of Department Message</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;Welcome to the Department of {dept.name}. Our mission is to transform students into skilled engineering professionals capable of leading global technological innovations. Through industry-sponsored laboratories, practical mini-projects, and continuous mentoring, our students consistently excel in international hackathons and top-tier campus placements.&rdquo;
                </p>
                <div className="pt-2 text-xs font-bold text-[#0B2545]">
                  &mdash; {dept.hod}, Head of Department ({dept.code})
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Vision of the Department</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To be recognized as a premier center of learning that produces socially responsible, technically sound engineers with high ethical standards capable of tackling complex global engineering challenges.
                </p>
              </div>
            </div>

            {/* Side Card: Contact HOD */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base text-amber-400">Department Office</h3>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{dept.hod_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>+91-9866308475 (Ext: 204)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Mon - Sat: 09:00 AM - 04:30 PM</span>
                  </div>
                </div>

                <Link
                  href="/admissions"
                  className="block text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Apply for {dept.code} Admission
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Laboratories */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dept.labs.map((lab: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-xs">
                  0{idx + 1}
                </div>
                <h4 className="font-bold text-slate-900 text-base">{lab.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{lab.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Faculty */}
        {activeTab === 'faculty' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dept.faculty.map((f: any, idx: number) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-200 border-2 border-blue-600 flex items-center justify-center font-bold text-slate-600">
                  {f.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{f.name}</h4>
                  <div className="text-xs text-blue-700 font-medium">{f.role}</div>
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2">
                  <div>{f.qual}</div>
                  <div>Experience: <b>{f.exp}</b></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Curriculum */}
        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">R23 Autonomous Curriculum Core Modules</h3>
              <p className="text-xs text-slate-500">Subject outlines aligned with AICTE model curriculum and international industry certifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dept.curriculum_highlights.map((subj: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{subj}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
