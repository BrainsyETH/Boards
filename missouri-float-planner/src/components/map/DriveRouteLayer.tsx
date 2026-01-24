'use client';

// src/components/map/DriveRouteLayer.tsx
// Displays the shuttle driving route on the map

import { useEffect, useRef } from 'react';
import { useMap } from './MapContainer';

interface DriveRouteLayerProps {
  routeGeometry: GeoJSON.LineString | null;
}

export default function DriveRouteLayer({
  routeGeometry,
}: DriveRouteLayerProps) {
  const map = useMap();
  const layersAddedRef = useRef(false);

  useEffect(() => {
    if (!map) return;

    const driveSourceId = 'drive-route-source';
    const driveLayerId = 'drive-route-layer';
    const driveGlowLayerId = 'drive-route-glow-layer';

    // Helper to safely check if source exists
    const hasSource = (id: string): boolean => {
      try {
        return map.getSource(id) !== undefined;
      } catch {
        return false;
      }
    };

    // Helper to safely check if layer exists
    const hasLayer = (id: string): boolean => {
      try {
        return map.getLayer(id) !== undefined;
      } catch {
        return false;
      }
    };

    // Function to add/update the drive route
    const updateDriveRoute = () => {
      // Remove existing layers/source if no route geometry
      if (!routeGeometry) {
        try {
          if (hasLayer(driveLayerId)) map.removeLayer(driveLayerId);
          if (hasLayer(driveGlowLayerId)) map.removeLayer(driveGlowLayerId);
          if (hasSource(driveSourceId)) map.removeSource(driveSourceId);
          layersAddedRef.current = false;
        } catch (err) {
          console.warn('Error removing drive route layers:', err);
        }
        return;
      }

      // Blue color for driving route to distinguish from river route
      const routeColor = '#3b82f6'; // blue-500
      const glowColor = 'rgba(59, 130, 246, 0.3)';

      // Update existing source or add new one
      if (hasSource(driveSourceId)) {
        try {
          (map.getSource(driveSourceId) as maplibregl.GeoJSONSource).setData({
            type: 'Feature',
            geometry: routeGeometry,
            properties: {},
          });
        } catch (err) {
          console.warn('Error updating drive route source:', err);
        }
      } else {
        try {
          map.addSource(driveSourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: routeGeometry,
              properties: {},
            },
          });
        } catch (err) {
          console.warn('Error adding drive route source:', err);
          return;
        }
      }

      // Add layers if they don't exist
      if (!hasLayer(driveGlowLayerId)) {
        try {
          map.addLayer({
            id: driveGlowLayerId,
            type: 'line',
            source: driveSourceId,
            paint: {
              'line-color': glowColor,
              'line-width': 10,
              'line-opacity': 0.5,
              'line-blur': 3,
            },
          });
        } catch (err) {
          console.warn('Error adding drive route glow layer:', err);
        }
      }

      if (!hasLayer(driveLayerId)) {
        try {
          map.addLayer({
            id: driveLayerId,
            type: 'line',
            source: driveSourceId,
            paint: {
              'line-color': routeColor,
              'line-width': 4,
              'line-opacity': 0.8,
              'line-dasharray': [2, 1],
            },
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
          });
        } catch (err) {
          console.warn('Error adding drive route layer:', err);
        }
      }

      layersAddedRef.current = true;
    };

    // Wait for map to be loaded
    if (!map.loaded()) {
      map.once('load', updateDriveRoute);
      return () => {
        map.off('load', updateDriveRoute);
      };
    }

    // Map is loaded, update the route
    updateDriveRoute();

    // Cleanup only on unmount
    return () => {
      if (layersAddedRef.current) {
        try {
          if (hasLayer(driveLayerId)) map.removeLayer(driveLayerId);
          if (hasLayer(driveGlowLayerId)) map.removeLayer(driveGlowLayerId);
          if (hasSource(driveSourceId)) map.removeSource(driveSourceId);
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [map, routeGeometry]);

  return null;
}
