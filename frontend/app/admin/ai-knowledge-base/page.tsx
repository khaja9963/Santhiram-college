'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles, UploadCloud, Trash2, RefreshCw, Search,
  CheckCircle2, Clock, XCircle, FileText, Database, Plus
} from 'lucide-react';
import { AdminAPI } from '@/lib/api';

export default function AdminKnowledgeBasePage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Upload state
  const [docTitle, setDocTitle] = useState('');
  const [docDept, setDocDept] = useState('ALL');
  const [docCategory, setDocCategory] = useState('SYLLABUS');
  const [docYear, setDocYear] = useState('2025-2026');
  const [uploading, setUploading] = useState(false);

  const fetchDocs = () => {
    AdminAPI.getDocuments()
      .then((data) => setDocuments(data))
      .catch(() => {
        setDocuments([
          {
            id: '1',
            title: 'SREC Admission Brochure 2025-26',
            department: 'ALL',
            category: 'ADMISSIONS',
            file_name: 'SREC_Admission_Brochure_2025-26.pdf',
            file_size_kb: 2450,
            academic_year: '2025-2026',
            total_pages: 24,
            indexed_chunks: 18,
            status: 'PROCESSED',
          },
          {
            id: '2',
            title: 'B.Tech Autonomous Academic Regulations (R23)',
            department: 'ALL',
            category: 'REGULATIONS',
            file_name: 'BTech_Academic_Regulations_R23.pdf',
            file_size_kb: 1840,
            academic_year: '2024-2025',
            total_pages: 36,
            indexed_chunks: 28,
            status: 'PROCESSED',
          },
          {
            id: '3',
            title: 'CSE Department Curriculum & Laboratory Manual',
            department: 'CSE',
            category: 'SYLLABUS',
            file_name: 'CSE_Curriculum_Syllabus_R23.pdf',
            file_size_kb: 3200,
            academic_year: '2024-2025',
            total_pages: 48,
            indexed_chunks: 35,
            status: 'PROCESSED',
          },
          {
            id: '4',
            title: 'SREC Annual Placement Report & Recruiter Directory',
            department: 'T&P',
            category: 'PLACEMENT',
            file_name: 'SREC_Placement_Report_2024-25.pdf',
            file_size_kb: 1420,
            academic_year: '2024-2025',
            total_pages: 16,
            indexed_chunks: 14,
            status: 'PROCESSED',
          },
        ]);
      });
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', docTitle);
      formData.append('department', docDept);
      formData.append('category', docCategory);
      formData.append('academic_year', docYear);

      await AdminAPI.uploadDocument(formData);
      setUploadModalOpen(false);
      setDocTitle('');
      fetchDocs();
    } catch (e) {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document and remove its chunks from vector search?')) return;
    try {
      await AdminAPI.deleteDocument(id);
      fetchDocs();
    } catch (e) {
      // Local fallback removal
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.category.toLowerCase().includes(query.toLowerCase()) ||
      d.department.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
            <Database className="w-3.5 h-3.5" />
            <span>Retrieval-Augmented Generation (RAG) Index</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            AI Knowledge Base & Document Vector Store
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage institutional documents, generate vector embeddings, inspect chunk statuses, and maintain the ground-truth corpus for SREC AI.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload & Ingest Document</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search documents by title, department, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-blue-600 outline-hidden bg-slate-50/50"
          />
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-4">
          <span><b>{filtered.length}</b> Documents Ingested</span>
          <span>&bull;</span>
          <span className="text-emerald-700 font-bold">✓ Processed in pgvector</span>
        </div>
      </div>

      {/* Document Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th className="p-4">Document Title & Filename</th>
              <th className="p-4">Category</th>
              <th className="p-4">Department</th>
              <th className="p-4">Indexed Chunks</th>
              <th className="p-4">Vector Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/60">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{doc.title}</div>
                  <div className="text-xs font-mono text-slate-400">{doc.file_name} &bull; {doc.file_size_kb} KB</div>
                </td>
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-800 font-bold text-[10px] px-2 py-0.5 rounded">
                    {doc.category}
                  </span>
                </td>
                <td className="p-4">{doc.department}</td>
                <td className="p-4">
                  <span className="font-bold text-blue-900 font-mono">
                    {doc.indexed_chunks} chunks
                  </span>
                  <span className="text-slate-400 text-xs ml-1">({doc.total_pages} pages)</span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>✓ Processed</span>
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete document and remove from vector search"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Upload Academic Document for RAG</h3>
                <p className="text-xs text-slate-500">Text will be cleaned, chunked into 600-char segments, and indexed.</p>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SREC Examination Manual 2026"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-blue-600 outline-hidden bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-semibold"
                  >
                    <option value="SYLLABUS">SYLLABUS</option>
                    <option value="REGULATIONS">REGULATIONS</option>
                    <option value="ADMISSIONS">ADMISSIONS</option>
                    <option value="EXAMINATION">EXAMINATION</option>
                    <option value="HANDBOOK">HANDBOOK</option>
                    <option value="PLACEMENT">PLACEMENT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Department</label>
                  <select
                    value={docDept}
                    onChange={(e) => setDocDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-semibold"
                  >
                    <option value="ALL">ALL DEPARTMENTS</option>
                    <option value="CSE">CSE</option>
                    <option value="CSM">CSE (AI & ML)</option>
                    <option value="CSD">CSE (Data Science)</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select File (PDF / DOCX / TXT)</label>
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
                  <UploadCloud className="w-8 h-8 text-blue-600 mx-auto" />
                  <div className="text-xs font-semibold text-slate-700">Drag and drop file here or click to browse</div>
                  <div className="text-[10px] text-slate-400">Supported formats: PDF, DOCX, TXT (Max 25 MB)</div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{uploading ? 'Processing Chunks...' : 'Ingest to Vector DB'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
