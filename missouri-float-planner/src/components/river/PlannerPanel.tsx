'use client';

// src/components/river/PlannerPanel.tsx
// Primary planning interaction panel
// State is lifted to parent (RiverPage) to enable map integration
// Users select put-in/take-out by clicking map markers

import PlanSummary from '@/components/plan/PlanSummary';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { RiverWithDetails, AccessPoint, FloatPlan } from '@/types/api';

interface PlannerPanelProps {
  river: RiverWithDetails;
  accessPoints: AccessPoint[];
  isLoading: boolean;
  // Controlled state from parent
  selectedPutIn: string | null;
  selectedTakeOut: string | null;
  onPutInChange: (id: string | null) => void;
  onTakeOutChange: (id: string | null) => void;
  // Plan data from parent
  plan: FloatPlan | null;
  planLoading: boolean;
  showPlan: boolean;
  onShowPlanChange: (show: boolean) => void;
}

export default function PlannerPanel({
  river,
  accessPoints,
  isLoading,
  selectedPutIn,
  selectedTakeOut,
  onPutInChange,
  onTakeOutChange,
  plan,
  planLoading,
  showPlan,
  onShowPlanChange,
}: PlannerPanelProps) {
  const selectedPutInPoint = selectedPutIn
    ? accessPoints.find((point) => point.id === selectedPutIn)
    : null;

  const selectedTakeOutPoint = selectedTakeOut
    ? accessPoints.find((point) => point.id === selectedTakeOut)
    : null;

  const handleShare = async () => {
    if (!selectedPutIn || !selectedTakeOut) return;

    try {
      const response = await fetch('/api/plan/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riverId: river.id,
          startId: selectedPutIn,
          endId: selectedTakeOut,
        }),
      });

      if (!response.ok) throw new Error('Failed to save plan');

      const { url } = await response.json();
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing plan:', error);
      alert('Failed to create shareable link');
    }
  };

  return (
    <div className="glass-card-dark rounded-2xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4">Plan Your Float</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Selection Display - Read Only */}
          <div className="grid grid-cols-2 gap-3">
            {/* Put-in Display */}
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#4EB86B' }}>Put-in</p>
              {selectedPutInPoint ? (
                <p className="text-sm font-semibold text-white truncate" title={selectedPutInPoint.name}>
                  {selectedPutInPoint.name}
                </p>
              ) : (
                <p className="text-sm text-white/50 italic">Click map marker</p>
              )}
            </div>

            {/* Take-out Display */}
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#F07052' }}>Take-out</p>
              {selectedTakeOutPoint ? (
                <p className="text-sm font-semibold text-white truncate" title={selectedTakeOutPoint.name}>
                  {selectedTakeOutPoint.name}
                </p>
              ) : (
                <p className="text-sm text-white/50 italic">Click map marker</p>
              )}
            </div>
          </div>

          {/* Clear Selection Button */}
          {(selectedPutIn || selectedTakeOut) && (
            <button
              onClick={() => {
                onPutInChange(null);
                onTakeOutChange(null);
                onShowPlanChange(false);
              }}
              className="w-full text-sm py-2.5 px-4 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: 'rgba(240, 112, 82, 0.15)',
                border: '2px solid #F07052',
                color: '#F07052'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F07052';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(240, 112, 82, 0.15)';
                e.currentTarget.style.color = '#F07052';
              }}
            >
              Clear Selection
            </button>
          )}

          {/* Plan Summary */}
          {showPlan && (
            <div className="border-t border-white/10 pt-4">
              <PlanSummary
                plan={plan}
                isLoading={planLoading}
                onClose={() => {
                  onShowPlanChange(false);
                  onPutInChange(null);
                  onTakeOutChange(null);
                }}
                onShare={handleShare}
              />
            </div>
          )}

          {/* Instructions */}
          {!selectedPutIn && (
            <div className="bg-primary-700/30 rounded-xl p-4 text-sm text-primary-200 border border-primary-600/30">
              <p className="font-medium mb-1 text-white">Click the map to plan your float</p>
              <p>Click a marker to set your <span style={{ color: '#4EB86B' }}>put-in</span>, then click another for your <span style={{ color: '#F07052' }}>take-out</span>.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
