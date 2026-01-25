# Missouri Float Planner - Site Functionality Analysis

**Date:** January 25, 2026
**Branch:** claude/test-site-functionality-3O7hr

## Overview

Comprehensive review of the Missouri Float Planner application - a Next.js app for planning float trips on Missouri rivers with real-time USGS water data integration.

## Build Status

- **Lint:** Passes with 2 minor warnings (missing React hook dependencies)
- **Build:** Compiles successfully (sitemap error expected without Supabase env vars)
- **TypeScript:** Strict typing, well-structured types

## Performance Improvements

### High Priority

1. **N+1 Query Pattern in `/api/rivers`**
   - Location: `src/app/api/rivers/route.ts:68-101`
   - Issue: Sequential queries for each river's condition
   - Fix: Create batch RPC for all river conditions

2. **Sequential API Calls in `/api/plan`**
   - Location: `src/app/api/plan/route.ts`
   - Issue: Multiple independent queries run sequentially
   - Fix: Parallelize with `Promise.all()`

### Medium Priority

3. **USGS API Caching**
   - Location: `src/lib/usgs/gauges.ts:86`
   - Consider dynamic cache duration based on time of day

### Low Priority

4. **Map Style Migration Check**
   - Location: `src/components/map/MapContainer.tsx:263-273`
   - Move to one-time app initialization

5. **React Hook Dependency Warnings**
   - `src/components/admin/AccessPointEditor.tsx:551`
   - `src/components/map/MapContainer.tsx:145`

## Feature Improvements

### High Value

1. **Offline/PWA Support**
   - Service worker for offline access
   - Cache river data locally
   - "Download plan" for offline viewing

2. **Multi-Day Trip Planning**
   - Campground stop recommendations
   - Integrate existing `/api/plan/campgrounds` endpoint
   - Show overnight stops on map

### Medium Value

3. **User Accounts & Trip History**
   - Save favorite float plans
   - Track completed trips
   - Trip reviews/ratings

4. **Community Hazard Reporting**
   - CommunityReport type exists but needs UI
   - Photo uploads for hazards
   - Real-time condition crowdsourcing

5. **Weather Integration Enhancement**
   - 5-day forecast display
   - Rain probability affecting levels
   - Thunderstorm warnings

6. **Shuttle Service Integration**
   - ShuttleService type defined, needs UI
   - Contact links to outfitters
   - Price estimates

### Quick Wins

7. **Print-Friendly Float Plan**
   - PDF export or print CSS
   - Map snapshot, hazards, emergency contacts
   - QR code to digital version

8. **Additional Vessel Types**
   - Add kayak, SUP, tube options
   - Speed calculations for each

## Code Quality

### Strengths
- Strong TypeScript typing
- Good separation of concerns
- TanStack Query for efficient caching
- URL persistence for sharing
- Mobile-responsive with bottom sheets

### Areas for Improvement
- Some `eslint-disable` for RPC type safety
- Hardcoded colors vs design system
- Console.log in production (use proper logging)

## Key Files Reviewed

- `src/app/page.tsx` - Main UI with map integration
- `src/app/api/plan/route.ts` - Float plan calculation (624 lines)
- `src/hooks/useFloatPlan.ts` - Query caching strategy
- `src/lib/usgs/gauges.ts` - USGS API integration
- `src/components/map/MapContainer.tsx` - MapLibre integration
- `src/components/plan/PlanSummary.tsx` - Plan display with vessel toggle
- `src/types/api.ts` - Type definitions (322 lines)

## Recommendations Summary

1. Batch API queries to fix N+1 pattern (biggest performance win)
2. Add PWA/offline support (high user value)
3. Complete multi-day trip planning feature
4. Add print/export capability
