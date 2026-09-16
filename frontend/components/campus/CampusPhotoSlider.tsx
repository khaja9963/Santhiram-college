'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Maximize2, X, Play, Pause,
  Sparkles, Camera
} from 'lucide-react';
import { assetUrl } from '@/lib/assets';

export interface CampusSlide {
  id: string;
  badge: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
}

export const SREC_CAMPUS_SLIDES: CampusSlide[] = [
  {
    id: 'quadrangle',
    badge: 'Historic Campus Landmark',
    category: 'Collegiate Quadrangle',
    title: 'Main Academic Quadrangle & Palm Courtyard',
    subtitle: 'Conceived with 4-tier classical collegiate architecture surrounding an inner lawn shaded by royal palm trees along NH-40, Nandyal.',
    image: assetUrl('/images/srec_real_campus.jpg'),
    alt: 'Santhiram Engineering College Iconic Quadrangle Campus, Nandyal',
  },
  {
    id: 'corridor',
    badge: 'Architectural Heritage',
    category: 'Arched Colonnades',
    title: 'Arcaded Balconies & Shaded Corridors',
    subtitle: 'Classic arched walkways engineered for natural cross-ventilation, overlooking the manicured central gardens and tranquil study courtyards.',
    image: assetUrl('/images/srec_corridor_arches.jpg'),
    alt: 'SREC Arched Colonnade Corridors and Royal Palms',
  },
  {
    id: 'entrance',
    badge: 'Autonomous Landmark',
    category: 'Monumental Gateway',
    title: 'Autonomous Campus Main Entrance Arch',
    subtitle: 'Grand red-stone architectural archway welcoming engineering scholars, industry dignitaries, and visitors along the NH-40 highway.',
    image: assetUrl('/images/srec_gate_arch.jpg'),
    alt: 'Santhiram Engineering College Autonomous Main Entrance Arch',
  },
  {
    id: 'lab',
    badge: 'Innovation & Research',
    category: 'Advanced Laboratories',
    title: 'Modern High-Tech Computing & AI Laboratory',
    subtitle: 'Spacious air-conditioned digital laboratories with 1,000+ networked terminals, GPU clusters, and modern software development tools.',
    image: assetUrl('/images/srec_lab_interior.jpg'),
    alt: 'SREC Advanced Computing, AI & Data Science Laboratory Suite',
  },
  {
    id: 'boulevard',
    badge: 'Panoramic Vista',
    category: '40-Acre Eco-Campus',
    title: 'Palm-Lined Boulevard & Aerial Campus Vista',
    subtitle: 'Expansive view of the 40+ acre green campus featuring tree-lined central avenues, sports grounds, and scenic Nandyal hills in the horizon.',
    image: assetUrl('/images/srec_aerial_boulevard.jpg'),
    alt: 'Panoramic Aerial View of SREC Palm Boulevard and Campus Grounds',
  },
];

interface CampusPhotoSliderProps {
  slides?: CampusSlide[];
  autoPlayInterval?: number;
  className?: string;
  showThumbnails?: boolean;
}

export default function CampusPhotoSlider({
  slides = SREC_CAMPUS_SLIDES,
  autoPlayInterval = 5000,
  className = '',
  showThumbnails = true,
}: CampusPhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const currentSlide = slides[currentIndex];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (!isPlaying || isHovered || isLightboxOpen) return;
    const timer = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, isLightboxOpen, autoPlayInterval, goToNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, isLightboxOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className={`relative flex flex-col w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-[380px] sm:h-[460px] lg:h-full min-h-[380px] lg:min-h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 group select-none shadow-2xl border border-white/10">
        <div
          key={currentSlide.id}
          className="relative w-full h-full cursor-pointer animate-in fade-in zoom-in-95 duration-500"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={assetUrl(currentSlide.image)}
            alt={currentSlide.alt}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
            <div className="bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-[11px] tracking-wide text-amber-300">
                Photo {currentIndex + 1} of {slides.length}
              </span>
              <span className="text-slate-400 text-[10px] hidden sm:inline">&bull; {currentSlide.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className="bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-white/20 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                aria-label={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-white/20 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 group/btn"
                title="Expand Full-Screen View"
                aria-label="Expand Full-Screen View"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-300 group-hover/btn:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent flex flex-col justify-end p-5 sm:p-7 space-y-2 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded shadow-sm tracking-wider">
                {currentSlide.badge}
              </span>
              <span className="text-amber-300 text-xs font-semibold drop-shadow-sm hidden sm:inline">
                SREC Nandyal &bull; Autonomous
              </span>
            </div>

            <div className="text-white font-black text-lg sm:text-2xl tracking-tight leading-snug drop-shadow-md">
              {currentSlide.title}
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl drop-shadow line-clamp-2 sm:line-clamp-3">
              {currentSlide.subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          title="Previous Photo"
          aria-label="Previous Photo"
        >
          <ChevronLeft className="w-5 h-5 text-amber-300" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          title="Next Photo"
          aria-label="Next Photo"
        >
          <ChevronRight className="w-5 h-5 text-amber-300" />
        </button>

        {isPlaying && !isHovered && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
            <div
              key={currentIndex}
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 animate-[progress_5s_linear_infinite]"
              style={{
                animationDuration: `${autoPlayInterval}ms`,
              }}
            />
          </div>
        )}
      </div>

      {showThumbnails && (
        <div className="mt-3.5 space-y-2.5">
          <div className="grid grid-cols-5 gap-2 px-1">
            {slides.map((s, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`relative rounded-xl overflow-hidden aspect-[4/3] transition-all duration-300 border-2 ${
                    isActive
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-102 shadow-md'
                      : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                  title={`View ${s.title}`}
                >
                  <img
                    src={assetUrl(s.image)}
                    alt={s.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-amber-500/10' : 'bg-slate-950/30'}`} />
                  <span className="absolute bottom-1 right-1 bg-slate-950/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-amber-400 shadow-xs'
                    : 'w-1.5 bg-slate-400/40 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-lg animate-in fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-6xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded">
                  {currentSlide.badge}
                </span>
                <span className="text-sm font-bold text-slate-200">
                  Photo {currentIndex + 1} of {slides.length} &bull; SREC Smart Campus
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full border border-white/20 transition-transform hover:scale-110 active:scale-95"
                title="Close Full-Screen View"
              >
                <X className="w-5 h-5 text-slate-200" />
              </button>
            </div>

            <div className="relative flex items-center justify-center bg-slate-950 min-h-[300px] max-h-[70vh] overflow-hidden">
              <img
                src={assetUrl(currentSlide.image)}
                alt={currentSlide.alt}
                className="w-full h-full max-h-[70vh] object-contain"
              />

              <button
                type="button"
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md shadow-xl transition-transform hover:scale-110"
                title="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6 text-amber-300" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 backdrop-blur-md shadow-xl transition-transform hover:scale-110"
                title="Next Photo"
              >
                <ChevronRight className="w-6 h-6 text-amber-300" />
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-slate-900 border-t border-white/10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="text-base sm:text-lg font-bold text-amber-300">
                  {currentSlide.title}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {currentSlide.subtitle}
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      idx === currentIndex
                        ? 'border-amber-400 ring-2 ring-amber-400/40'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
