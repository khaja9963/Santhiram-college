'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';

export default function AdminDocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Institutional Document Repository</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Official academic regulations, syllabi, brochures, and circular archives.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs text-center space-y-4">
        <FileText className="w-12 h-12 text-blue-700 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">RAG-Powered Document Management</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          All college documents are directly indexed into the vector knowledge base to power student and public AI answers.
        </p>
        <Link
          href="/admin/ai-knowledge-base"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
        >
          <span>Open AI Knowledge Base</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
