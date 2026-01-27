// src/app/rivers/[slug]/page.tsx
// Server component wrapper for river detail page
// Exports generateMetadata for dynamic social media preview tags

import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import RiverPage from './RiverPageClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://floatmo.com';

interface RiverPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RiverPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = await createClient();

    // Fetch river basic info
    const { data: river } = await supabase
      .from('rivers')
      .select('id, name, slug, length_miles, description, difficulty_rating, region')
      .eq('slug', slug)
      .single();

    if (!river) {
      return {
        title: 'River Not Found',
      };
    }

    // Fetch current conditions for the river
    let conditionCode = 'unknown';
    let gaugeHeight = '';
    let flowDesc = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: conditionData } = await (supabase.rpc as any)('get_river_condition', {
      p_river_id: river.id,
    });

    if (conditionData && conditionData.length > 0) {
      const cond = conditionData[0];
      conditionCode = cond.condition_code || 'unknown';
      if (cond.gauge_height_ft) {
        gaugeHeight = parseFloat(cond.gauge_height_ft).toFixed(2);
      }
      flowDesc = cond.condition_label || '';
    }

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
    const conditionSuffix = conditionText ? ` - ${conditionText}` : '';
    const lengthMiles = river.length_miles ? parseFloat(river.length_miles).toFixed(1) : '';

    const title = `${river.name}${conditionSuffix}`;
    const description = `${river.name} float trip info${conditionText ? `: Currently ${conditionText.toLowerCase()}` : ''}. ${lengthMiles ? `${lengthMiles} miles` : ''}${river.difficulty_rating ? `, ${river.difficulty_rating}` : ''}${river.region ? ` in ${river.region}` : ''}. Real-time water conditions, access points, float times, and weather.`;

    // Build OG image URL with query params
    const ogParams = new URLSearchParams({
      name: river.name,
      condition: conditionCode,
      ...(lengthMiles && { length: lengthMiles }),
      ...(river.difficulty_rating && { difficulty: river.difficulty_rating }),
      ...(river.region && { region: river.region }),
      ...(gaugeHeight && { gaugeHeight }),
      ...(flowDesc && { flowDesc }),
    });

    const ogImageUrl = `${BASE_URL}/api/og/river?${ogParams.toString()}`;
    const pageUrl = `${BASE_URL}/rivers/${slug}`;

    return {
      title,
      description,
      openGraph: {
        type: 'website',
        title: `${river.name} - Float Trip Conditions & Info`,
        description,
        url: pageUrl,
        siteName: 'Float MO',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${river.name} current conditions and float trip info`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${river.name}${conditionSuffix}`,
        description,
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating river metadata:', error);
    return {
      title: 'River',
      description: 'Plan your float trip on Missouri rivers.',
    };
  }
}

export default function Page() {
  return <RiverPage />;
}
