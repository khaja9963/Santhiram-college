'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, BookOpen, Building2, User, FileText,
  Sparkles, ExternalLink, X, ArrowRight
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: 'DEPARTMENT' | 'PORTAL' | 'FACILITY' | 'ACADEMICS' | 'AI_TOOL';
  url: string;
  description: string;
}

const SEARCH_DIRECTORY: SearchItem[] = [
  { id: '1', title: 'Computer Science & Engineering (CSE)', category: 'DEPARTMENT', url: '/departments/cse', description: 'NBA Accredited, 180 seats, AI & Cloud Computing Labs' },
  { id: '2', title: 'CSE (Artificial Intelligence & ML)', category: 'DEPARTMENT', url: '/departments/csm', description: 'Cognitive systems, Deep Learning, GPU computing' },
  { id: '3', title: 'CSE (Data Science)', category: 'DEPARTMENT', url: '/departments/csd', description: 'Big Data analytics, predictive statistical modeling' },
  { id: '4', title: 'Electronics & Communication (ECE)', category: 'DEPARTMENT', url: '/departments/ece', description: 'NBA Accredited, Cadence VLSI, Embedded Systems Lab' },
  { id: '5', title: 'Electrical & Electronics (EEE)', category: 'DEPARTMENT', url: '/departments/eee', description: 'Renewable energy, Smart Grids, Electric Vehicle tech' },
  { id: '6', title: 'Master of Business Administration (MBA)', category: 'DEPARTMENT', url: '/departments/mba', description: 'Postgraduate management leadership, HR & Finance' },
  { id: '7', title: 'Master of Computer Applications (MCA)', category: 'DEPARTMENT', url: '/departments/mca', description: 'Full-stack software engineering and cloud systems' },
  { id: '8', title: 'Campus Facilities & Infrastructure', category: 'FACILITY', url: '/campus-life', description: 'Hostels, Central Library, healthcare, sports complex and labs' },
  { id: '9', title: 'Dr. B.R. Ambedkar Central Library', category: 'FACILITY', url: '/campus-life#library', description: '45,000+ volumes, IEEE digital access, 60 computers' },
  { id: '10', title: 'AI Study Assistant', category: 'AI_TOOL', url: '/student/ai-study', description: 'Curriculum concept explanations, study summaries, MCQ quizzes' },
  { id: '11', title: 'AI Placement Assistant & Mock Interview', category: 'AI_TOOL', url: '/student/ai-placement', description: 'Resume parser, skill gap analysis, simulated technical interview' },
  { id: '12', title: 'Student Portal Dashboard', category: 'PORTAL', url: '/student/dashboard', description: 'Attendance metrics, internal marks, results, assignments' },
  { id: '13', title: 'Faculty Portal Dashboard', category: 'PORTAL', url: '/faculty/dashboard', description: 'Mark student attendance, grade tests, upload notes' },
  { id: '14', title: 'Admin AI Knowledge Base & RAG', category: 'PORTAL', url: '/admin/ai-knowledge-base', description: 'Document indexing, chunk embeddings, status viewer' },
  { id: '15', title: 'Admissions 2026 & EAPCET Process', category: 'ACADEMICS', url: '/admissions', description: 'Eligibility, fee structure, Category A & B convener details' },
  { id: '16', title: 'Campus Placements & Recruiter Records', category: 'ACADEMICS', url: '/placements', description: 'Highest package 12.5 LPA, TCS, Infosys, Capgemini drives' },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle or open handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = SEARCH_DIRECTORY.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-blue-700 shrink-0" />
          <input
            type="text"
            placeholder="Search departments, courses, portals, facilities, AI tools... (Ctrl + K)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No campus directory results found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border border-blue-200/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-blue-100/70 text-blue-800 flex items-center justify-center shrink-0">
                      {item.category === 'DEPARTMENT' && <Building2 className="w-4 h-4" />}
                      {item.category === 'PORTAL' && <User className="w-4 h-4" />}
                      {item.category === 'FACILITY' && <BookOpen className="w-4 h-4" />}
                      {item.category === 'ACADEMICS' && <FileText className="w-4 h-4" />}
                      {item.category === 'AI_TOOL' && <Sparkles className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-medium">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1">{item.description}</div>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-blue-600 shrink-0 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with <b>↑</b> and <b>↓</b></span>
          <span>Press <b>ESC</b> to close</span>
        </div>
      </div>
    </div>
  );
}
