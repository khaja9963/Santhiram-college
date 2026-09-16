'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, X, Send, Sparkles, FileText, Check, Copy,
  RefreshCw, AlertCircle, ShieldCheck, ChevronRight
} from 'lucide-react';
import { AI_API } from '@/lib/api';
import { Citation } from '@/types';
import { assetUrl } from '@/lib/assets';

interface SRECAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Citation[];
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  "What courses are available at SREC?",
  "What is the admission process and eligibility?",
  "Tell me about the CSE department and labs.",
  "What are the hostel facilities and fees?",
  "Show me autonomous examination attendance rules.",
  "What are the placement statistics and recruiters?",
];

export default function SRECAssistantDrawer({ isOpen, onClose }: SRECAssistantDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I am the **SREC Smart Campus AI Assistant**. I am strictly grounded in official Santhiram Engineering College documents, academic regulations, syllabi, and admission brochures. How may I assist your academic journey today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const text = (userText || input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userText) setInput('');
    setLoading(true);

    try {
      const response = await AI_API.chat(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I couldn't complete that query against the college document database. Please verify your connection or ask again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Drawer Header */}
        <div className="bg-[#0B2545] text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-11 flex-shrink-0">
              <img
                src={assetUrl('/images/srec_logo.png')}
                alt="SREC Official Crest"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                <span>Ask SREC AI</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  RAG Grounded
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                Official Knowledge Base &bull; Autonomous Regulations
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-3.5 text-sm shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                {/* Grounded Document Citations Box */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 bg-slate-50 -mx-1 p-2 rounded-lg text-xs text-slate-600">
                    <div className="font-semibold text-blue-900 flex items-center gap-1 mb-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>Verified Document Source References:</span>
                    </div>
                    {msg.sources.map((src, i) => (
                      <div key={i} className="mb-1 text-[11px] bg-white p-1.5 rounded border border-slate-200">
                        <span className="font-bold text-slate-800">{src.document_title}</span>
                        <span className="text-slate-500"> &bull; Page {src.page_number} ({src.category})</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer action tools */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="hover:text-slate-700 flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs bg-white p-3 rounded-xl border border-slate-200 w-fit">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Retrieving SREC documents and generating verified answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Quick Tray */}
        <div className="p-2.5 bg-white border-t border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 mb-1.5 px-1">
            Suggested SREC Topics:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="shrink-0 bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-700 text-xs px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about courses, admissions, hostel, regulations..."
            rows={1}
            className="flex-1 resize-none bg-slate-100 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-hidden border border-transparent focus:border-blue-500 focus:bg-white transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
