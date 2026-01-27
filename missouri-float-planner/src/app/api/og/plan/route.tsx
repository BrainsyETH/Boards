// src/app/api/og/plan/route.tsx
// Dynamic OG image for shared float plans
// Two-column layout: Eddy branding left, plan data right

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

type ConditionCode = 'dangerous' | 'high' | 'optimal' | 'low' | 'very_low' | 'too_low' | 'unknown';

const conditionDisplay: Record<ConditionCode, { label: string; color: string; bg: string }> = {
  optimal:   { label: 'Optimal',         color: '#ffffff', bg: '#4EB86B' },
  low:       { label: 'Low - Floatable', color: '#ffffff', bg: '#84CC16' },
  very_low:  { label: 'Very Low',        color: '#ffffff', bg: '#EAB308' },
  high:      { label: 'High Water',      color: '#ffffff', bg: '#F97316' },
  too_low:   { label: 'Too Low',         color: '#ffffff', bg: '#9CA3AF' },
  dangerous: { label: 'Dangerous',       color: '#ffffff', bg: '#DC2626' },
  unknown:   { label: 'Unknown',         color: '#ffffff', bg: '#6B6459' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const river = searchParams.get('river') || 'Missouri River';
  const putIn = searchParams.get('putIn') || 'Start';
  const takeOut = searchParams.get('takeOut') || 'End';
  const distance = searchParams.get('distance') || '';
  const floatTime = searchParams.get('floatTime') || '';
  const vessel = searchParams.get('vessel') || 'Canoe';
  const condition = (searchParams.get('condition') || 'unknown') as ConditionCode;
  const driveBack = searchParams.get('driveBack') || '';
  const gaugeName = searchParams.get('gaugeName') || '';
  const gaugeHeight = searchParams.get('gaugeHeight') || '';

  const cond = conditionDisplay[condition] || conditionDisplay.unknown;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          background: '#163F4A',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: '#F07052',
            display: 'flex',
          }}
        />

        {/* LEFT COLUMN — Eddy branding */}
        <div
          style={{
            width: '280px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            background: '#0F2D35',
            borderRight: '2px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Large Eddy logo */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              background: '#F07052',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              border: '3px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            </svg>
          </div>
          <span style={{ fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '0.1em', marginBottom: '6px' }}>
            EDDY
          </span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#72B5C4', letterSpacing: '0.05em' }}>
            eddy.guide
          </span>
        </div>

        {/* RIGHT COLUMN — Plan data */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 48px 32px',
            justifyContent: 'space-between',
          }}
        >
          {/* Top section: River name + condition badge */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#72B5C4', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Float Plan
              </span>
              {/* Condition badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: cond.bg,
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 700, color: cond.color }}>
                  {cond.label}
                </span>
              </div>
            </div>

            <h1
              style={{
                fontSize: '46px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                margin: '0 0 20px 0',
              }}
            >
              {river}
            </h1>

            {/* Route: Put-in → Take-out */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 22px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4EB86B', display: 'flex' }} />
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>{putIn}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.25)', display: 'flex' }} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F07052', display: 'flex' }} />
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>{takeOut}</span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {distance && (
                <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#4A9AAD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Distance</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{distance}</span>
                </div>
              )}
              {floatTime && (
                <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#4A9AAD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Float Time</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{floatTime}</span>
                </div>
              )}
              {vessel && (
                <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#4A9AAD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Vessel</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{vessel}</span>
                </div>
              )}
              {driveBack && (
                <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#4A9AAD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Drive Back</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{driveBack}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom section: USGS gauge data */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 22px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Gauge station name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A9AAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#A3D1DB' }}>
                {gaugeName ? `USGS: ${gaugeName}` : 'USGS Gauge Data'}
              </span>
            </div>

            {/* Gauge readings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {gaugeHeight && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>{gaugeHeight}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#72B5C4' }}>ft</span>
                </div>
              )}
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#4A9AAD' }}>
                eddy.guide
              </span>
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
