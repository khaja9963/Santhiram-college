'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, X, Send, Sparkles, FileText, Check, Copy,
  RefreshCw, ShieldCheck, BookOpen, ChevronRight, HelpCircle
} from 'lucide-react';
import { AI_API } from '@/lib/api';
import { Citation } from '@/types';
import { assetUrl } from '@/lib/assets';
import { clientRAGEngine } from '@/lib/rag-client';

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
  "Who is the principal of the college?",
  "Where is the campus located and bus routes?"
];

// Helper to render basic markdown (headings, bold, lists, divider) cleanly without external heavy libraries
function FormattedMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2 leading-relaxed text-slate-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Horizontal rule
        if (trimmed === '---') {
          return <hr key={idx} className="my-2.5 border-slate-200" />;
        }

        // Heading 3: ### Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-sm mt-3 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              {parseInlineFormatting(trimmed.replace('### ', ''))}
            </h4>
          );
        }

        // Heading 2: ## Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-extrabold text-[#0B2545] text-sm mt-3 mb-1">
              {parseInlineFormatting(trimmed.replace('## ', ''))}
            </h3>
          );
        }

        // Bullet point: - item or * item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-xs sm:text-sm">
              <span className="text-blue-600 font-bold mt-1 text-[10px]">&bull;</span>
              <span>{parseInlineFormatting(itemText)}</span>
            </div>
          );
        }

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm">
            {parseInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
}

// Inline bold parser for **text**
function parseInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function SRECAssistantDrawer({ isOpen, onClose }: SRECAssistantDrawerProps) {
  const initialGreeting: Message = {
    id: 'welcome',
    role: 'assistant',
    content:
      "Hello! I am the **SREC Smart Campus AI Assistant**. I am strictly grounded in official Santhiram Engineering College documents, academic regulations, syllabi, and admission brochures. How may I assist your academic journey today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
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

  const handleResetChat = () => {
    setMessages([
      {
        ...initialGreeting,
        id: 'welcome-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

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
      // AI_API has built-in resilient client-side fallback
      const response = await AI_API.chat(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // Additional safety fallback to client RAG engine
      const clientRes = await clientRAGEngine.answerQuery(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: clientRes.answer,
        sources: clientRes.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
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
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Drawer Header */}
        <div className="bg-[#0B2545] text-white p-4 flex items-center justify-between shadow-md border-b border-blue-900/50">
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
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  RAG Grounded
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                Official Knowledge Base &bull; Autonomous Regulations R23
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verification Status Pill */}
        <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Answers strictly verified against official SREC records</span>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
            Autonomous
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl p-4 text-sm shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-blue-700 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {/* Message Body */}
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap leading-relaxed font-medium">
                    {msg.content}
                  </div>
                ) : (
                  <FormattedMarkdown content={msg.content} />
                )}

                {/* Grounded Document Citations Box */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-1.5 p-2.5 rounded-xl text-xs text-slate-600">
                    <div className="font-semibold text-blue-950 flex items-center gap-1.5 mb-2">
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>Verified Document Source References:</span>
                    </div>
                    <div className="space-y-1.5">
                      {msg.sources.map((src, i) => (
                        <div
                          key={i}
                          className="text-[11px] bg-white p-2 rounded-lg border border-slate-200 shadow-2xs"
                        >
                          <div className="font-bold text-slate-800 flex items-center justify-between">
                            <span>{src.document_title}</span>
                            <span className="text-[10px] font-mono font-normal text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                              Page {src.page_number}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Category: <span className="font-semibold text-slate-600">{src.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Action Tools */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="hover:text-slate-700 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-100"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copied</span>
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
            <div className="flex items-center gap-2.5 text-slate-600 text-xs bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs w-fit">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
              <span>Searching verified SREC academic records & formulating response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Quick Tray */}
        <div className="p-3 bg-white border-t border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 mb-1.5 px-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="shrink-0 bg-slate-100 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-200 text-slate-700 text-xs px-3 py-1.5 rounded-full border border-slate-200 transition-colors disabled:opacity-50"
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
            placeholder="Ask about courses, admissions, hostel, fees, regulations..."
            rows={1}
            disabled={loading}
            className="flex-1 resize-none bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-hidden border border-transparent focus:border-blue-500 focus:bg-white transition-all disabled:opacity-60"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
