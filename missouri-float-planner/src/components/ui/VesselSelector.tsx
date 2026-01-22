'use client';

// src/components/ui/VesselSelector.tsx
// Themed vessel type selector with icons

import type { VesselType } from '@/types/api';

interface VesselSelectorProps {
  vesselTypes: VesselType[];
  selectedVesselTypeId: string | null;
  onSelect: (vesselTypeId: string) => void;
  className?: string;
}

// Custom SVG icons for each vessel type
const VesselIcon = ({ type, className = '' }: { type: string; className?: string }) => {
  switch (type) {
    case 'kayak':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 12c0 0 4-6 10-6s10 6 10 6-4 6-10 6-10-6-10-6z" />
          <path d="M12 6v12" />
          <circle cx="12" cy="10" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'canoe':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 14c0 0 4-8 10-8s10 8 10 8-4 4-10 4-10-4-10-4z" />
          <path d="M7 10v4" />
          <path d="M17 10v4" />
        </svg>
      );
    case 'raft':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="8" width="18" height="8" rx="4" />
          <path d="M7 8v8" />
          <path d="M12 8v8" />
          <path d="M17 8v8" />
        </svg>
      );
    case 'tube':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 12c0 0 4-6 10-6s10 6 10 6-4 6-10 6-10-6-10-6z" />
        </svg>
      );
  }
};

export default function VesselSelector({
  vesselTypes,
  selectedVesselTypeId,
  onSelect,
  className = '',
}: VesselSelectorProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {vesselTypes.map((vessel) => {
        const isSelected = vessel.id === selectedVesselTypeId;
        return (
          <button
            key={vessel.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(vessel.id);
            }}
            type="button"
            title={vessel.description}
            aria-pressed={isSelected}
            className={`
              group flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-river-500 focus:ring-offset-2
              ${
                isSelected
                  ? 'border-river-500 bg-river-50 text-river-700 shadow-glow'
                  : 'border-bluff-200 bg-white/80 text-bluff-600 hover:border-river-300 hover:bg-river-50/50'
              }
            `}
          >
            <VesselIcon
              type={vessel.slug}
              className={`w-6 h-6 transition-colors flex-shrink-0 ${
                isSelected ? 'text-river-600' : 'text-bluff-400 group-hover:text-river-500'
              }`}
            />
            <span className="font-medium">{vessel.name}</span>
          </button>
        );
      })}
    </div>
  );
}
