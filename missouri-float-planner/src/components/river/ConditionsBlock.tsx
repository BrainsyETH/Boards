'use client';

// src/components/river/ConditionsBlock.tsx
// Conditions & Safety section with USGS data, threshold-based ratings, and expandable details

import { useState } from 'react';
import type { RiverCondition, FlowRating } from '@/types/api';
import type { GaugeStation } from '@/hooks/useGaugeStations';
import CollapsibleSection from '@/components/ui/CollapsibleSection';
import FlowTrendChart from './FlowTrendChart';
import WeatherForecast from './WeatherForecast';

interface ConditionsBlockProps {
  riverId: string;
  riverSlug?: string;
  condition: RiverCondition | null;
  nearestGauge?: GaugeStation | null;
  hasPutInSelected?: boolean;
  isLoading?: boolean;
}

// Flow rating display configuration
const FLOW_RATING_CONFIG: Record<FlowRating, {
  emoji: string;
  bgClass: string;
  textClass: string;
  dotClass: string;
}> = {
  flood: { emoji: '🚫', bgClass: 'bg-red-50', textClass: 'text-red-700', dotClass: 'bg-red-500' },
  high: { emoji: '⚡', bgClass: 'bg-orange-50', textClass: 'text-orange-700', dotClass: 'bg-orange-500' },
  good: { emoji: '✓', bgClass: 'bg-emerald-50', textClass: 'text-emerald-700', dotClass: 'bg-emerald-500' },
  low: { emoji: '↓', bgClass: 'bg-lime-50', textClass: 'text-lime-700', dotClass: 'bg-lime-500' },
  poor: { emoji: '⚠', bgClass: 'bg-yellow-50', textClass: 'text-yellow-700', dotClass: 'bg-yellow-500' },
  unknown: { emoji: '?', bgClass: 'bg-neutral-50', textClass: 'text-neutral-600', dotClass: 'bg-neutral-400' },
};

// Combined title + advice per rating
const FLOW_RATING_INFO: Record<FlowRating, {
  title: string;
  summary: string;
}> = {
  flood: {
    title: 'Flood Conditions',
    summary: 'Water is at or above the dangerous threshold. Do not float — wait for levels to drop.',
  },
  high: {
    title: 'High Water',
    summary: 'Above the high water threshold. Experienced paddlers only — fast current and submerged obstacles.',
  },
  good: {
    title: 'Good Conditions',
    summary: 'Within the ideal floatable range. Minimal dragging, good navigation, enjoyable conditions.',
  },
  low: {
    title: 'Low Water',
    summary: 'Below ideal but still floatable. Expect some dragging in shallow areas; lighter loads help.',
  },
  poor: {
    title: 'Too Low',
    summary: 'Below the recommended minimum. Frequent dragging and portaging likely. Consider a spring-fed river.',
  },
  unknown: {
    title: 'Unknown Conditions',
    summary: 'Unable to determine conditions. Check the USGS website or call local outfitters.',
  },
};

// Badge color for the collapsed header
const BADGE_BG: Record<FlowRating, string> = {
  flood: 'bg-red-600',
  high: 'bg-orange-500',
  good: 'bg-emerald-500',
  low: 'bg-lime-500',
  poor: 'bg-yellow-500',
  unknown: 'bg-neutral-500',
};

