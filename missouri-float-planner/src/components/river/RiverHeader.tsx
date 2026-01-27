'use client';

// src/components/river/RiverHeader.tsx
// River header with at-a-glance navigability status
// Neo-Brutalist style with Eddy the Otter palette

import { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';
import type { RiverWithDetails, RiverCondition } from '@/types/api';

interface RiverHeaderProps {
  river: RiverWithDetails;
  condition: RiverCondition | null;
}

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Dismiss on any click outside
  useEffect(() => {
    if (!show) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => { clearTimeout(timer); document.removeEventListener('click', handleClick); };
  }, [show]);

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        onClick={(e) => { e.stopPropagation(); setShow(!show); }}
        className="ml-1 p-0.5 opacity-50 hover:opacity-80 transition-opacity"
        aria-label="More info"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {show && (
        <span
          className="absolute bottom-full right-0 mb-2 px-3 py-1.5 text-xs text-white rounded-lg shadow-lg max-w-[200px] z-50"
          style={{
            backgroundColor: '#22222C',
            border: '2px solid #5757B7',
            boxShadow: '2px 2px 0 #22222C',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

export default function RiverHeader({ river, condition }: RiverHeaderProps) {
  return (
    <div className="text-white" style={{ backgroundColor: '#161748' }}>
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
          {/* Left: River Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white">{river.name}</h1>
            {river.description && (
              <p className="text-base md:text-lg mb-3 md:mb-4" style={{ color: '#ABABDB' }}>{river.description}</p>
            )}

            {/* River Stats — Neo-Brutalist pill badges */}
            <div className="flex flex-wrap gap-3 md:gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span style={{ color: '#39A0CA' }}>Length:</span>
                <span className="font-bold text-white">{river.lengthMiles.toFixed(1)} mi</span>
              </div>
              {river.region && (
                <div className="flex items-center gap-1.5">
                  <span style={{ color: '#39A0CA' }}>Region:</span>
                  <span className="font-bold text-white">{river.region}</span>
                </div>
              )}
              {river.difficultyRating && (
                <div className="flex items-center gap-1.5">
                  <span style={{ color: '#39A0CA' }}>Difficulty:</span>
                  <span className="font-bold text-white">{river.difficultyRating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Gauge Summary (desktop) — Neo-Brutalist card */}
          {condition && (
            <div
              className="hidden md:block rounded-xl px-4 py-3 min-w-[200px]"
              style={{
                backgroundColor: '#222260',
                border: '3px solid #22222C',
                boxShadow: '3px 3px 0 #22222C',
              }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: '#478559' }}>USGS Gauge</p>
              {condition.gaugeName && (
                <p className="text-sm font-bold mb-2 text-white">{condition.gaugeName}</p>
              )}
              <div className="space-y-1">
                {condition.gaugeHeightFt !== null && (
                  <div className="flex justify-between text-sm gap-4">
                    <span className="flex items-center" style={{ color: '#39A0CA' }}>
                      Stage
                      <InfoTooltip text="Water height at the gauge station" />
                    </span>
                    <span className="font-bold text-white">{condition.gaugeHeightFt.toFixed(2)} ft</span>
                  </div>
                )}
                {condition.dischargeCfs !== null && (
                  <div className="flex justify-between text-sm gap-4">
                    <span className="flex items-center" style={{ color: '#39A0CA' }}>
                      Flow
                      <InfoTooltip text="Water volume in cubic feet per second" />
                    </span>
                    <span className="font-bold text-white">{condition.dischargeCfs.toLocaleString()} cfs</span>
                  </div>
                )}
              </div>
              {condition.readingAgeHours !== null && condition.readingAgeHours < 24 && (
                <p className="text-xs font-bold mt-2" style={{ color: '#478559' }}>
                  Updated {Math.round(condition.readingAgeHours)}h ago
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mobile Gauge Bar — Neo-Brutalist */}
        {condition && (
          <div
            className="md:hidden mt-4 rounded-lg px-3 py-3"
            style={{
              backgroundColor: '#222260',
              border: '3px solid #22222C',
              boxShadow: '2px 2px 0 #22222C',
            }}
          >
            {/* Row 1: Gauge name */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded"
                style={{ color: '#478559', backgroundColor: 'rgba(71, 133, 89, 0.15)', border: '1px solid #478559' }}
              >
                USGS
              </span>
              {condition.gaugeName && (
                <span className="text-sm font-bold text-white">{condition.gaugeName}</span>
              )}
            </div>

            {/* Row 2: Stats */}
            <div className="flex items-center gap-4">
              {condition.gaugeHeightFt !== null && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs" style={{ color: '#39A0CA' }}>Stage</span>
                  <InfoTooltip text="Water height at the gauge station" />
                  <span className="text-base font-bold text-white tabular-nums">{condition.gaugeHeightFt.toFixed(2)}</span>
                  <span className="text-xs text-white/50">ft</span>
                </div>
              )}
              {condition.dischargeCfs !== null && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs" style={{ color: '#39A0CA' }}>Flow</span>
                  <InfoTooltip text="Water volume in cubic feet per second" />
                  <span className="text-base font-bold text-white tabular-nums">{condition.dischargeCfs.toLocaleString()}</span>
                  <span className="text-xs text-white/50">cfs</span>
                </div>
              )}
              {condition.readingAgeHours !== null && condition.readingAgeHours < 24 && (
                <span className="ml-auto text-[10px] font-bold" style={{ color: '#478559' }}>
                  {Math.round(condition.readingAgeHours)}h ago
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
