'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SearchModal from '@/components/search/SearchModal';
import SRECAssistantDrawer from '@/components/ai/SRECAssistantDrawer';
import { Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const pathname = usePathname();

  const isPortal = pathname.startsWith('/student') || pathname.startsWith('/faculty') || pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      <main className="flex-1 w-full">
        {children}
      </main>

      {!isPortal && <Footer />}

      {/* Floating Ask SREC AI Button */}
      <button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 group border border-white/20"
        title="Ask SREC AI Assistant"
      >
        <Bot className="w-5 h-5 text-amber-300 animate-pulse group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold tracking-wide pr-1">Ask SREC AI</span>
      </button>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* SREC AI Drawer */}
      <SRECAssistantDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />
    </div>
  );
}
