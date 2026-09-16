'use client';

import React, { useState } from 'react';
import { BarChart3, Save, CheckCircle2 } from 'lucide-react';
import { FacultyAPI } from '@/lib/api';

export default function FacultyMarksPage() {
  const [subject, setSubject] = useState('20A05601T - DBMS');
  const [examType, setExamType] = useState('MID-1');
  const [students, setStudents] = useState<any[]>([
    { id: '1', roll: '22X51A0501', name: 'Sai Teja Reddy', marks: 28 },
    { id: '2', roll: '22X51A0502', name: 'B. Anusha', marks: 26 },
    { id: '3', roll: '22X51A0503', name: 'C. Harish', marks: 24 },
    { id: '4', roll: '22X51A0504', name: 'D. Kalyan', marks: 22 },
    { id: '5', roll: '22X51A0505', name: 'E. Meena', marks: 29 },
  ]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleScoreChange = (id: string, val: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, marks: val } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await FacultyAPI.uploadMarks({
        subject_code: subject.split(' - ')[0],
        exam_type: examType,
        marks: students.map((s) => ({
          student_id: s.id,
          roll_number: s.roll,
          scored_marks: s.marks,
          max_marks: 30,
        })),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('Upload failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Upload Examination Marks</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter internal assessment, lab practical, and continuous evaluation scores.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Course Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option>20A05601T - DBMS (CSE-III-A)</option>
            <option>20A05603T - Machine Learning (CSM-III-B)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Exam Assessment Category</label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option>MID-1 Descriptive & Objective (30 Marks)</option>
            <option>MID-2 Descriptive & Objective (30 Marks)</option>
            <option>Internal Lab Assessment (50 Marks)</option>
            <option>Continuous Assignment Evaluation (10 Marks)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Uploading...' : 'Save & Publish Marks'}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Scores saved and published to Student Portals!</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th className="p-3">Roll Number</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Max Marks</th>
              <th className="p-3 text-right">Scored Marks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60">
                <td className="p-3 font-mono font-bold text-blue-900">{s.roll}</td>
                <td className="p-3 font-bold text-slate-900">{s.name}</td>
                <td className="p-3 text-slate-500">30 Marks</td>
                <td className="p-3 text-right">
                  <input
                    type="number"
                    max={30}
                    min={0}
                    value={s.marks}
                    onChange={(e) => handleScoreChange(s.id, Number(e.target.value))}
                    className="w-20 text-center font-bold text-xs p-1.5 rounded-lg border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
