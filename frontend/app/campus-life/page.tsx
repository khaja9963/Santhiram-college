import React from 'react';
import Link from 'next/link';
import {
  Building2, BookOpen, ShieldCheck, Heart, Coffee,
  Bus, Trophy, Users, ArrowRight, CheckCircle2, Camera
} from 'lucide-react';
import CampusPhotoSlider from '@/components/campus/CampusPhotoSlider';

export const metadata = {
  title: 'Campus Life & Infrastructure | SREC Nandyal',
  description: 'Explore the 40-acre SREC campus facilities including central library, residential hostels, sports arena, dining, transport, and student clubs.',
};

export default function CampusLifePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full">
            40+ Acres Sprawling Green Campus on NH-40
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Campus Life & Infrastructure
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            A secure, vibrant learning environment supporting academic curiosity, physical well-being, residential comfort, and cultural enrichment.
          </p>
        </div>
      </section>

      {/* Real Campus Visual Feature & Photo Slides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Campus Tour &bull; Real Photo Slides</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">
              Life Across the 40-Acre Campus &amp; Quadrangle
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Slide through real photographs of our iconic quadrangle, arched colonnades, entrance gate, computing labs, and green palm boulevard.
          </p>
        </div>

        <CampusPhotoSlider autoPlayInterval={5000} showThumbnails={true} />
      </section>

      {/* Facilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Hostels */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Residential Hostels</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Separate secured hostels for boys and girls with 24/7 security, biometric attendance, uninterrupted high-speed Wi-Fi, and solar water heaters.
            </p>
            <div className="text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
              Boarding fee: ~₹60,000/year &bull; Nutritious hygienic dining
            </div>
          </div>

          {/* 2. Central Library */}
          <div id="library" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Dr. B.R. Ambedkar Central Library</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Over 45,000 volumes, 6,200 unique titles, national and international journals, IEEE digital subscription, and a 60-computer digital library.
            </p>
            <div className="text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
              Timings: 08:00 AM - 08:00 PM on all working days
            </div>
          </div>

          {/* 3. 24/7 Healthcare */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">24/7 Medical Care</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Immediate healthcare is supported by the adjacent Santhiram Medical College & General Hospital with emergency ambulance and full-time medical officers.
            </p>
            <div className="text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
              Complimentary health screenings for students and staff
            </div>
          </div>

          {/* 4. Sports & Athletics */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Sports Complex & Gym</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full-size cricket ground, volleyball courts, basketball arena, indoor badminton stadium, and modern multi-station fitness gymnasium.
            </p>
            <div className="text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
              Regular inter-collegiate tournaments and sports fests
            </div>
          </div>

          {/* 5. Transportation Fleet */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-black">
              <Bus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Campus Transport Fleet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fleet of 30+ GPS-tracked college buses connecting Nandyal town, Kurnool, Allagadda, Banaganapalle, and surrounding mandals.
            </p>
            <div className="text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
              Safe transit with dedicated experienced drivers
            </div>
          </div>

          {/* 6. Student Clubs & NSS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-black">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Clubs & Student Societies</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ACM Student Chapter, IEEE Society, National Service Scheme (NSS), Coding Club, Robotics Forum, and Cultural Arts Society.
            </p>
            <div className="text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
              Active peer leadership, hackathons, and community outreach
            </div>
          </div>
        </div>
      </section>

      {/* Visit Campus Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-[#0B2545] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-black">Want to experience SREC in person?</h3>
            <p className="text-sm text-slate-300">
              Schedule a campus visit or contact our admissions desk on NH-40, Nerawada, Nandyal to explore our academic quadrangle, laboratories, and student amenities.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-transform hover:scale-105 shrink-0"
          >
            Visit Campus & Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
