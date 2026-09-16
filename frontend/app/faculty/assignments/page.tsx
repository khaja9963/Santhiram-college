'use client';

import React, { useState } from 'react';
import { FileCheck2, Plus, CheckCircle2 } from 'lucide-react';
import { FacultyAPI } from '@/lib/api';

export default function FacultyAssignmentsPage() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('20A05601T - Database Management Systems');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(10);
  const [desc, setDesc] = useState('');
  const [created, setCreated] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await FacultyAPI.createAssignment({
        title,
        department: 'CSE',
        subject_code: subject.split(' - ')[0],
        subject_name: subject.split(' - ')[1],
        year: 3,
        semester: 6,
        due_date: dueDate || 'Friday, 11:59 PM',
        max_marks: maxMarks,
        description: desc,
      });
      setCreated(true);
      setTitle('');
      setDesc('');
      setTimeout(() => setCreated(false), 3000);
    } catch (err) {
      alert('Failed to publish assignment.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Create & Assign Coursework</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Publish problem sets, lab exercises, and assignment prompts directly to student portals.
        </p>
      </div>

      {created && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Assignment published successfully to all enrolled students!</span>
        </div>
      )}

      <form onSubmit={handleCreate} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs sm:text-sm">
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Assignment Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Normalization 1NF to BCNF Problem Set"
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Course Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50"
            >
              <option>20A05601T - Database Management Systems</option>
              <option>20A05603T - Machine Learning & AI</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Due Date</label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="e.g. Next Friday, 11:59 PM"
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Max Marks</label>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Instructions & Problem Specifications</label>
          <textarea
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Specify assignment guidelines, required format (PDF/Code), and grading rubrics..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50 resize-none"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Assignment</span>
        </button>
      </form>
    </div>
  );
}
