'use client';

// src/components/river/ConditionsBlock.tsx
// Conditions & Safety section with USGS data and trends

import { useConditions } from '@/hooks/useConditions';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { RiverCondition } from '@/types/api';

interface ConditionsBlockProps {
  riverId: string;
  condition: RiverCondition | null;
}

export default function ConditionsBlock({ riverId, condition }: ConditionsBlockProps) {
  const { data: currentCondition, isLoading } = useConditions(riverId);
  const displayCondition = currentCondition || condition;

  if (isLoading && !condition) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <LoadingSpinner size="sm" />
          <p className="text-sm text-bluff-500">Loading conditions...</p>
        </div>
      </div>
    );
  }

  if (!displayCondition) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-ozark-800 mb-4">Conditions & Safety</h3>
        <p className="text-sm text-bluff-500">Condition data not available at this time.</p>
      </div>
    );
  }

  // Determine trend (simplified - in production, would compare with historical data)
  const getTrend = () => {
    // For MVP, we'll show "Current" - can be enhanced with historical comparison
    return { label: 'Current', icon: '→', color: 'text-bluff-600' };
  };

  const trend = getTrend();
  const conditionColorClass = 
    displayCondition.code === 'optimal' ? 'bg-emerald-100 text-emerald-700' :
    displayCondition.code === 'low' || displayCondition.code === 'very_low' || displayCondition.code === 'too_low' ? 'bg-amber-100 text-amber-700' :
    displayCondition.code === 'high' ? 'bg-orange-100 text-orange-700' :
    displayCondition.code === 'dangerous' ? 'bg-red-100 text-red-700' :
    'bg-bluff-100 text-bluff-600';

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-ozark-800 mb-4">Conditions & Safety</h3>

      <div className="space-y-4">
        {/* Current Condition */}
        <div className={`rounded-xl p-4 ${conditionColorClass}`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Current Condition</h4>
            <span className="text-xs opacity-75">
              {displayCondition.readingAgeHours !== null && displayCondition.readingAgeHours < 24
                ? `Updated ${Math.round(displayCondition.readingAgeHours)}h ago`
                : 'Recent'}
            </span>
          </div>
          <p className="text-lg font-bold mb-3">{displayCondition.label}</p>

          {/* Gauge Data */}
          <div className="grid grid-cols-2 gap-3">
            {displayCondition.gaugeHeightFt !== null && (
              <div>
                <p className="text-xs opacity-75 mb-1">Gauge Height</p>
                <p className="text-xl font-bold">{displayCondition.gaugeHeightFt.toFixed(2)} ft</p>
              </div>
            )}
            {displayCondition.dischargeCfs !== null && (
              <div>
                <p className="text-xs opacity-75 mb-1">Discharge</p>
                <p className="text-xl font-bold">{displayCondition.dischargeCfs.toLocaleString()} cfs</p>
              </div>
            )}
          </div>

          {displayCondition.gaugeName && (
            <p className="text-xs mt-2 opacity-75">Gauge: {displayCondition.gaugeName}</p>
          )}
        </div>

        {/* Trend */}
        <div className="bg-bluff-50 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{trend.icon}</span>
            <div>
              <p className="text-xs text-bluff-600 mb-1">Trend</p>
              <p className="font-semibold text-ozark-800">{trend.label}</p>
            </div>
          </div>
          <p className="text-xs text-bluff-500 mt-2">
            Check USGS website for detailed historical trends
          </p>
        </div>

        {/* Safety Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-semibold text-amber-800 mb-2">Safety Reminders</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Always wear a life jacket</li>
            <li>• Check weather conditions before floating</li>
            <li>• Inform someone of your float plan</li>
            <li>• Bring adequate water and sun protection</li>
            <li>• Know your skill level and river difficulty</li>
          </ul>
        </div>

        {/* Accuracy Warning */}
        {displayCondition.accuracyWarning && displayCondition.accuracyWarningReason && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-sm text-orange-800">
              <span className="font-semibold">⚠ Warning:</span> {displayCondition.accuracyWarningReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
