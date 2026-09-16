'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar, Clock, MapPin, Users, Award,
  Sparkles, ExternalLink, Filter, ArrowRight
} from 'lucide-react';
import { CollegeAPI } from '@/lib/api';
import { CollegeEvent } from '@/types';

export default function EventsPage() {
  const [events, setEvents] = useState<CollegeEvent[]>([]);
  const [category, setCategory] = useState<string>('ALL');

  useEffect(() => {
    CollegeAPI.getEvents()
      .then((data) => setEvents(data))
      .catch(() => {
        setEvents([
          {
            id: '1',
            title: 'TECH-SANTHIRAM 2026: National Level Technical Symposium',
            department: 'CSE & Allied Branches',
            category: 'TECHNICAL',
            date: 'October 14-15, 2026',
            time: '09:30 AM - 05:00 PM',
            location: 'SREC Central Auditorium',
            description: 'Paper presentations, AI Hackathon, Code Debugging, and Project Expo with cash prizes exceeding ₹1,00,000.',
            organizer: 'SREC Computer Society & ACM Chapter',
            registration_link: 'https://srecnandyal.edu.in/techsanthiram',
            is_upcoming: true,
          },
          {
            id: '2',
            title: 'Hands-on Workshop: Enterprise GenAI & RAG Systems',
            department: 'CSE (AI & ML)',
            category: 'WORKSHOP',
            date: 'November 05, 2026',
            time: '10:00 AM - 04:30 PM',
            location: 'Turing Computing Lab, CS Block',
            description: 'Practical training with LangChain, pgvector, and FastAPI led by principal software architects from leading tech MNCs.',
            organizer: 'Center for AI & Cloud Innovation',
            registration_link: 'https://srecnandyal.edu.in/workshops/genai',
            is_upcoming: true,
          },
          {
            id: '3',
            title: 'Annual Inter-Collegiate Cricket & Sports Tournament',
            department: 'Physical Education Department',
            category: 'SPORTS',
            date: 'December 12-14, 2026',
            time: '08:00 AM - 06:00 PM',
            location: 'SREC Sports Pavilion Ground',
            description: 'Inter-college cricket, volleyball, badminton, and basketball tournament among top autonomous colleges across Rayalaseema.',
            organizer: 'SREC Sports Council',
            is_upcoming: true,
          },
        ]);
      });
  }, []);

  const filtered = category === 'ALL' ? events : events.filter((e) => e.category === category);

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full">
            Campus Calendar &bull; Technical Symposia & Workshops
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Events, Workshops & Symposia
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            Discover upcoming national conferences, hackathons, guest lectures, cultural fests, and athletic tournaments.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
          {['ALL', 'TECHNICAL', 'WORKSHOP', 'SPORTS', 'CULTURAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                category === cat
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {event.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {event.department}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">{event.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3">{event.description}</p>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">By {event.organizer}</span>
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1 hover:text-blue-900">
                  Register <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
