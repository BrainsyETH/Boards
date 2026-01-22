'use client';

// src/components/river/RiverOverviewPanel.tsx
// River detail overview panel for selected river

import type { RiverWithDetails, RiverCondition, ConditionCode } from '@/types/api';

interface RiverOverviewPanelProps {
  river: RiverWithDetails | null;
  condition: RiverCondition | null;
  accessPointCount: number;
  onClear: () => void;
}

const conditionStyles: Record<ConditionCode, { bg: string; text: string; icon: string }> = {
  optimal: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '✓' },
  low: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '↓' },
  very_low: { bg: 'bg-orange-100', text: 'text-orange-700', icon: '⚠' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', icon: '↑' },
  too_low: { bg: 'bg-red-100', text: 'text-red-700', icon: '✕' },
  dangerous: { bg: 'bg-red-200', text: 'text-red-800', icon: '⚠' },
  unknown: { bg: 'bg-bluff-100', text: 'text-bluff-600', icon: '?' },
};

export default function RiverOverviewPanel({
  river,
  condition,
  accessPointCount,
  onClear,
}: RiverOverviewPanelProps) {
  if (!river) return null;

  const conditionStyle = condition ? conditionStyles[condition.code] : conditionStyles.unknown;

  return (
    <div className="glass-card rounded-2xl w-80 max-h-[80vh] overflow-hidden animate-slide-in-right">
      <div className="bg-gradient-to-r from-ozark-800 to-ozark-700 px-5 py-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold">{river.name}</h2>
            <p className="text-river-300 text-sm mt-0.5">Plan your float with live conditions</p>
          </div>
          <button
            onClick={onClear}
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label="Clear river selection"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bluff-50 rounded-xl p-3">
            <p className="text-xs font-medium text-bluff-500 uppercase tracking-wide">Length</p>
            <p className="text-xl font-bold text-ozark-800">{river.lengthMiles.toFixed(1)} mi</p>
          </div>
          <div className="bg-river-50 rounded-xl p-3">
            <p className="text-xs font-medium text-river-600 uppercase tracking-wide">Access Points</p>
            <p className="text-xl font-bold text-river-700">{accessPointCount}</p>
          </div>
        </div>

        <div className={`rounded-xl p-3 ${conditionStyle.bg}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{conditionStyle.icon}</span>
            <div>
              <p className={`font-semibold ${conditionStyle.text}`}>
                {condition?.label ?? 'Condition unavailable'}
              </p>
              {condition?.gaugeHeightFt !== null && condition?.gaugeHeightFt !== undefined && (
                <p className={`text-sm ${conditionStyle.text} opacity-75`}>
                  Stage: {condition.gaugeHeightFt.toFixed(2)} ft
                </p>
              )}
            </div>
          </div>
          {condition?.dischargeCfs !== null && condition?.dischargeCfs !== undefined && (
            <p className={`text-sm ${conditionStyle.text} opacity-75 mt-1`}>
              Flow: {condition.dischargeCfs.toLocaleString()} cfs
            </p>
          )}
          {condition?.readingTimestamp && (
            <p className="text-xs text-bluff-600 mt-1">
              Updated {new Date(condition.readingTimestamp).toLocaleString()}
            </p>
          )}
        </div>

        {river.description && (
          <div className="bg-bluff-50 rounded-xl p-3">
            <p className="text-xs font-medium text-bluff-500 uppercase tracking-wide mb-2">
              About this river
            </p>
            <p className="text-sm text-ozark-700">{river.description}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-bluff-600">
          {river.region && (
            <span className="px-3 py-1 rounded-full bg-bluff-100">Region: {river.region}</span>
          )}
          {river.difficultyRating && (
            <span className="px-3 py-1 rounded-full bg-river-100">
              Difficulty: {river.difficultyRating}
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-sunset-100">Tubing friendly</span>
          <span className="px-3 py-1 rounded-full bg-emerald-100">Dog friendly</span>
        </div>

        <div className="bg-amber-50 rounded-xl p-3">
          <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-2">
            Community notes
          </p>
          <p className="text-sm text-amber-800">
            No active warnings yet. Share updates about obstacles or closures with the community.
          </p>
        </div>
      </div>
    </div>
  );
}
