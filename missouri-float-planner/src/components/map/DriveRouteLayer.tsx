'use client';

// src/components/map/DriveRouteLayer.tsx
// Displays the shuttle driving route on the map

import { useEffect } from 'react';
import { useMap } from './MapContainer';
import type { GeoJSON } from 'geojson';

interface DriveRouteLayerProps {
  routeGeometry: GeoJSON.LineString | null;
}

export default function DriveRouteLayer({
  routeGeometry,
}: DriveRouteLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Wait for map to be loaded
    if (!map.loaded()) {
      const handleLoad = () => {
        // Map loaded, effect will re-run
      };
      map.once('load', handleLoad);
      return () => {
        map.off('load', handleLoad);
      };
    }

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

    // Remove existing layers/source if no route geometry
    if (!routeGeometry) {
      try {
        if (hasLayer(driveLayerId)) map.removeLayer(driveLayerId);
        if (hasLayer(driveGlowLayerId)) map.removeLayer(driveGlowLayerId);
        if (hasSource(driveSourceId)) map.removeSource(driveSourceId);
      } catch (err) {
        console.warn('Error removing drive route layers:', err);
      }
      return;
    }

    // Blue color for driving route to distinguish from river route
    const routeColor = '#3b82f6'; // blue-500
    const glowColor = 'rgba(59, 130, 246, 0.3)';

    // Add or update route source
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

        // Route glow layer (underneath)
        if (!hasLayer(driveGlowLayerId)) {
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
        }

        // Main route line - dashed to distinguish from float route
        if (!hasLayer(driveLayerId)) {
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
        }
      } catch (err) {
        console.warn('Error adding drive route source/layers:', err);
      }
    }

    // Cleanup on unmount
    return () => {
      try {
        if (hasLayer(driveLayerId)) map.removeLayer(driveLayerId);
        if (hasLayer(driveGlowLayerId)) map.removeLayer(driveGlowLayerId);
        if (hasSource(driveSourceId)) map.removeSource(driveSourceId);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [map, routeGeometry]);

  return null;
}
