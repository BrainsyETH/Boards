// src/app/api/admin/access-points/route.ts
// GET /api/admin/access-points - List all access points for editing

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get all access points (including unapproved) for admin editing
    const { data: accessPoints, error } = await supabase
      .from('access_points')
      .select(`
        id,
        river_id,
        name,
        slug,
        location_orig,
        location_snap,
        river_mile_downstream,
        type,
        is_public,
        ownership,
        description,
        approved,
        rivers!inner(id, name, slug)
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching access points:', error);
      return NextResponse.json(
        { error: 'Could not fetch access points' },
        { status: 500 }
      );
    }

    // Format response with coordinates
    const formatted = (accessPoints || []).map((ap) => ({
      id: ap.id,
      riverId: ap.river_id,
      riverName: (ap.rivers as any)?.name,
      riverSlug: (ap.rivers as any)?.slug,
      name: ap.name,
      slug: ap.slug,
      coordinates: {
        orig: {
          lng: (ap.location_orig as any)?.coordinates?.[0] || 0,
          lat: (ap.location_orig as any)?.coordinates?.[1] || 0,
        },
        snap: ap.location_snap
          ? {
              lng: (ap.location_snap as any)?.coordinates?.[0] || 0,
              lat: (ap.location_snap as any)?.coordinates?.[1] || 0,
            }
          : null,
      },
      riverMile: ap.river_mile_downstream ? parseFloat(ap.river_mile_downstream) : null,
      type: ap.type,
      isPublic: ap.is_public,
      ownership: ap.ownership,
      description: ap.description,
      approved: ap.approved,
    }));

    return NextResponse.json({ accessPoints: formatted });
  } catch (error) {
    console.error('Error in admin access points endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
