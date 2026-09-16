'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2, MapPin, Info, CheckCircle2,
  Compass, Eye, Layers, X, ArrowRight, BookOpen, Trophy, Coffee, Users
} from 'lucide-react';

interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  category: 'ACADEMIC' | 'ADMIN' | 'LAB' | 'LIBRARY' | 'RESIDENTIAL' | 'SPORTS' | 'AMENITY';
  description: string;
  departments: string[];
  facilities: string[];
  floors: number;
  position: { x: number; y: number }; // Percentage coordinates for 2.5D map
  image?: string;
}

const CAMPUS_BUILDINGS: CampusBuilding[] = [
  {
    id: 'admin',
    name: 'Main Academic & Administrative Quadrangle',
    code: 'ADMIN-01',
    category: 'ADMIN',
    description: 'Iconic four-tier collegiate quadrangle building featuring grand arched colonnades, heritage roof cupolas, and an expansive palm-shaded central courtyard. Houses the Principal’s Office, Chairman’s Secretariat, Autonomous Examination Cell, and central administrative suites.',
    departments: ['Central Administration', 'Autonomous Examination Cell', 'Academic Affairs'],
    facilities: ['Air-Conditioned Council Room', 'Student Affairs Desk', 'Central Palm Courtyard', 'High-Speed Wi-Fi'],
    floors: 4,
    position: { x: 50, y: 70 },
    image: '/images/srec_real_campus.jpg',
  },
  {
    id: 'cs-block',
    name: 'Sir Visvesvaraya Computing Complex',
    code: 'CS-BLOCK',
    category: 'ACADEMIC',
    description: 'Premier computing complex housing the departments of Computer Science & Engineering (CSE), AI & Machine Learning (CSM), and Data Science (CSD).',
    departments: ['CSE', 'CSE (AI & ML)', 'CSE (Data Science)'],
    facilities: ['AI/ML GPU Lab', 'Cloud Innovation Center', 'Smart Projector Classrooms', 'Faculty Cabins'],
    floors: 4,
    position: { x: 28, y: 48 },
  },
  {
    id: 'ece-block',
    name: 'APJ Abdul Kalam Electronics & Electrical Block',
    code: 'EE-BLOCK',
    category: 'ACADEMIC',
    description: 'Home to the NBA-accredited Electronics & Communication (ECE) and Electrical & Electronics (EEE) departments.',
    departments: ['ECE', 'EEE'],
    facilities: ['Cadence VLSI Suite', 'Texas Instruments Embedded Center', 'Power Systems Lab', 'Robotics Hub'],
    floors: 3,
    position: { x: 72, y: 48 },
  },
  {
    id: 'library',
    name: 'Dr. B.R. Ambedkar Central Library',
    code: 'LIB-01',
    category: 'LIBRARY',
    description: 'Comprehensive academic knowledge center spanning over 45,000 volumes, IEEE digital access, and a 60-computer digital repository.',
    departments: ['Central Learning Resource'],
    facilities: ['Digital Library', 'Quiet Study Halls', 'DELNET Journal Access', 'Reference Section'],
    floors: 2,
    position: { x: 50, y: 38 },
  },
  {
    id: 'labs',
    name: 'Ramanujan Advanced Computing & Data Labs',
    code: 'LAB-COMPLEX',
    category: 'LAB',
    description: 'Centralized computational research facility with 500+ interconnected workstations running Linux, Python, and PostgreSQL vector engines.',
    departments: ['Cross-Department Computing'],
    facilities: ['High-Performance GPU Clusters', 'Cybersecurity Sandbox', '24/7 Power Backup', 'Gigabit Fiber'],
    floors: 2,
    position: { x: 30, y: 25 },
    image: '/images/computing_lab.jpg',
  },
  {
    id: 'hostels',
    name: 'Student Residential Hostels (Boys & Girls)',
    code: 'HOSTEL-BLOCKS',
    category: 'RESIDENTIAL',
    description: 'Separate multi-story residential wings equipped with dining halls, recreation centers, solar hot water, and biometric security.',
    departments: ['Student Housing & Residence'],
    facilities: ['24/7 Security', 'Hygienic Mess', 'Recreation Room', 'RO Purified Drinking Water'],
    floors: 4,
    position: { x: 80, y: 20 },
  },
  {
    id: 'sports',
    name: 'SREC Sports Pavilion & Athletics Ground',
    code: 'SPORTS-01',
    category: 'SPORTS',
    description: 'Full-size cricket stadium, volleyball courts, basketball court, indoor badminton stadium, and modern gymnasium.',
    departments: ['Physical Education'],
    facilities: ['Cricket Ground', 'Indoor Badminton Courts', 'Fitness Gymnasium', 'Floodlit Arena'],
    floors: 1,
    position: { x: 20, y: 75 },
  },
  {
    id: 'canteen',
    name: 'Student Cafeteria & Amenities Center',
    code: 'CANTEEN-01',
    category: 'AMENITY',
    description: 'Spacious food court serving fresh meals, snacks, stationery store, and student lounge area.',
    departments: ['Campus Amenities'],
    facilities: ['Hygienic Kitchen', 'Outdoor Seating', 'Stationery Store', 'Digital Payments'],
    floors: 1,
    position: { x: 75, y: 75 },
  },
];

