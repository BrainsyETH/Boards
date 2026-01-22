'use client';

// src/components/ui/RiverSelector.tsx
// Themed dropdown component for selecting a river

import { useState, useRef, useEffect } from 'react';
import type { RiverListItem, ConditionCode } from '@/types/api';

interface RiverSelectorProps {
  rivers: RiverListItem[];
  selectedRiverId: string | null;
  onSelect: (riverId: string) => void;
  className?: string;
}

const conditionColors: Record<ConditionCode, string> = {
  optimal: 'bg-emerald-500',
  low: 'bg-amber-500',
  very_low: 'bg-orange-500',
  high: 'bg-orange-500',
  too_low: 'bg-red-500',
  dangerous: 'bg-red-600',
  unknown: 'bg-bluff-400',
};

export default function RiverSelector({
  rivers,
  selectedRiverId,
  onSelect,
  className = '',
}: RiverSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedRiver = rivers.find((r) => r.id === selectedRiverId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/90 backdrop-blur-md border border-bluff-200 rounded-xl 
                   shadow-card hover:shadow-card-hover hover:border-river-400
                   flex items-center justify-between gap-3 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌊</span>
          <div className="text-left">
            {selectedRiver ? (
              <>
                <p className="font-medium text-ozark-800">{selectedRiver.name}</p>
                <p className="text-sm text-bluff-500">
                  {selectedRiver.lengthMiles.toFixed(1)} miles • {selectedRiver.accessPointCount} access points
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-ozark-800">Select a River</p>
                <p className="text-sm text-bluff-500">Choose your floating adventure</p>
              </>
            )}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-bluff-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-md border border-bluff-200 
                        rounded-xl shadow-lg overflow-hidden animate-in">
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {rivers.map((river) => (
              <div
                key={river.id}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-river-50 transition-colors relative
                           ${river.id === selectedRiverId ? 'bg-river-50' : ''}`}
              >
                <button
                  onClick={() => {
                    onSelect(river.id);
                    setIsOpen(false);
                  }}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ozark-800">{river.name}</p>
                    {river.currentCondition && (
                      <span
                        className={`w-2 h-2 rounded-full ${conditionColors[river.currentCondition.code]}`}
                        title={river.currentCondition.label}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-bluff-500">
                      {river.lengthMiles.toFixed(1)} mi
                    </span>
                    <span className="text-bluff-300">•</span>
                    <span className="text-sm text-bluff-500">
                      {river.region}
                    </span>
                    <span className="text-bluff-300">•</span>
                    <span className="text-sm text-bluff-500">
                      {river.difficultyRating}
                    </span>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  {river.id === selectedRiverId && (
                    <svg className="w-5 h-5 text-river-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <a
                    href={`/rivers/${river.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 text-xs text-river-600 hover:text-river-700 hover:bg-river-100 rounded transition-colors"
                    title="View river page"
                  >
                    View →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
