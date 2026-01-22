'use client';

// src/components/map/RiverLayer.tsx
// Themed river line rendering with smoothing

import { useEffect } from 'react';
import { useMap } from './MapContainer';
import * as turf from '@turf/turf';
import type { GeoJSON } from 'geojson';

interface RiverLayerProps {
  riverGeometry?: GeoJSON.LineString;
  selected?: boolean;
  routeGeometry?: GeoJSON.LineString;
}

// Smooth a line string using bezier spline
function smoothLineString(geometry: GeoJSON.LineString): GeoJSON.LineString {
  if (!geometry.coordinates || geometry.coordinates.length < 2) {
    return geometry;
  }

  // Convert to Turf LineString
  const line = turf.lineString(geometry.coordinates);
  
  // Simplify the line slightly to reduce points, then smooth
  // This helps with performance and makes curves smoother
  const simplified = turf.simplify(line, { tolerance: 0.0001, highQuality: true });
  
  // Use bezier spline for smooth curves
  const smoothed = turf.bezierSpline(simplified, { resolution: 10000, sharpness: 0.85 });
  
  return smoothed.geometry;
}

export default function RiverLayer({
  riverGeometry,
  selected = false,
  routeGeometry,
}: RiverLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!riverGeometry || !map) return;

    // Ensure map is loaded before proceeding
    if (!map.loaded()) {
      const handleLoad = () => {
        // Map loaded, effect will re-run
      };
      map.once('load', handleLoad);
      return () => {
        map.off('load', handleLoad);
      };
    }

    const sourceId = 'river-source';
    const layerId = 'river-layer';
    const glowLayerId = 'river-glow-layer';
    const routeSourceId = 'route-source';
    const routeLayerId = 'route-layer';
    const routeGlowLayerId = 'route-glow-layer';

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

    // Smooth the river geometry
    const smoothedGeometry = smoothLineString(riverGeometry);

    // Add or update river source
    if (hasSource(sourceId)) {
      try {
        (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData({
          type: 'Feature',
          geometry: smoothedGeometry,
          properties: {},
        });
      } catch (err) {
        console.warn('Error updating river source:', err);
      }
    } else {
      try {
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: smoothedGeometry,
            properties: {},
          },
        });

        // Add glow layer first (underneath) - using river-water color
        if (!hasLayer(glowLayerId)) {
          map.addLayer({
            id: glowLayerId,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#39a0ca', // river-water
              'line-width': selected ? 12 : 8,
              'line-opacity': 0.2,
              'line-blur': 4,
            },
          });
        }

        // Add main river layer - using river-water color
        if (!hasLayer(layerId)) {
          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#39a0ca', // river-water
              'line-width': selected ? 4 : 2,
              'line-opacity': 0.9,
            },
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
          });
        }
      } catch (err) {
        console.warn('Error adding river source/layers:', err);
      }
    }

    // Update layer styles if selection changed - keep river-water color
    try {
      if (hasLayer(layerId)) {
        map.setPaintProperty(layerId, 'line-color', '#39a0ca'); // river-water
        map.setPaintProperty(layerId, 'line-width', selected ? 4 : 2);
      }
      if (hasLayer(glowLayerId)) {
        map.setPaintProperty(glowLayerId, 'line-width', selected ? 12 : 8);
      }
    } catch (err) {
      console.warn('Error updating layer styles:', err);
    }

    // Add route highlight if provided
    if (routeGeometry) {
      const smoothedRoute = smoothLineString(routeGeometry);
      
      if (hasSource(routeSourceId)) {
        try {
          (map.getSource(routeSourceId) as maplibregl.GeoJSONSource).setData({
            type: 'Feature',
            geometry: smoothedRoute,
            properties: {},
          });
        } catch (err) {
          console.warn('Error updating route source:', err);
        }
      } else {
        try {
          map.addSource(routeSourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: smoothedRoute,
              properties: {},
            },
          });

          // Route glow
          if (!hasLayer(routeGlowLayerId)) {
            map.addLayer({
              id: routeGlowLayerId,
              type: 'line',
              source: routeSourceId,
              paint: {
                'line-color': '#f472b6',
                'line-width': 16,
                'line-opacity': 0.3,
                'line-blur': 6,
              },
            });
          }

          // Main route line - using sky-warm for route highlight
          if (!hasLayer(routeLayerId)) {
            map.addLayer({
              id: routeLayerId,
              type: 'line',
              source: routeSourceId,
              paint: {
                'line-color': '#f95d9b', // sky-warm
                'line-width': 6,
                'line-opacity': 1,
              },
              layout: {
                'line-cap': 'round',
                'line-join': 'round',
              },
          });
        }
      } catch (err) {
        console.warn('Error adding route source/layers:', err);
      }
      }
    } else {
      // Remove route layers if no route
      try {
        if (hasLayer(routeLayerId)) map.removeLayer(routeLayerId);
        if (hasLayer(routeGlowLayerId)) map.removeLayer(routeGlowLayerId);
        if (hasSource(routeSourceId)) map.removeSource(routeSourceId);
      } catch (err) {
        console.warn('Error removing route layers:', err);
      }
    }

    return () => {
      // Cleanup route layers on unmount
      try {
        if (hasLayer(routeLayerId)) map.removeLayer(routeLayerId);
        if (hasLayer(routeGlowLayerId)) map.removeLayer(routeGlowLayerId);
        if (hasSource(routeSourceId)) map.removeSource(routeSourceId);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [map, riverGeometry, selected, routeGeometry]);

  return null;
}