export default function CampusMapPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(CAMPUS_BUILDINGS[0]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'interactive' | 'list'>('interactive');

  const filteredBuildings =
    filterCategory === 'ALL'
      ? CAMPUS_BUILDINGS
      : CAMPUS_BUILDINGS.filter((b) => b.category === filterCategory);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-3 py-1 rounded-full">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Campus Navigator &bull; 40-Acre Masterplan</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            SREC Interactive Campus Experience
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            Explore our academic blocks, innovation laboratories, central library, sports complex, and residential hostels with interactive location pins.
          </p>
        </div>
      </section>

      {/* Control Bar: Categories & View Mode */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'ACADEMIC', 'ADMIN', 'LAB', 'LIBRARY', 'RESIDENTIAL', 'SPORTS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Toggle (Interactive vs List) */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              viewMode === 'interactive' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            2.5D Visual Map
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Directory Grid
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {viewMode === 'interactive' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual 2.5D Campus Map Canvas */}
            <div className="lg:col-span-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 relative min-h-[480px] sm:min-h-[580px] overflow-hidden">
              {/* Campus Grid Pattern Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />

              {/* Highway Label */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                National Highway 40 (NH-40) Main Entrance Gate
              </div>

              {/* Central Green Campus Lawn Visual */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 bg-emerald-950/40 rounded-full blur-xl pointer-events-none border border-emerald-500/10" />

              {/* Building Interactive Nodes */}
              {filteredBuildings.map((building) => {
                const isSelected = selectedBuilding?.id === building.id;
                return (
                  <button
                    key={building.id}
                    onClick={() => setSelectedBuilding(building)}
                    style={{
                      left: `${building.position.x}%`,
                      top: `${building.position.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl shadow-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40'
                          : 'bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20'
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>

                    {/* Node Label Tooltip */}
                    <div
                      className={`mt-1 text-[11px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap pointer-events-none transition-opacity ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 opacity-100'
                          : 'bg-slate-900/90 text-slate-200 opacity-80 group-hover:opacity-100'
                      }`}
                    >
                      {building.name.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Building Detail Card */}
            <div className="lg:col-span-4">
              {selectedBuilding ? (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-in fade-in">
                  <div className="space-y-1 border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black bg-blue-100 text-blue-900 px-2.5 py-1 rounded-md">
                        {selectedBuilding.code}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">
                        {selectedBuilding.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 pt-1">
                      {selectedBuilding.name}
                    </h3>
                  </div>

                  {selectedBuilding.image && (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
                      <img
                        src={selectedBuilding.image}
                        alt={selectedBuilding.name}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3 text-white">
                        <span className="text-[11px] font-bold">
                          {selectedBuilding.id === 'admin' ? 'Official Campus Quadrangle' : 'Advanced Lab Suite'}
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedBuilding.description}
                  </p>

                  {/* Associated Departments */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900">Departments & Programs:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedBuilding.departments.map((dept, i) => (
                        <span key={i} className="bg-blue-50 text-blue-900 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-200">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Facilities list */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900">Facilities Available:</div>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      {selectedBuilding.facilities.map((fac, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Floors: <b>{selectedBuilding.floors} Levels</b></span>
                    <Link
                      href="/contact"
                      className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <span>Campus Visit Directions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-400 text-sm">
                  Click any building pin on the map to inspect details.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Directory Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuildings.map((building) => (
              <div key={building.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                    {building.code}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded uppercase">
                    {building.category}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{building.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{building.description}</p>
                <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-2">
                  <div><b>Departments:</b> {building.departments.join(', ')}</div>
                  <div><b>Floors:</b> {building.floors} Levels</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
