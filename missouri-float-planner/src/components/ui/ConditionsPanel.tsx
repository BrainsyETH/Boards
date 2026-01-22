'use client';

// src/components/ui/ConditionsPanel.tsx
// Display current river conditions

import { useConditions } from '@/hooks/useConditions';
import LoadingSpinner from './LoadingSpinner';
import type { ConditionCode } from '@/types/api';

interface ConditionsPanelProps {
  riverId: string | null;
  className?: string;
}

const conditionStyles: Record<ConditionCode, { bg: string; text: string; icon: string; label: string }> = {
  optimal: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '✓', label: 'Optimal' },
  low: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '↓', label: 'Low' },
  very_low: { bg: 'bg-orange-100', text: 'text-orange-700', icon: '⚠', label: 'Very Low' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', icon: '↑', label: 'High' },
  too_low: { bg: 'bg-red-100', text: 'text-red-700', icon: '✕', label: 'Too Low' },
  dangerous: { bg: 'bg-red-200', text: 'text-red-800', icon: '⚠', label: 'Dangerous' },
  unknown: { bg: 'bg-bluff-100', text: 'text-bluff-600', icon: '?', label: 'Unknown' },
};

export default function ConditionsPanel({ riverId, className = '' }: ConditionsPanelProps) {
  const { data: condition, isLoading, error } = useConditions(riverId);

  if (!riverId) {
    return (
      <div className={`glass-card rounded-xl p-4 ${className}`}>
        <p className="text-sm text-bluff-500">Select a river to see conditions</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`glass-card rounded-xl p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <LoadingSpinner size="sm" />
          <p className="text-sm text-bluff-500">Loading conditions...</p>
        </div>
      </div>
    );
  }

  if (error || !condition) {
    return (
      <div className={`glass-card rounded-xl p-4 ${className}`}>
        <p className="text-sm text-red-600">Unable to load conditions</p>
      </div>
    );
  }

  const style = conditionStyles[condition.code];

  return (
    <div className={`glass-card rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ozark-800">Current Conditions</h3>
        <span className="text-xs text-bluff-500">
          {condition.readingAgeHours !== null && condition.readingAgeHours < 24
            ? `${Math.round(condition.readingAgeHours)}h ago`
            : 'Updated'}
        </span>
      </div>

      <div className={`rounded-lg p-3 ${style.bg}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{style.icon}</span>
          <p className={`font-semibold ${style.text}`}>{condition.label}</p>
        </div>

        {condition.gaugeHeightFt !== null && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className={`text-xs ${style.text} opacity-75`}>Gauge Height</span>
              <span className={`text-sm font-bold ${style.text}`}>
                {condition.gaugeHeightFt.toFixed(2)} ft
              </span>
            </div>
            {condition.dischargeCfs !== null && (
              <div className="flex justify-between items-center">
                <span className={`text-xs ${style.text} opacity-75`}>Discharge</span>
                <span className={`text-sm font-bold ${style.text}`}>
                  {condition.dischargeCfs.toLocaleString()} cfs
                </span>
              </div>
            )}
            {condition.gaugeName && (
              <p className={`text-xs ${style.text} opacity-60 mt-1`}>
                {condition.gaugeName}
              </p>
            )}
          </div>
        )}

        {condition.accuracyWarning && condition.accuracyWarningReason && (
          <div className="mt-2 pt-2 border-t border-current border-opacity-20">
            <p className={`text-xs ${style.text} opacity-80`}>
              ⚠ {condition.accuracyWarningReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
