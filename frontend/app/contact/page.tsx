'use client';

import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send,
  CheckCircle2, Building, MessageSquare
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Admissions',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full">
            Campus Directory & Information Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Contact SREC Nandyal
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            Reach out to our administrative, admissions, or department offices. We are here to answer your queries.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Info & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Official Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-[#0B2545]">Administrative Office</h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Campus Address</div>
                    <div className="text-slate-600">
                      Santhiram Engineering College (Autonomous),<br />
                      NH-40, Nerawada Village, Nandyal &ndash; 518501,<br />
                      Andhra Pradesh, India.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                  <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Telephone / Mobile</div>
                    <div className="text-slate-600">+91-9866308475</div>
                    <div className="text-slate-500 text-xs">Office Hours: 09:00 AM - 05:00 PM</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                  <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Principal & Official Email</div>
                    <a href="mailto:principal@srecnandyal.edu.in" className="text-blue-700 hover:underline">
                      principal@srecnandyal.edu.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900">Working Days</div>
                    <div className="text-slate-600">Monday to Saturday: 09:00 AM &ndash; 05:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Directory Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Department Inquiries</h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Admissions Cell:</span>
                  <span className="font-mono text-slate-400">admissions@srecnandyal.edu.in</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>CSE & Allied Branches:</span>
                  <span className="font-mono text-slate-400">hodcse@srecnandyal.edu.in</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Training & Placement:</span>
                  <span className="font-mono text-slate-400">placements@srecnandyal.edu.in</span>
                </div>
                <div className="flex justify-between">
                  <span>Examination Cell:</span>
                  <span className="font-mono text-slate-400">ce@srecnandyal.edu.in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-[#0B2545]">Send Us an Inquiry</h2>
                <p className="text-xs text-slate-500">
                  Fill out the form below and our administrative team will get back to you within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="text-base font-bold text-emerald-900">Message Received!</div>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Thank you, <b>{form.name}</b>. Your inquiry regarding {form.department} has been forwarded to the college administration.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="your.email@domain.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Inquiry Regarding</label>
                      <select
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50"
                      >
                        <option>General Admissions & Eligibility</option>
                        <option>Computer Science & Engineering</option>
                        <option>AI & Machine Learning (CSM)</option>
                        <option>Electronics & Communication (ECE)</option>
                        <option>Hostel & Campus Facilities</option>
                        <option>Placements & Corporate Relations</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please provide details of your question..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-hidden bg-slate-50/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0B2545] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-transform hover:scale-[1.01] active:scale-95 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Submit Inquiry</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Location Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Campus Location Map</h3>
            <span className="text-xs text-slate-500 font-mono">NH-40, Nerawada, Nandyal, AP</span>
          </div>
          <div className="w-full h-80 rounded-xl overflow-hidden bg-slate-100 relative">
            <iframe
              src="https://maps.google.com/maps?q=Santhiram%20Engineering%20College%20Nandyal&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              title="SREC College Google Map"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
