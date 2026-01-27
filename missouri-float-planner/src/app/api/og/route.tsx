// src/app/api/og/route.tsx
// Default OG image for the homepage / site-wide fallback
// Neo-Brutalist style with Eddy the Otter palette

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#161748',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top bar accent — chunky Neo-Brutalist */}
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

        {/* Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: '#F07052',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #22222C',
              boxShadow: '3px 3px 0 #22222C',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            </svg>
          </div>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#ABABDB', letterSpacing: '-0.02em' }}>
            EDDY
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: 0,
              marginBottom: '20px',
            }}
          >
            Plan Your Missouri{' '}
            <span style={{ color: '#F07052' }}>Float Trip</span>
          </h1>
          <p
            style={{
              fontSize: '26px',
              color: '#ABABDB',
              lineHeight: 1.4,
              margin: 0,
              maxWidth: '800px',
            }}
          >
            Real-time water conditions, access points, float time estimates, and weather for the Ozarks.
          </p>
        </div>

        {/* Bottom feature pills — Neo-Brutalist */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['Live Water Levels', '8 Rivers', '30+ Access Points', 'Float Time Estimates', 'Weather Forecasts'].map((feature) => (
            <div
              key={feature}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#222260',
                border: '3px solid #22222C',
                boxShadow: '2px 2px 0 #22222C',
                color: '#D5D5ED',
                fontSize: '16px',
                fontWeight: 700,
                display: 'flex',
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
