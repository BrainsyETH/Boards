'use client';

// src/components/plan/PlanSummary.tsx
// Themed float plan summary panel

import type { FloatPlan, ConditionCode } from '@/types/api';

interface PlanSummaryProps {
  plan: FloatPlan | null;
  isLoading: boolean;
  onClose: () => void;
  onShare: () => void;
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

export default function PlanSummary({
  plan,
  isLoading,
  onClose,
  onShare,
}: PlanSummaryProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 w-80 animate-in">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-bluff-200 rounded-lg w-2/3"></div>
          <div className="h-4 bg-bluff-200 rounded w-full"></div>
          <div className="h-4 bg-bluff-200 rounded w-3/4"></div>
          <div className="h-20 bg-river-100 rounded-xl"></div>
          <div className="h-12 bg-bluff-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  const conditionStyle = conditionStyles[plan.condition.code];

  return (
    <div className="glass-card rounded-2xl w-80 max-h-[85vh] overflow-hidden animate-slide-in-right">
      {/* Header */}
      <div className="bg-gradient-to-r from-ozark-800 to-ozark-700 px-5 py-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold">Your Float Plan</h2>
            <p className="text-river-300 text-sm mt-0.5">{plan.river.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
        {/* Put-in / Take-out */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-river-100 flex items-center justify-center flex-shrink-0">
              <span className="text-river-600">🚩</span>
            </div>
            <div>
              <p className="text-xs font-medium text-bluff-500 uppercase tracking-wide">Put-in</p>
              <p className="font-semibold text-ozark-800">{plan.putIn.name}</p>
              <p className="text-sm text-bluff-500">Mile {plan.putIn.riverMile.toFixed(1)}</p>
            </div>
          </div>
          
          {/* Connector line */}
          <div className="ml-4 border-l-2 border-dashed border-river-200 h-4"></div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-sunset-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sunset-600">🏁</span>
            </div>
            <div>
              <p className="text-xs font-medium text-bluff-500 uppercase tracking-wide">Take-out</p>
              <p className="font-semibold text-ozark-800">{plan.takeOut.name}</p>
              <p className="text-sm text-bluff-500">Mile {plan.takeOut.riverMile.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Distance */}
          <div className="bg-bluff-50 rounded-xl p-3">
            <p className="text-xs font-medium text-bluff-500 uppercase tracking-wide">Distance</p>
            <p className="text-xl font-bold text-ozark-800">{plan.distance.formatted}</p>
          </div>

          {/* Float Time */}
          <div className="bg-river-50 rounded-xl p-3">
            <p className="text-xs font-medium text-river-600 uppercase tracking-wide">Float Time</p>
            {plan.floatTime ? (
              <>
                <p className="text-xl font-bold text-river-700">{plan.floatTime.formatted}</p>
                <p className="text-xs text-river-500">{plan.floatTime.speedMph} mph</p>
              </>
            ) : (
              <p className="text-sm text-red-600 font-medium">Not safe</p>
            )}
          </div>
        </div>

        {/* Drive Back */}
        <div className="bg-bluff-50 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-bluff-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-xs font-medium text-bluff-500 uppercase tracking-wide">Drive Back</p>
          </div>
          <p className="text-lg font-bold text-ozark-800">{plan.driveBack.formatted}</p>
          <p className="text-sm text-bluff-500">{plan.driveBack.miles.toFixed(1)} miles</p>
        </div>

        {/* Condition Badge */}
        <div className={`rounded-xl p-3 ${conditionStyle.bg}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{conditionStyle.icon}</span>
            <div>
              <p className={`font-semibold ${conditionStyle.text}`}>{plan.condition.label}</p>
              {plan.condition.gaugeHeightFt && (
                <p className={`text-sm ${conditionStyle.text} opacity-75`}>
                  Gauge: {plan.condition.gaugeHeightFt.toFixed(2)} ft
                </p>
              )}
            </div>
          </div>
          {plan.condition.accuracyWarning && (
            <p className="text-xs mt-2 text-orange-600 bg-orange-50 rounded-lg px-2 py-1">
              ⚠ {plan.condition.accuracyWarningReason}
            </p>
          )}
        </div>

        {/* Hazards */}
        {plan.hazards.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-2">
              ⚠ Hazards on Route
            </p>
            <ul className="space-y-1">
              {plan.hazards.map((hazard) => (
                <li key={hazard.id} className="text-sm text-amber-800">
                  <span className="font-medium">{hazard.name}</span>
                  <span className="text-amber-600"> - Mile {hazard.riverMile.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {plan.warnings.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <ul className="space-y-1">
              {plan.warnings.map((warning, idx) => (
                <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Vessel */}
        <div className="text-sm text-bluff-500 flex items-center gap-2">
          <span>🛶</span>
          <span>Estimated for {plan.vessel.name}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-bluff-200 p-4 bg-bluff-50/50">
        <div className="flex gap-2">
          <button onClick={onShare} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          <button onClick={onClose} className="btn-secondary px-4">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
