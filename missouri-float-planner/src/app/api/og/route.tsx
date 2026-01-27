// src/app/api/og/route.tsx
// Default OG image for the homepage / site-wide fallback

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
          background: 'linear-gradient(135deg, #0F2D35 0%, #163F4A 40%, #1D525F 100%)',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top bar accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#F07052',
            display: 'flex',
          }}
        />

        {/* Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://q5skne5bn5nbyxfw.public.blob.vercel-storage.com/Eddy_Otter/Eddy_the_Otter.png"
            alt="Eddy the Otter"
            width="56"
            height="56"
            style={{ borderRadius: '12px' }}
          />
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#A3D1DB', letterSpacing: '-0.02em' }}>
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
              color: '#A3D1DB',
              lineHeight: 1.4,
              margin: 0,
              maxWidth: '800px',
            }}
          >
            Real-time water conditions, access points, float time estimates, and weather for the Ozarks.
          </p>
        </div>

        {/* Bottom feature pills */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['Live Water Levels', '8 Rivers', '30+ Access Points', 'Float Time Estimates', 'Weather Forecasts'].map((feature) => (
            <div
              key={feature}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#D4EAEF',
                fontSize: '16px',
                fontWeight: 600,
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
