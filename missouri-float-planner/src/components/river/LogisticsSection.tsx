'use client';

// src/components/river/LogisticsSection.tsx
// Logistics information for access points

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { AccessPoint } from '@/types/api';

interface LogisticsSectionProps {
  accessPoints: AccessPoint[];
  isLoading: boolean;
}

export default function LogisticsSection({ accessPoints, isLoading }: LogisticsSectionProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <LoadingSpinner size="sm" />
          <p className="text-sm text-bluff-500">Loading logistics...</p>
        </div>
      </div>
    );
  }

  // Group access points by type
  const groupedPoints = accessPoints.reduce((acc, point) => {
    const type = point.type.replace('_', ' ');
    if (!acc[type]) acc[type] = [];
    acc[type].push(point);
    return acc;
  }, {} as Record<string, AccessPoint[]>);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-ozark-800 mb-4">Logistics</h3>

      <div className="space-y-6">
        {Object.entries(groupedPoints).map(([type, points]) => (
          <div key={type}>
            <h4 className="font-semibold text-ozark-700 mb-3 capitalize">{type}</h4>
            <div className="space-y-3">
              {points.map((point) => (
                <div key={point.id} className="bg-bluff-50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-ozark-800">{point.name}</p>
                      <p className="text-sm text-bluff-500">Mile {point.riverMile.toFixed(1)}</p>
                    </div>
                    {point.feeRequired && (
                      <span className="px-2 py-1 bg-sunset-100 text-sunset-700 rounded text-xs font-medium">
                        Fee Required
                      </span>
                    )}
                  </div>

                  {/* Amenities */}
                  {point.amenities && point.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {point.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-white text-bluff-600 rounded text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Parking Info */}
                  {point.parkingInfo && (
                    <p className="text-xs text-bluff-600 mt-2">Parking: {point.parkingInfo}</p>
                  )}

                  {/* Fee Notes */}
                  {point.feeRequired && point.feeNotes && (
                    <p className="text-xs text-sunset-600 mt-2">Fee: {point.feeNotes}</p>
                  )}

                  {/* Description */}
                  {point.description && (
                    <p className="text-sm text-bluff-600 mt-2">{point.description}</p>
                  )}

                  {/* Ownership */}
                  {point.ownership && (
                    <p className="text-xs text-bluff-500 mt-2">Ownership: {point.ownership}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {accessPoints.length === 0 && (
          <p className="text-sm text-bluff-500">No access point information available.</p>
        )}
      </div>
    </div>
  );
}
