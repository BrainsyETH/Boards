'use client';

// src/app/rivers/[slug]/page.tsx
// River detail page with full planning experience

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import RiverHeader from '@/components/river/RiverHeader';
import PlannerPanel from '@/components/river/PlannerPanel';
import ConditionsBlock from '@/components/river/ConditionsBlock';
import DifficultyExperience from '@/components/river/DifficultyExperience';
import LogisticsSection from '@/components/river/LogisticsSection';
import PointsOfInterest from '@/components/river/PointsOfInterest';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRiver } from '@/hooks/useRivers';
import { useAccessPoints } from '@/hooks/useAccessPoints';
import { useConditions } from '@/hooks/useConditions';

// Dynamic imports for map
const MapContainer = dynamic(() => import('@/components/map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-ozark-900 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  ),
});
const RiverLayer = dynamic(() => import('@/components/map/RiverLayer'), { ssr: false });
const AccessPointMarkers = dynamic(() => import('@/components/map/AccessPointMarkers'), { ssr: false });

export default function RiverPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: river, isLoading: riverLoading, error: riverError } = useRiver(slug);
  const { data: accessPoints, isLoading: accessPointsLoading } = useAccessPoints(slug);
  const { data: condition } = useConditions(river?.id || null);

  if (riverLoading) {
    return (
      <div className="min-h-screen bg-ozark-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (riverError || !river) {
    return (
      <div className="min-h-screen bg-ozark-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">River Not Found</h2>
          <p className="text-bluff-400">
            The river you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bluff-50">
      {/* River Header */}
      <RiverHeader 
        river={river} 
        condition={condition || null}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Planner Panel */}
            <PlannerPanel
              river={river}
              accessPoints={accessPoints || []}
              isLoading={accessPointsLoading}
            />

            {/* Conditions & Safety */}
            <ConditionsBlock
              riverId={river.id}
              condition={condition || null}
            />

            {/* Difficulty & Experience */}
            <DifficultyExperience river={river} />

            {/* Logistics */}
            <LogisticsSection
              accessPoints={accessPoints || []}
              isLoading={accessPointsLoading}
            />

            {/* Points of Interest */}
            <PointsOfInterest riverSlug={slug} />
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="rounded-xl overflow-hidden shadow-2xl h-[600px]">
                <MapContainer initialBounds={river.bounds}>
                  <RiverLayer
                    riverGeometry={river.geometry}
                    selected={true}
                  />
                  {accessPoints && (
                    <AccessPointMarkers
                      accessPoints={accessPoints}
                      selectedPutIn={null}
                      selectedTakeOut={null}
                    />
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
