// src/app/api/og/plan/route.tsx
// Dynamic OG image for shared float plans
// Brutalist design with condition-based Eddy the otter

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

type ConditionCode = 'dangerous' | 'high' | 'optimal' | 'low' | 'very_low' | 'too_low' | 'unknown';

const conditionDisplay: Record<ConditionCode, {
  label: string;
  textColor: string;
  bg: string;
  otterImage: string;
}> = {
  optimal:   {
    label: 'OPTIMAL',
    textColor: '#1A3D23',
    bg: '#4EB86B',
    otterImage: 'https://q5skne5bn5nbyxfw.public.blob.vercel-storage.com/Eddy_Otter/Eddy_the_Otter_green.png'
  },
  low:       {
    label: 'LOW - FLOATABLE',
    textColor: '#1A3D23',
    bg: '#84CC16',
    otterImage: 'https://q5skne5bn5nbyxfw.public.blob.vercel-storage.com/Eddy_Otter/Eddy_the_Otter_green.png'
  },
  very_low:  {
    label: 'VERY LOW',
    textColor: '#2D2A24',
    bg: '#EAB308',
    otterImage: 'https://q5skne5bn5nbyxfw.public.blob.vercel-storage.com/Eddy_Otter/Eddy_the_Otter_yellow.png'
  },
  high:      {
    label: 'HIGH WATER',
    textColor: '#ffffff',
    bg: '#F97316',
    otterImage: 'https://q5skne5bn5nbyxfw.public.blob.vercel-storage.com/Eddy_Otter/Eddy_the_Otter_red.png'
  },
  too_low:   {
    label: 'TOO LOW',
    textColor: '#2D2A24',
    bg: '#C2BAAC',
    otterImage: 'https://q5skne5bn5nbyxfw.public.blob.vercel-storage.com/Eddy_Otter/Eddy%20the%20otter%20with%20a%20flag.png'
  },
  dangerous: {
    label: 'DANGEROUS',
    textColor: '#ffffff',
    bg: '#DC2626',
    otterImage: 'https://q5skne5bn5nbyxfw.public.blob.vercel-storage.com/Eddy_Otter/Eddy_the_Otter_red.png'
  },
  unknown:   {
    label: 'UNKNOWN',
    textColor: '#2D2A24',
    bg: '#C2BAAC',
    otterImage: 'https://q5skne5bn5nbyxfw.public.blob.vercel-storage.com/Eddy_Otter/Eddy_the_Otter_green.png'
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const river = searchParams.get('river') || 'Missouri River';
  const putIn = searchParams.get('putIn') || 'Start';
  const takeOut = searchParams.get('takeOut') || 'End';
  const condition = (searchParams.get('condition') || 'unknown') as ConditionCode;
  const gaugeName = searchParams.get('gaugeName') || 'USGS Gauge';
  const gaugeHeight = searchParams.get('gaugeHeight') || '';
  const dischargeCfs = searchParams.get('dischargeCfs') || '';
  const distance = searchParams.get('distance') || '';
  const floatTime = searchParams.get('floatTime') || '';

  const cond = conditionDisplay[condition] || conditionDisplay.unknown;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, sans-serif',
          background: '#1A3D40',
        }}
      >
        {/* TOP - River name centered */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '28px 48px 0 48px',
          }}
        >
          <h1
            style={{
              fontSize: '52px',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            {river.toUpperCase()}
          </h1>
        </div>

        {/* MAIN CONTENT - Otter + Put-in/Take-out | Conditions */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            padding: '0 40px 20px 40px',
          }}
        >
          {/* LEFT - Otter next to Put-in/Take-out */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
            }}
          >
            {/* Otter */}
            <div style={{ display: 'flex', marginRight: '24px', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cond.otterImage}
                width={160}
                height={160}
                style={{ objectFit: 'contain' }}
              />
            </div>

            {/* Put-in / Take-out - MAXIMUM SIZE */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#4EB86B',
                    border: '4px solid #000',
                    marginRight: '14px',
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#72B5C4', letterSpacing: '0.08em' }}>PUT-IN</span>
                  <span style={{ fontSize: '48px', fontWeight: 800, color: 'white', lineHeight: 1.05 }}>{putIn}</span>
                </div>
              </div>

              {/* Connector line */}
              <div style={{ width: '4px', height: '16px', background: '#4A6E6F', marginLeft: '12px', marginBottom: '8px' }} />

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#F07052',
                    border: '4px solid #000',
                    marginRight: '14px',
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#72B5C4', letterSpacing: '0.08em' }}>TAKE-OUT</span>
                  <span style={{ fontSize: '48px', fontWeight: 800, color: 'white', lineHeight: 1.05 }}>{takeOut}</span>
                </div>
              </div>

              {/* Trip stats row */}
              {(distance || floatTime) && (
                <div style={{ display: 'flex', marginTop: '16px' }}>
                  {distance && (
                    <div
                      style={{
                        display: 'flex',
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '2px solid rgba(255,255,255,0.15)',
                        marginRight: '10px',
                      }}
                    >
                      <span style={{ fontSize: '20px', fontWeight: 700, color: '#A3D1DB' }}>
                        {distance}
                      </span>
                    </div>
                  )}
                  {floatTime && (
                    <div
                      style={{
                        display: 'flex',
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '2px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      <span style={{ fontSize: '20px', fontWeight: 700, color: '#A3D1DB' }}>
                        ~{floatTime}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Conditions card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '340px',
              marginLeft: '20px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 28px',
                background: '#F4EFE7',
                border: '6px solid #000',
                boxShadow: '10px 10px 0 #000',
              }}
            >
              {/* Condition badge - LARGE */}
              <div
                style={{
                  display: 'flex',
                  padding: '14px 20px',
                  background: cond.bg,
                  border: '5px solid #000',
                  boxShadow: '6px 6px 0 #000',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '36px', fontWeight: 900, color: cond.textColor, letterSpacing: '-0.02em' }}>
                  {cond.label}
                </span>
              </div>

              {/* Gauge data - side by side */}
              <div style={{ display: 'flex', marginBottom: '12px' }}>
                {gaugeHeight && (
                  <div style={{ display: 'flex', flexDirection: 'column', marginRight: '24px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#857D70', letterSpacing: '0.1em', marginBottom: '2px' }}>
                      GAUGE HEIGHT
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '40px', fontWeight: 900, color: '#2D2A24', letterSpacing: '-0.03em' }}>
                        {gaugeHeight}
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#6B6459', marginLeft: '4px' }}>
                        ft
                      </span>
                    </div>
                  </div>
                )}

                {dischargeCfs && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#857D70', letterSpacing: '0.1em', marginBottom: '2px' }}>
                      DISCHARGE
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '40px', fontWeight: 900, color: '#2D2A24', letterSpacing: '-0.03em' }}>
                        {dischargeCfs}
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#6B6459', marginLeft: '4px' }}>
                        cfs
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Gauge name */}
              <div
                style={{
                  display: 'flex',
                  padding: '6px 12px',
                  background: '#E5DED2',
                  border: '3px solid #C2BAAC',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#6B6459' }}>
                  {gaugeName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM - CTA */}
        <div style={{ display: 'flex', padding: '0 40px 20px 40px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#4A9AAD' }}>
            eddy.guide
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
