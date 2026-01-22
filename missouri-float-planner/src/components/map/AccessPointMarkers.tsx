'use client';

// src/components/map/AccessPointMarkers.tsx
// Themed access point markers on the map

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMap } from './MapContainer';
import type { AccessPoint } from '@/types/api';

interface AccessPointMarkersProps {
  accessPoints: AccessPoint[];
  onMarkerClick?: (point: AccessPoint) => void;
  selectedPutIn?: string | null;
  selectedTakeOut?: string | null;
}

export default function AccessPointMarkers({
  accessPoints,
  onMarkerClick,
  selectedPutIn,
  selectedTakeOut,
}: AccessPointMarkersProps) {
  const map = useMap();
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupsRef = useRef<maplibregl.Popup[]>([]);

  useEffect(() => {
    // Clear existing markers and popups
    markersRef.current.forEach((marker) => marker.remove());
    popupsRef.current.forEach((popup) => popup.remove());
    markersRef.current = [];
    popupsRef.current = [];

    // Create markers for each access point
    accessPoints.forEach((point) => {
      const isPutIn = point.id === selectedPutIn;
      const isTakeOut = point.id === selectedTakeOut;

      // Determine marker style based on state
      let bgColor = '#10b981'; // Default green for public
      let borderColor = '#ffffff';
      let icon = '';
      let scale = 1;
      let zIndex = 1;

      if (!point.isPublic) {
        bgColor = '#f59e0b'; // Amber for private
      }

      if (isPutIn) {
        bgColor = '#14b8a6'; // River teal
        borderColor = '#ffffff';
        icon = '🚩';
        scale = 1.2;
        zIndex = 10;
      } else if (isTakeOut) {
        bgColor = '#f472b6'; // Sunset coral
        borderColor = '#ffffff';
        icon = '🏁';
        scale = 1.2;
        zIndex = 10;
      }

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'access-point-marker';
      el.style.cssText = `
        background: linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(bgColor, -20)} 100%);
        width: ${32 * scale}px;
        height: ${32 * scale}px;
        border-radius: 50%;
        border: 3px solid ${borderColor};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.1);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${14 * scale}px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        z-index: ${zIndex};
      `;
      
      if (icon) {
        el.textContent = icon;
      } else {
        // Inner dot for regular markers
        const innerDot = document.createElement('div');
        innerDot.style.cssText = `
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          opacity: 0.9;
        `;
        el.appendChild(innerDot);
      }

      // Hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15)';
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4), 0 0 20px rgba(20,184,166,0.3)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.1)';
      });

      // Create popup
      const popupContent = `
        <div style="padding: 12px; min-width: 180px;">
          <h3 style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px; color: #1a1a2e;">
            ${point.name}
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #78716c;">
            Mile ${point.riverMile.toFixed(1)} • ${point.type.replace('_', ' ')}
          </p>
          ${point.isPublic 
            ? '<span style="display: inline-block; padding: 2px 8px; background: #d1fae5; color: #065f46; border-radius: 999px; font-size: 11px;">Public Access</span>'
            : '<span style="display: inline-block; padding: 2px 8px; background: #fef3c7; color: #92400e; border-radius: 999px; font-size: 11px;">Private</span>'
          }
          ${point.feeRequired 
            ? '<span style="display: inline-block; margin-left: 4px; padding: 2px 8px; background: #fce7f3; color: #9d174d; border-radius: 999px; font-size: 11px;">Fee Required</span>'
            : ''
          }
          ${point.description 
            ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #57534e;">${point.description}</p>`
            : ''
          }
          <p style="margin: 8px 0 0 0; font-size: 11px; color: #14b8a6; font-weight: 500;">
            Click to select as ${selectedPutIn ? 'take-out' : 'put-in'}
          </p>
        </div>
      `;

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 20,
        className: 'access-point-popup',
      }).setHTML(popupContent);

      // Show popup on hover
      el.addEventListener('mouseenter', () => {
        popup.setLngLat([point.coordinates.lng, point.coordinates.lat]).addTo(map);
      });
      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      // Create marker
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([point.coordinates.lng, point.coordinates.lat])
        .addTo(map);

      // Add click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onMarkerClick?.(point);
        popup.remove();
      });

      markersRef.current.push(marker);
      popupsRef.current.push(popup);
    });

    // Cleanup
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      popupsRef.current.forEach((popup) => popup.remove());
      markersRef.current = [];
      popupsRef.current = [];
    };
  }, [map, accessPoints, onMarkerClick, selectedPutIn, selectedTakeOut]);

  return null;
}

// Helper to darken/lighten colors
function adjustColor(color: string, amount: number): string {
  const clamp = (val: number) => Math.min(255, Math.max(0, val));
  
  // Remove # if present
  color = color.replace('#', '');
  
  // Parse RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Adjust
  const newR = clamp(r + amount);
  const newG = clamp(g + amount);
  const newB = clamp(b + amount);
  
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
