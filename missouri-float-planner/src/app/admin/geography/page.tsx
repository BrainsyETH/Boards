'use client';

// src/app/admin/geography/page.tsx
// Admin geography editor page

import { useState, useEffect } from 'react';
import MapContainer from '@/components/map/MapContainer';
import GeographyEditor from '@/components/admin/GeographyEditor';

export default function AdminGeographyPage() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is admin
    // For now, we'll allow access - in production, add proper auth check
    // TODO: Add admin authentication check
    setIsAuthorized(true);
  }, []);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-bluff-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Unauthorized - Admin access required</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-ozark-900">
      <header className="bg-ozark-800 border-b border-ozark-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Geography Editor</h1>
        <p className="text-sm text-river-300 mt-1">
          Edit access point locations and river line geometries
        </p>
      </header>
      <div className="flex-1 relative">
        <MapContainer>
          <GeographyEditor />
        </MapContainer>
      </div>
    </div>
  );
}