export default function ConditionsBlock({ riverSlug, condition, nearestGauge, hasPutInSelected, isLoading }: ConditionsBlockProps) {
  const [showDetails, setShowDetails] = useState(false);

  const displayCondition = condition;
  const flowRating = displayCondition?.flowRating || 'unknown';
  const config = FLOW_RATING_CONFIG[flowRating];
  const info = FLOW_RATING_INFO[flowRating];

  const badge = displayCondition ? (
    <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${BADGE_BG[flowRating]}`}>
      {info.title}
    </span>
  ) : null;

  if (isLoading) {
    return (
      <CollapsibleSection title="Conditions & Safety" defaultOpen={false} badge={badge}>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-neutral-200 rounded-lg"></div>
          <div className="h-12 bg-neutral-200 rounded-lg"></div>
        </div>
      </CollapsibleSection>
    );
  }

  if (!displayCondition) {
    return (
      <CollapsibleSection title="Conditions & Safety" defaultOpen={false} badge={badge}>
        <p className="text-sm text-neutral-500">Condition data not available at this time.</p>
      </CollapsibleSection>
    );
  }

  const readingAge = displayCondition.readingAgeHours !== null && displayCondition.readingAgeHours < 24
    ? `${Math.round(displayCondition.readingAgeHours)}h ago`
    : null;

  return (
    <CollapsibleSection title="Conditions & Safety" defaultOpen={false} badge={badge}>
      <div className="space-y-3">
        {/* Flow Rating Summary */}
        <div className={`rounded-lg p-3 ${config.bgClass}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
              <span className={`text-base font-bold ${config.textClass}`}>
                {displayCondition.flowDescription || info.title}
              </span>
            </div>
            {readingAge && (
              <span className="text-xs text-neutral-400">{readingAge}</span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex gap-4 text-sm">
            {displayCondition.dischargeCfs !== null && (
              <div>
                <span className="text-neutral-500 text-xs">Flow </span>
                <span className="font-semibold text-neutral-800">{displayCondition.dischargeCfs.toLocaleString()} cfs</span>
              </div>
            )}
            {displayCondition.gaugeHeightFt !== null && (
              <div>
                <span className="text-neutral-500 text-xs">Stage </span>
                <span className="font-semibold text-neutral-800">{displayCondition.gaugeHeightFt.toFixed(2)} ft</span>
              </div>
            )}
            {displayCondition.percentile !== null && displayCondition.percentile !== undefined && (
              <div>
                <span className="text-neutral-500 text-xs">Percentile </span>
                <span className="font-semibold text-neutral-800">{Math.round(displayCondition.percentile)}%</span>
              </div>
            )}
          </div>

          {displayCondition.gaugeName && (
            <p className="text-xs text-neutral-500 mt-2">{displayCondition.gaugeName}</p>
          )}
        </div>

        {/* Advice line */}
        <p className={`text-sm ${config.textClass}`}>{info.summary}</p>

        {/* Details toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {showDetails ? 'Hide details' : 'More details'}
        </button>

        {/* Expandable details */}
        {showDetails && (
          <div className="space-y-3">
            {/* Percentile bar */}
            {displayCondition.percentile !== null && displayCondition.percentile !== undefined && (
              <div>
                <p className="text-xs text-neutral-500 mb-1">Historical comparison for this time of year</p>
                <div className="relative h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-neutral-900"
                    style={{ left: `${displayCondition.percentile}%` }}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                      {Math.round(displayCondition.percentile)}%
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                  <span>Lower</span>
                  <span>Typical</span>
                  <span>Higher</span>
                </div>
              </div>
            )}

            {/* Nearest Gauge */}
            {nearestGauge && nearestGauge.usgsSiteId !== displayCondition.gaugeUsgsId && (
              <div className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2 text-sm">
                <div>
                  <p className="text-xs text-blue-600 font-medium">{hasPutInSelected ? 'Nearest to put-in' : 'Nearby gauge'}</p>
                  <p className="font-semibold text-neutral-900">{nearestGauge.name}</p>
                </div>
                <div className="text-right text-xs">
                  {nearestGauge.gaugeHeightFt !== null && (
                    <p><span className="text-blue-500">Stage</span> <span className="font-bold text-neutral-900">{nearestGauge.gaugeHeightFt.toFixed(2)} ft</span></p>
                  )}
                  {nearestGauge.dischargeCfs !== null && (
                    <p><span className="text-blue-500">Flow</span> <span className="font-bold text-neutral-900">{nearestGauge.dischargeCfs.toLocaleString()} cfs</span></p>
                  )}
                </div>
              </div>
            )}

            {/* USGS link */}
            {displayCondition.usgsUrl && (
              <a
                href={displayCondition.usgsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                View full USGS data
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}

            {/* Safety note */}
            <p className="text-xs text-neutral-400">
              Always confirm conditions with local outfitters. Levels change rapidly.
            </p>
          </div>
        )}

        {/* 7-Day Flow Trend */}
        {displayCondition.gaugeUsgsId && (
          <FlowTrendChart gaugeSiteId={displayCondition.gaugeUsgsId} />
        )}

        {/* 5-Day Weather Forecast */}
        {riverSlug && (
          <WeatherForecast riverSlug={riverSlug} />
        )}

        {/* Accuracy Warning */}
        {displayCondition.accuracyWarning && displayCondition.accuracyWarningReason && (
          <p className="text-xs text-orange-600">
            <span className="font-bold">Note:</span> {displayCondition.accuracyWarningReason}
          </p>
        )}
      </div>
    </CollapsibleSection>
  );
}
