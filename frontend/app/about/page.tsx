import React from 'react';
import Link from 'next/link';
import {
  GraduationCap, Award, CheckCircle2, ShieldCheck,
  Building, Users, Compass, BookOpen, ArrowRight, Camera
} from 'lucide-react';
import CampusPhotoSlider from '@/components/campus/CampusPhotoSlider';
import { assetUrl } from '@/lib/assets';

export const metadata = {
  title: 'About SREC | Santhiram Engineering College, Nandyal',
  description: 'Learn about Santhiram Engineering College (Autonomous), our visionary leadership, NAAC A Grade accreditation, NBA programs, and the founding motto Education for Peace and Progress.',
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full">
              Autonomous Institution &bull; Established 2007 &bull; NH-40 Nandyal
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              About Santhiram Engineering College
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              A premier center of technical education in Rayalaseema, committed to fostering innovative engineers, ethical leaders, and global problem solvers under our founding motto &ldquo;Education for Peace and Progress&rdquo;.
            </p>
          </div>
          <div className="w-24 h-28 sm:w-28 sm:h-32 shrink-0 flex items-center justify-center filter drop-shadow-xl bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-sm">
            <img
              src={assetUrl('/images/srec_logo.png')}
              alt="SREC Official Crest"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision-mission" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-[#0B2545]">Our Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be a nucleus of technical education and industrial research with social consciousness and global standards, propelling every individual to realize and act for the holistic development of society under our founding motto:
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-800 p-4 rounded-r-xl">
              <span className="text-base font-serif italic text-blue-950 font-bold">
                &ldquo;Education for Peace and Progress&rdquo;
              </span>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-[#0B2545]">Our Mission</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Provide student-centric, outcome-based engineering education integrated with contemporary industry requirements.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Nurture creativity, entrepreneurial mindset, and multidisciplinary research solving grassroots community challenges.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instill strong ethical values, professional integrity, and lifelong learning commitment among aspiring engineers.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Real Campus Architecture & Heritage Showcase (Interactive Slideshow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Campus Photo Slider */}
            <div className="lg:col-span-7">
              <CampusPhotoSlider autoPlayInterval={5000} showThumbnails={true} />
            </div>

            {/* Content & Landmark Guide */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-white">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Campus Photo Gallery &bull; 5 Virtual Slides</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                  A 40-Acre Sanctuary of Learning &amp; Innovation
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Conceived with classical collegiate architecture, SREC features an iconic four-story quadrangle surrounding an expansive inner lawn shaded by royal palm trees. Arched balconies offer natural cross-ventilation and panoramic views of Nandyal valley.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                    <div className="text-amber-400 font-black text-xl">40+</div>
                    <div className="text-xs font-bold text-slate-200">Acres Eco-Campus</div>
                    <div className="text-[11px] text-slate-400">Lush Green Quads &amp; Boulevard</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
                    <div className="text-emerald-400 font-black text-xl">15+</div>
                    <div className="text-xs font-bold text-slate-200">R&amp;D Laboratories</div>
                    <div className="text-[11px] text-slate-400">AI, IoT, VLSI &amp; Computing</div>
                  </div>
                </div>

                {/* Candidate Slide Index Guide */}
                <div className="space-y-1.5 pt-1 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="line-clamp-1"><b>Slide 1:</b> Main Academic Quadrangle &amp; Palm Courtyard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="line-clamp-1"><b>Slide 2:</b> Arched Colonnades &amp; Balcony Corridors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="line-clamp-1"><b>Slide 3:</b> Autonomous Campus Monumental Entrance Arch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="line-clamp-1"><b>Slide 4:</b> Modern High-Tech Computing &amp; AI Laboratory</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="line-clamp-1"><b>Slide 5:</b> Palm Boulevard &amp; 40-Acre Campus Aerial Vista</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/campus-life"
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md inline-flex items-center gap-2 hover:scale-105"
                >
                  <span>Explore Campus Life &amp; Facilities</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-white/20 transition-all"
                >
                  Schedule Campus Visit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Profile */}
      <section id="leadership" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Visionary Governance</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">
            College Leadership & Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Guided by seasoned academicians and philanthropists committed to transformative educational excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chairman */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 border-2 border-amber-500 flex items-center justify-center text-slate-600 font-bold text-xl">
              DMS
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Dr. M. Santhiramudu</h3>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wide">Chairman</div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eminent philanthropist and founder who envisioned bringing world-class healthcare and technical education to the Rayalaseema region.
            </p>
          </div>

          {/* Managing Director */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 border-2 border-blue-600 flex items-center justify-center text-slate-600 font-bold text-xl">
              MS
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Mr. M. Sivaram</h3>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wide">Managing Director</div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Steering institutional expansion, state-of-the-art campus infrastructure, global collaborations, and student welfare initiatives.
            </p>
          </div>

          {/* Principal */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-slate-200 border-2 border-emerald-600 flex items-center justify-center text-slate-600 font-bold text-xl">
              MVS
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Dr. M. Venkata Subramanyam</h3>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Principal</div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Distinguished academician spearheading autonomous curriculum modernization, faculty development, research grants, and NBA accreditations.
            </p>
          </div>
        </div>
      </section>

      {/* History & Milestones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Milestones of Excellence</span>
            <h2 className="text-2xl sm:text-3xl font-black">History of SREC Nandyal</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Tracing our path from a visionary foundation in 2007 to an autonomous engineering powerhouse.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-l-2 border-amber-500 pl-4 space-y-1">
              <div className="text-amber-400 font-black text-xl">2007</div>
              <div className="text-sm font-bold text-white">Inception</div>
              <div className="text-xs text-slate-400">Established with core branches under JNTUA affiliation on NH-40.</div>
            </div>

            <div className="border-l-2 border-amber-500 pl-4 space-y-1">
              <div className="text-amber-400 font-black text-xl">2016</div>
              <div className="text-sm font-bold text-white">NAAC &lsquo;A&rsquo; Grade</div>
              <div className="text-xs text-slate-400">Accredited by National Assessment and Accreditation Council with Grade &lsquo;A&rsquo;.</div>
            </div>

            <div className="border-l-2 border-amber-500 pl-4 space-y-1">
              <div className="text-amber-400 font-black text-xl">2020</div>
              <div className="text-sm font-bold text-white">Autonomous Status</div>
              <div className="text-xs text-slate-400">UGC Autonomous conferment enabling tailored curricula and continuous evaluation.</div>
            </div>

            <div className="border-l-2 border-amber-500 pl-4 space-y-1">
              <div className="text-amber-400 font-black text-xl">2024-26</div>
              <div className="text-sm font-bold text-white">AI & Smart Campus</div>
              <div className="text-xs text-slate-400">Introduction of AI & ML, Data Science degrees, and AI-powered Smart Campus systems.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
