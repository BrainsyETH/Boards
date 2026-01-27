'use client';

// src/components/layout/SiteHeader.tsx
// Global site header with Eddy the Otter branding and river navigation
// Neo-Brutalist style: thick borders, flat Adventure Night background

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Waves, Menu, X, ChevronDown } from 'lucide-react';
import { useRivers } from '@/hooks/useRivers';
import type { ConditionCode } from '@/types/api';

// Matches GaugeOverview colors
const conditionColors: Record<ConditionCode, string> = {
  optimal: 'bg-emerald-500',
  low: 'bg-lime-500',
  very_low: 'bg-yellow-500',
  high: 'bg-orange-500',
  too_low: 'bg-neutral-400',
  dangerous: 'bg-red-600',
  unknown: 'bg-neutral-400',
};

export default function SiteHeader() {
  const pathname = usePathname();
  const { data: rivers } = useRivers();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine active river from URL
  const activeRiverSlug = pathname.startsWith('/rivers/')
    ? pathname.split('/')[2]
    : null;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const activeRiver = rivers?.find(r => r.slug === activeRiverSlug);

  return (
    <header
      className="sticky top-0 z-50 border-b-4 border-neutral-900"
      style={{ backgroundColor: '#161748' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo — Neo-Brutalist with chunky accent box */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div
              className="w-8 h-8 rounded-md border-3 flex items-center justify-center"
              style={{
                backgroundColor: '#F07052',
                borderWidth: '3px',
                borderColor: '#22222C',
                boxShadow: '2px 2px 0 #22222C',
              }}
            >
              <Waves className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-heading font-bold text-white tracking-tight">
              Eddy
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Rivers dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${
                  activeRiverSlug
                    ? 'text-white bg-white/10 border-2 border-white/20'
                    : 'text-primary-200 hover:text-white hover:bg-white/10 border-2 border-transparent'
                }`}
              >
                <span>{activeRiver ? activeRiver.name : 'Rivers'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-72 bg-white rounded-lg overflow-hidden animate-in"
                  style={{
                    border: '4px solid #22222C',
                    boxShadow: '4px 4px 0 #22222C',
                  }}
                >
                  <div className="py-1">
                    {rivers?.map((river) => (
                      <Link
                        key={river.id}
                        href={`/rivers/${river.slug}`}
                        className={`block px-4 py-3 hover:bg-neutral-50 transition-colors no-underline ${
                          river.slug === activeRiverSlug ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-900">{river.name}</span>
                              {river.currentCondition && (
                                <span
                                  className={`w-2.5 h-2.5 rounded-full border border-neutral-900 ${conditionColors[river.currentCondition.code]}`}
                                  title={river.currentCondition.label}
                                />
                              )}
                            </div>
                            <span className="text-xs text-neutral-500 font-medium">
                              {river.lengthMiles.toFixed(1)} mi &middot; {river.region} &middot; {river.difficultyRating}
                            </span>
                          </div>
                          {river.slug === activeRiverSlug && (
                            <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#F07052' }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-primary-200 hover:text-white hover:bg-white/10 transition-colors border-2 border-transparent hover:border-white/20"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — Adventure Night dark */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t-2 border-white/10"
          style={{ backgroundColor: '#0F0F30' }}
        >
          <div className="px-4 py-3">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: '#39A0CA' }}
            >
              Rivers
            </p>
            <div className="space-y-0.5">
              {rivers?.map((river) => (
                <Link
                  key={river.id}
                  href={`/rivers/${river.slug}`}
                  className={`flex items-center justify-between px-3 py-3 rounded-md no-underline transition-colors ${
                    river.slug === activeRiverSlug
                      ? 'bg-white/10 text-white border-2 border-accent-500'
                      : 'text-primary-200 hover:bg-white/5 hover:text-white border-2 border-transparent'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{river.name}</span>
                      {river.currentCondition && (
                        <span
                          className={`w-2.5 h-2.5 rounded-full border border-white/30 ${conditionColors[river.currentCondition.code]}`}
                        />
                      )}
                    </div>
                    <span className="text-xs" style={{ color: '#39A0CA' }}>
                      {river.lengthMiles.toFixed(1)} mi &middot; {river.difficultyRating}
                    </span>
                  </div>
                  {river.slug === activeRiverSlug && (
                    <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
