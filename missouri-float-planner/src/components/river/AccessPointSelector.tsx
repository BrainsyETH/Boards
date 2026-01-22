'use client';

// src/components/river/AccessPointSelector.tsx
// Dropdown selector for access points

import { useState, useRef, useEffect } from 'react';
import type { AccessPoint } from '@/types/api';

interface AccessPointSelectorProps {
  accessPoints: AccessPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  placeholder?: string;
  excludeId?: string | null;
}

export default function AccessPointSelector({
  accessPoints,
  selectedId,
  onSelect,
  placeholder = 'Select access point...',
  excludeId,
}: AccessPointSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPoint = accessPoints.find((p) => p.id === selectedId);
  const filteredPoints = excludeId
    ? accessPoints.filter((p) => p.id !== excludeId)
    : accessPoints;

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
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-bluff-200 rounded-xl 
                   shadow-card hover:shadow-card-hover hover:border-river-400
                   flex items-center justify-between gap-3 transition-all duration-200"
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          {selectedPoint ? (
            <>
              <span className="text-xl">
                {selectedPoint.type === 'boat_ramp' ? '🚤' : 
                 selectedPoint.type === 'campground' ? '🏕️' : 
                 selectedPoint.type === 'bridge' ? '🌉' : '📍'}
              </span>
              <div>
                <p className="font-medium text-ozark-800">{selectedPoint.name}</p>
                <p className="text-sm text-bluff-500">
                  Mile {selectedPoint.riverMile.toFixed(1)} • {selectedPoint.type.replace('_', ' ')}
                </p>
              </div>
            </>
          ) : (
            <span className="text-bluff-500">{placeholder}</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-bluff-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
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
            {filteredPoints.length === 0 ? (
              <div className="px-4 py-3 text-sm text-bluff-500 text-center">
                No access points available
              </div>
            ) : (
              filteredPoints.map((point) => (
                <button
                  key={point.id}
                  onClick={() => {
                    onSelect(point.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-river-50 transition-colors
                             ${point.id === selectedId ? 'bg-river-50' : ''}`}
                >
                  <span className="text-xl flex-shrink-0">
                    {point.type === 'boat_ramp' ? '🚤' : 
                     point.type === 'campground' ? '🏕️' : 
                     point.type === 'bridge' ? '🌉' : '📍'}
                  </span>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-ozark-800">{point.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-bluff-500">
                        Mile {point.riverMile.toFixed(1)}
                      </span>
                      <span className="text-bluff-300">•</span>
                      <span className="text-sm text-bluff-500">
                        {point.type.replace('_', ' ')}
                      </span>
                      {point.feeRequired && (
                        <>
                          <span className="text-bluff-300">•</span>
                          <span className="text-xs text-sunset-600">Fee Required</span>
                        </>
                      )}
                    </div>
                  </div>
                  {point.id === selectedId && (
                    <svg className="w-5 h-5 text-river-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
