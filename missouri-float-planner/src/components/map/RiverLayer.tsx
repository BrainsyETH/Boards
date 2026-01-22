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
    if (!riverGeometry) return;

    const sourceId = 'river-source';
    const layerId = 'river-layer';
    const glowLayerId = 'river-glow-layer';
    const routeSourceId = 'route-source';
    const routeLayerId = 'route-layer';
    const routeGlowLayerId = 'route-glow-layer';

    // Smooth the river geometry
    const smoothedGeometry = smoothLineString(riverGeometry);

    // Add or update river source
    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData({
        type: 'Feature',
        geometry: smoothedGeometry,
        properties: {},
      });
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: smoothedGeometry,
          properties: {},
        },
      });

      // Add glow layer first (underneath)
      if (!map.getLayer(glowLayerId)) {
        map.addLayer({
          id: glowLayerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#14b8a6',
            'line-width': selected ? 12 : 8,
            'line-opacity': 0.2,
            'line-blur': 4,
          },
        });
      }

      // Add main river layer
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': selected ? '#0f766e' : '#14b8a6',
            'line-width': selected ? 4 : 2,
            'line-opacity': 0.9,
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
        });
      }
    }

    // Update layer styles if selection changed
    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, 'line-color', selected ? '#0f766e' : '#14b8a6');
      map.setPaintProperty(layerId, 'line-width', selected ? 4 : 2);
    }
    if (map.getLayer(glowLayerId)) {
      map.setPaintProperty(glowLayerId, 'line-width', selected ? 12 : 8);
    }

    // Add route highlight if provided
    if (routeGeometry) {
      const smoothedRoute = smoothLineString(routeGeometry);
      
      if (map.getSource(routeSourceId)) {
        (map.getSource(routeSourceId) as maplibregl.GeoJSONSource).setData({
          type: 'Feature',
          geometry: smoothedRoute,
          properties: {},
        });
      } else {
        map.addSource(routeSourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: smoothedRoute,
            properties: {},
          },
        });

        // Route glow
        if (!map.getLayer(routeGlowLayerId)) {
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

        // Main route line
        if (!map.getLayer(routeLayerId)) {
          map.addLayer({
            id: routeLayerId,
            type: 'line',
            source: routeSourceId,
            paint: {
              'line-color': '#14b8a6',
              'line-width': 6,
              'line-opacity': 1,
            },
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
          });
        }
      }
    } else {
      // Remove route layers if no route
      if (map.getLayer(routeLayerId)) map.removeLayer(routeLayerId);
      if (map.getLayer(routeGlowLayerId)) map.removeLayer(routeGlowLayerId);
      if (map.getSource(routeSourceId)) map.removeSource(routeSourceId);
    }

    return () => {
      // Cleanup handled by parent
    };
  }, [map, riverGeometry, selected, routeGeometry]);

  return null;
}
