// src/app/api/og/river/route.tsx
// Dynamic OG image for river pages
// Neo-Brutalist style with Eddy the Otter palette

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

type ConditionCode = 'dangerous' | 'high' | 'optimal' | 'low' | 'very_low' | 'too_low' | 'unknown';

const conditionDisplay: Record<ConditionCode, { label: string; color: string; bg: string; emoji: string }> = {
  optimal:   { label: 'Optimal',   color: '#2B5135', bg: '#D4E8D9', emoji: '🟢' },
  low:       { label: 'Low - Floatable', color: '#3D6B20', bg: '#E8F5D4', emoji: '🟡' },
  very_low:  { label: 'Very Low',  color: '#92400E', bg: '#FEF3C7', emoji: '🟠' },
  high:      { label: 'High Water', color: '#9A3412', bg: '#FFF7ED', emoji: '🟠' },
  too_low:   { label: 'Too Low',   color: '#991B1B', bg: '#FEF2F2', emoji: '🔴' },
  dangerous: { label: 'Dangerous - Do Not Float', color: '#991B1B', bg: '#FEF2F2', emoji: '🔴' },
  unknown:   { label: 'Unknown',   color: '#525252', bg: '#F5F5F5', emoji: '⚪' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get('name') || 'Missouri River';
  const condition = (searchParams.get('condition') || 'unknown') as ConditionCode;
  const length = searchParams.get('length') || '';
  const difficulty = searchParams.get('difficulty') || '';
  const region = searchParams.get('region') || 'Missouri Ozarks';
  const gaugeHeight = searchParams.get('gaugeHeight') || '';
  const flowDesc = searchParams.get('flowDesc') || '';

  const cond = conditionDisplay[condition] || conditionDisplay.unknown;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#161748',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top accent bar — chunky */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#F07052',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', flex: 1, padding: '50px 60px' }}>
          {/* Left content */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            {/* Top: Logo + location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#F07052',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #22222C',
                  boxShadow: '2px 2px 0 #22222C',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                  <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                  <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                </svg>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#ABABDB' }}>
                EDDY
              </span>
              <span style={{ fontSize: '20px', color: '#5757B7', margin: '0 4px' }}>·</span>
              <span style={{ fontSize: '18px', color: '#ABABDB' }}>{region}</span>
            </div>

            {/* Middle: River name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h1
                style={{
                  fontSize: '58px',
                  fontWeight: 800,
                  color: 'white',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  margin: 0,
                }}
              >
                {name}
              </h1>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {length && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#39A0CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18" /><path d="M8 6h10v10" />
                    </svg>
                    <span style={{ fontSize: '20px', color: '#A1D5EB', fontWeight: 700 }}>
                      {length} miles
                    </span>
                  </div>
                )}
                {difficulty && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#39A0CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                    <span style={{ fontSize: '20px', color: '#A1D5EB', fontWeight: 700 }}>
                      {difficulty}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom: CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px', color: '#ABABDB' }}>
                Check conditions and plan your float trip
              </span>
            </div>
          </div>

          {/* Right: Conditions card — Neo-Brutalist */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '340px',
              padding: '32px',
              borderRadius: '12px',
              background: '#222260',
              border: '4px solid #22222C',
              boxShadow: '4px 4px 0 #22222C',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#39A0CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#A1D5EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Current Conditions
              </span>
            </div>

            {/* Condition badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 20px',
                borderRadius: '10px',
                background: cond.bg,
                border: `3px solid ${cond.color}`,
              }}
            >
              <span style={{ fontSize: '24px' }}>{cond.emoji}</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: cond.color }}>
                {cond.label}
              </span>
            </div>

            {/* Gauge info */}
            {gaugeHeight && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '14px', color: '#39A0CA', fontWeight: 700 }}>GAUGE HEIGHT</span>
                <span style={{ fontSize: '32px', fontWeight: 800, color: 'white' }}>{gaugeHeight} ft</span>
              </div>
            )}

            {flowDesc && (
              <div style={{ display: 'flex' }}>
                <span style={{ fontSize: '16px', color: '#A1D5EB', lineHeight: 1.4 }}>{flowDesc}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 0',
                borderTop: '2px solid rgba(255,255,255,0.15)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5757B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              <span style={{ fontSize: '14px', color: '#5757B7' }}>Live from USGS gauges</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
