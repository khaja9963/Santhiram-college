import React from 'react';
import Link from 'next/link';
import {
  GraduationCap, MapPin, Phone, Mail, Clock, ShieldCheck,
  Award, ExternalLink, Heart
} from 'lucide-react';
import { assetUrl } from '@/lib/assets';

export default function Footer() {
  return (
    <footer className="bg-[#0B2545] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-15 flex-shrink-0">
                <img
                  src={assetUrl('/images/srec_logo.png')}
                  alt="Santhiram Engineering College Official Crest"
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">SANTHIRAM</span>
                <span className="text-xs block font-bold text-amber-400 tracking-wider">
                  ENGINEERING COLLEGE (AUTONOMOUS)
                </span>
                <span className="text-[10px] block font-mono text-slate-400">ESTD - 2007 &bull; NANDYAL</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              Founded under the aegis of Sri Shirdi Sai Educational Society with the noble motto
              <em className="text-amber-300 font-serif"> &ldquo;Education for Peace and Progress&rdquo;</em>.
              Empowering engineers, innovators, and leaders with globally accredited education and cutting-edge industrial research.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="bg-blue-950 border border-blue-800/70 text-blue-200 text-xs px-2.5 py-1 rounded-md font-medium">
                NAAC &lsquo;A&rsquo; Grade
              </span>
              <span className="bg-blue-950 border border-blue-800/70 text-blue-200 text-xs px-2.5 py-1 rounded-md font-medium">
                NBA Accredited
              </span>
              <span className="bg-blue-950 border border-blue-800/70 text-blue-200 text-xs px-2.5 py-1 rounded-md font-medium">
                AICTE Approved
              </span>
              <span className="bg-blue-950 border border-blue-800/70 text-blue-200 text-xs px-2.5 py-1 rounded-md font-medium">
                Affiliated to JNTUA
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About SREC
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-amber-400 transition-colors">
                  Academics & Regulations
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-amber-400 transition-colors">
                  Admissions 2026
                </Link>
              </li>
              <li>
                <Link href="/placements" className="hover:text-amber-400 transition-colors">
                  Training & Placements
                </Link>
              </li>
              <li>
                <Link href="/campus-life" className="hover:text-amber-400 transition-colors">
                  Campus Facilities & Life
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-amber-400 transition-colors">
                  Events & Circulars
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors font-medium text-amber-300">
                  Smart Campus Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Departments */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Departments</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/departments/cse" className="hover:text-amber-400 transition-colors">
                  Computer Science (CSE)
                </Link>
              </li>
              <li>
                <Link href="/departments/csm" className="hover:text-amber-400 transition-colors">
                  CSE (AI & ML)
                </Link>
              </li>
              <li>
                <Link href="/departments/csd" className="hover:text-amber-400 transition-colors">
                  CSE (Data Science)
                </Link>
              </li>
              <li>
                <Link href="/departments/ece" className="hover:text-amber-400 transition-colors">
                  Electronics & Comm. (ECE)
                </Link>
              </li>
              <li>
                <Link href="/departments/eee" className="hover:text-amber-400 transition-colors">
                  Electrical & Electronics (EEE)
                </Link>
              </li>
              <li>
                <Link href="/departments/mba" className="hover:text-amber-400 transition-colors">
                  Management Studies (MBA)
                </Link>
              </li>
              <li>
                <Link href="/departments/mca" className="hover:text-amber-400 transition-colors">
                  Computer Apps (MCA)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  NH-40, Nerawada, Nandyal &ndash; 518501, Andhra Pradesh, India.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919866308475" className="hover:text-amber-300">
                  +91-9866308475
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:principal@srecnandyal.edu.in" className="hover:text-amber-300">
                  principal@srecnandyal.edu.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon &ndash; Sat: 09:00 AM &ndash; 05:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Santhiram Engineering College (Autonomous), Nandyal. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/about" className="hover:text-slate-400">Terms of Service</Link>
            <span>&bull;</span>
            <span className="text-slate-400 flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> SREC Smart Campus
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
