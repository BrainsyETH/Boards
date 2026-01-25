// src/app/api/rivers/route.ts
// GET /api/rivers - List all rivers
// Optimized to batch queries and avoid N+1 pattern

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { RiversResponse, ConditionCode } from '@/types/api';

// Force dynamic rendering (uses cookies for Supabase)
export const dynamic = 'force-dynamic';

// Helper to compute condition from gauge height and thresholds
function computeCondition(
  gaugeHeightFt: number | null,
  thresholds: {
    level_too_low: number | null;
    level_low: number | null;
    level_optimal_min: number | null;
    level_optimal_max: number | null;
    level_high: number | null;
    level_dangerous: number | null;
  }
): { label: string; code: ConditionCode } {
  if (gaugeHeightFt === null) {
    return { label: 'Unknown', code: 'unknown' };
  }

  if (thresholds.level_dangerous !== null && gaugeHeightFt >= thresholds.level_dangerous) {
    return { label: 'Dangerous - Do Not Float', code: 'dangerous' };
  }
  if (thresholds.level_high !== null && gaugeHeightFt >= thresholds.level_high) {
    return { label: 'High Water - Experienced Only', code: 'high' };
  }
  if (
    thresholds.level_optimal_min !== null &&
    thresholds.level_optimal_max !== null &&
    gaugeHeightFt >= thresholds.level_optimal_min &&
    gaugeHeightFt <= thresholds.level_optimal_max
  ) {
    return { label: 'Optimal Conditions', code: 'optimal' };
  }
  if (thresholds.level_low !== null && gaugeHeightFt >= thresholds.level_low) {
    return { label: 'Low - Floatable', code: 'low' };
  }
  if (thresholds.level_too_low !== null && gaugeHeightFt >= thresholds.level_too_low) {
    return { label: 'Very Low - Scraping Likely', code: 'very_low' };
  }
  return { label: 'Too Low - Not Recommended', code: 'too_low' };
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Query 1: Get all rivers with access point counts in a single query
    // Using left join to include rivers even if they have no approved access points
    let rivers;
    let error;

    // First try with active filter (for databases with the migration applied)
    const activeResult = await supabase
      .from('rivers')
      .select(`
        id,
        name,
        slug,
        length_miles,
        description,
        difficulty_rating,
        region
      `)
      .eq('active', true)
      .order('name', { ascending: true });

    if (activeResult.error?.message?.includes('active')) {
      // Column doesn't exist yet, fetch all rivers
      const fallbackResult = await supabase
        .from('rivers')
        .select(`
          id,
          name,
          slug,
          length_miles,
          description,
          difficulty_rating,
          region
        `)
        .order('name', { ascending: true });

      rivers = fallbackResult.data;
      error = fallbackResult.error;
    } else {
      rivers = activeResult.data;
      error = activeResult.error;
    }

    if (error) {
      console.error('Error fetching rivers:', error);
      return NextResponse.json(
        { error: 'Could not fetch rivers' },
        { status: 500 }
      );
    }

    if (!rivers || rivers.length === 0) {
      return NextResponse.json<RiversResponse>({ rivers: [] });
    }

    const riverIds = rivers.map(r => r.id);

    // Query 2 & 3: Batch fetch access point counts and gauge data in parallel
    const [accessPointsResult, gaugeDataResult] = await Promise.all([
      // Get access point counts grouped by river
      supabase
        .from('access_points')
        .select('river_id')
        .in('river_id', riverIds)
        .eq('approved', true),

      // Get primary gauge data with latest readings for all rivers
      supabase
        .from('river_gauges')
        .select(`
          river_id,
          level_too_low,
          level_low,
          level_optimal_min,
          level_optimal_max,
          level_high,
          level_dangerous,
          gauge_stations!inner (
            id,
            active,
            gauge_readings (
              gauge_height_ft,
              reading_timestamp
            )
          )
        `)
        .in('river_id', riverIds)
        .eq('is_primary', true)
        .eq('gauge_stations.active', true)
    ]);

    // Build access point count map
    const accessPointCountMap = new Map<string, number>();
    if (accessPointsResult.data) {
      for (const ap of accessPointsResult.data) {
        const count = accessPointCountMap.get(ap.river_id) || 0;
        accessPointCountMap.set(ap.river_id, count + 1);
      }
    }

    // Build condition map from gauge data
    const conditionMap = new Map<string, { label: string; code: ConditionCode }>();
    if (gaugeDataResult.data) {
      for (const gauge of gaugeDataResult.data) {
        // gauge_stations is returned as an object (not array) due to !inner join
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gaugeStation = gauge.gauge_stations as any;
        if (!gaugeStation) continue;

        // Get the latest reading from the gauge_readings array
        const readings = (gaugeStation.gauge_readings || []) as Array<{
          gauge_height_ft: number | null;
          reading_timestamp: string
        }>;

        // Sort by timestamp descending and get the latest
        const latestReading = readings.sort(
          (a, b) => new Date(b.reading_timestamp).getTime() - new Date(a.reading_timestamp).getTime()
        )[0];

        const condition = computeCondition(latestReading?.gauge_height_ft ?? null, {
          level_too_low: gauge.level_too_low,
          level_low: gauge.level_low,
          level_optimal_min: gauge.level_optimal_min,
          level_optimal_max: gauge.level_optimal_max,
          level_high: gauge.level_high,
          level_dangerous: gauge.level_dangerous,
        });

        conditionMap.set(gauge.river_id, condition);
      }
    }

    // Build response using the maps (no additional queries needed)
    const riversWithConditions = rivers.map((river) => ({
      id: river.id,
      name: river.name,
      slug: river.slug,
      lengthMiles: parseFloat(river.length_miles),
      description: river.description,
      difficultyRating: river.difficulty_rating,
      region: river.region,
      accessPointCount: accessPointCountMap.get(river.id) || 0,
      currentCondition: conditionMap.get(river.id) || null,
    }));

    // Filter to only include rivers with at least one approved access point
    const riversWithAccessPoints = riversWithConditions.filter(r => r.accessPointCount > 0);

    const response: RiversResponse = {
      rivers: riversWithAccessPoints,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in rivers endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
