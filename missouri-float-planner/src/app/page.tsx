'use client';

// src/app/page.tsx
// Landing page for Eddy — Neo-Brutalist style with Eddy the Otter branding
// Colors: Adventure Night, Bluewater, Green Treeline, Neon Pink

import { Suspense } from 'react';
import Link from 'next/link';
import { Waves, MapPin, Droplets, Clock } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRivers } from '@/hooks/useRivers';
import type { ConditionCode } from '@/types/api';

// Matches GaugeOverview labels and colors
const conditionColors: Record<ConditionCode, string> = {
  optimal: 'bg-emerald-500',
  low: 'bg-lime-500',
  very_low: 'bg-yellow-500',
  high: 'bg-orange-500',
  too_low: 'bg-neutral-400',
  dangerous: 'bg-red-600',
  unknown: 'bg-neutral-400',
};

const conditionLabels: Record<ConditionCode, string> = {
  optimal: 'Optimal',
  low: 'Okay',
  very_low: 'Low',
  high: 'High',
  too_low: 'Too Low',
  dangerous: 'Flood',
  unknown: 'Unknown',
};

function HomeLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-neutral-600 font-bold">Loading...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { data: rivers, isLoading, error } = useRivers();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col bg-neutral-50">
      {/* Hero — Neo-Brutalist with flat Adventure Night background */}
      <section
        className="relative py-16 md:py-24 text-white"
        style={{ backgroundColor: '#161748' }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Eddy Logo — chunky Neo-Brutalist icon */}
          <div className="mb-6">
            <div
              className="w-20 h-20 mx-auto rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: '#F07052',
                border: '4px solid #22222C',
                boxShadow: '4px 4px 0 #22222C',
              }}
            >
              <Waves className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 tracking-tight">
            <span style={{ color: '#F07052' }}>Eddy</span>
          </h1>
          <p className="text-lg md:text-xl max-w-xl mx-auto mb-8" style={{ color: '#ABABDB' }}>
            Real-time water conditions, access points, and float time estimates
            for the best rivers in the Ozarks.
          </p>

          {/* Feature pills — Neo-Brutalist with thick borders */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: MapPin, label: '30+ Access Points' },
              { icon: Droplets, label: 'Live USGS Gauges' },
              { icon: Clock, label: 'Float Time Estimates' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-bold"
                style={{
                  backgroundColor: '#222260',
                  border: '3px solid #22222C',
                  boxShadow: '2px 2px 0 #22222C',
                }}
              >
                <Icon className="w-4 h-4" style={{ color: '#39A0CA' }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rivers grid */}
      <section className="flex-1 py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
            Choose a River
          </h2>

          {isLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-neutral-600 mb-4">Unable to load rivers. Please try again.</p>
              <button onClick={() => window.location.reload()} className="btn-primary">
                Retry
              </button>
            </div>
          )}

          {rivers && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rivers.map((river) => (
                <Link
                  key={river.id}
                  href={`/rivers/${river.slug}`}
                  className="group block bg-white rounded-lg p-5 no-underline transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{
                    border: '4px solid #22222C',
                    boxShadow: '3px 3px 0 #22222C',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '6px 6px 0 #22222C';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '3px 3px 0 #22222C';
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                      {river.name}
                    </h3>
                    {river.currentCondition && (
                      <span
                        className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md ${
                          river.currentCondition.code === 'optimal'
                            ? 'bg-support-100 text-support-700'
                            : river.currentCondition.code === 'unknown'
                            ? 'bg-neutral-100 text-neutral-600'
                            : river.currentCondition.code === 'dangerous' || river.currentCondition.code === 'too_low'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                        style={{
                          border: '2px solid currentColor',
                        }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${conditionColors[river.currentCondition.code]}`} />
                        {conditionLabels[river.currentCondition.code]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 font-medium">
                    <span>{river.lengthMiles.toFixed(1)} miles</span>
                    {river.region && <span>{river.region}</span>}
                    {river.difficultyRating && <span>{river.difficultyRating}</span>}
                  </div>
                  <div
                    className="mt-3 text-sm font-bold transition-colors"
                    style={{ color: '#F07052' }}
                  >
                    View river &rarr;
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer — Neo-Brutalist with Adventure Night bg */}
      <footer
        className="px-4 py-3"
        style={{
          backgroundColor: '#161748',
          borderTop: '4px solid #22222C',
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm" style={{ color: '#ABABDB' }}>
          <p className="font-bold">Eddy &middot; Water data from USGS</p>
          <p className="hidden md:block">Always check local conditions before floating</p>
        </div>
      </footer>
    </div>
  );
}
