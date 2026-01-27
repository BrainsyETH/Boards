// src/app/plan/[shortCode]/page.tsx
// Server component wrapper for shared plan page
// Exports generateMetadata for dynamic social media preview tags

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import SharedPlanPage from './PlanPageClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://floatmo.com';

interface PlanPageProps {
  params: Promise<{ shortCode: string }>;
}

function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export async function generateMetadata({ params }: PlanPageProps): Promise<Metadata> {
  const { shortCode } = await params;

  try {
    const supabase = await createClient();

    // Fetch the saved plan with related data
    const { data: savedPlan } = await supabase
      .from('float_plans')
      .select('*')
      .eq('short_code', shortCode)
      .single();

    if (!savedPlan) {
      return {
        title: 'Plan Not Found',
        description: 'This float plan could not be found.',
      };
    }

    // Fetch river name
    const { data: river } = await supabase
      .from('rivers')
      .select('name, slug, region')
      .eq('id', savedPlan.river_id)
      .single();

    // Fetch access point names
    const { data: putIn } = await supabase
      .from('access_points')
      .select('name')
      .eq('id', savedPlan.start_access_id)
      .single();

    const { data: takeOut } = await supabase
      .from('access_points')
      .select('name')
      .eq('id', savedPlan.end_access_id)
      .single();

    // Fetch vessel type name
    const { data: vessel } = await supabase
      .from('vessel_types')
      .select('name')
      .eq('id', savedPlan.vessel_type_id)
      .single();

    const riverName = river?.name || 'Missouri River';
    const putInName = putIn?.name || 'Start';
    const takeOutName = takeOut?.name || 'End';
    const vesselName = vessel?.name || 'Canoe';
    const distanceMiles = savedPlan.distance_miles ? parseFloat(savedPlan.distance_miles).toFixed(1) : '';
    const floatTimeFormatted = savedPlan.estimated_float_minutes
      ? formatMinutes(savedPlan.estimated_float_minutes)
      : '';
    const driveBackFormatted = savedPlan.drive_back_minutes
      ? formatMinutes(savedPlan.drive_back_minutes)
      : '';
    const conditionCode = savedPlan.condition_at_creation || 'unknown';

    const conditionLabels: Record<string, string> = {
      optimal: 'Optimal',
      low: 'Low - Floatable',
      very_low: 'Very Low',
      high: 'High Water',
      too_low: 'Too Low',
      dangerous: 'Dangerous',
      unknown: '',
    };

    const conditionText = conditionLabels[conditionCode] || '';

    const title = `${riverName}: ${putInName} to ${takeOutName}`;
    const descParts: string[] = [];
    if (distanceMiles) descParts.push(`${distanceMiles} mi`);
    if (floatTimeFormatted) descParts.push(`~${floatTimeFormatted} float`);
    if (vesselName) descParts.push(`by ${vesselName.toLowerCase()}`);
    if (conditionText) descParts.push(`Conditions: ${conditionText}`);
    if (driveBackFormatted) descParts.push(`${driveBackFormatted} drive back`);

    const description = descParts.length > 0
      ? `${riverName} float plan - ${descParts.join(' | ')}. Check current conditions on Float MO.`
      : `${riverName} float plan from ${putInName} to ${takeOutName}. Check current conditions on Float MO.`;

    // Build OG image URL
    const ogParams = new URLSearchParams({
      river: riverName,
      putIn: putInName,
      takeOut: takeOutName,
      condition: conditionCode,
      ...(distanceMiles && { distance: `${distanceMiles} mi` }),
      ...(floatTimeFormatted && { floatTime: floatTimeFormatted }),
      ...(vesselName && { vessel: vesselName }),
      ...(driveBackFormatted && { driveBack: driveBackFormatted }),
    });

    const ogImageUrl = `${BASE_URL}/api/og/plan?${ogParams.toString()}`;
    const pageUrl = `${BASE_URL}/plan/${shortCode}`;

    return {
      title,
      description,
      openGraph: {
        type: 'website',
        title: `Float Plan: ${riverName} - ${putInName} to ${takeOutName}`,
        description,
        url: pageUrl,
        siteName: 'Float MO',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `Float plan for ${riverName}: ${putInName} to ${takeOutName}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${riverName}: ${putInName} to ${takeOutName}`,
        description,
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating plan metadata:', error);
    return {
      title: 'Float Plan',
      description: 'View and share your Missouri float trip plan.',
    };
  }
}

export default function Page() {
  return <SharedPlanPage />;
}
