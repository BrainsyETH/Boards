/**
 * Configuration for access point scraping system
 */

import type { ScraperConfig, SourceType } from './types';
import * as path from 'path';

// ============================================
// SCRAPER CONFIGURATION
// ============================================

export const DEFAULT_CONFIG: ScraperConfig = {
  googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
  deduplicationThresholds: {
    nameSimiarlityThreshold: 0.85, // 85% similar = potential duplicate
    proximityThresholdMeters: 100, // Within 100m = potential duplicate
  },
  outputDir: path.join(process.cwd(), 'scripts', 'output', 'scraped-data'),
  enableGooglePlaces: true,
  sourcesToScrape: [
    'missouriscenicrivers',
    'usgs',
    'moherp',
    'floatmissouri',
    'ozarkfloating',
  ],
};

// ============================================
// SOURCE URLS
// ============================================

export const SOURCE_URLS: Record<SourceType, string> = {
  missouriscenicrivers: 'https://missouriscenicrivers.com',
  usgs: 'https://waterdata.usgs.gov',
  moherp: 'https://rivers.moherp.org/rivers',
  floatmissouri: 'https://www.floatmissouri.com/plan/missouri-rivers',
  ozarkfloating: 'https://www.ozarkfloating.com',
};

// ============================================
// TYPE DETECTION KEYWORDS
// ============================================

export const TYPE_KEYWORDS: Record<string, string[]> = {
  boat_ramp: ['boat ramp', 'launch', 'ramp', 'boat launch', 'concrete ramp'],
  gravel_bar: ['gravel bar', 'sand bar', 'gravel access', 'informal access'],
  campground: ['campground', 'camping', 'camp', 'rv park', 'primitive camp'],
  bridge: ['bridge', 'highway bridge', 'county bridge', 'road bridge'],
  park: [
    'state park',
    'national park',
    'city park',
    'recreation area',
    'conservation area',
  ],
  access: ['access', 'put-in', 'take-out', 'public access', 'river access'],
};

// ============================================
// OWNERSHIP DETECTION KEYWORDS
// ============================================

export const OWNERSHIP_KEYWORDS: Record<string, string[]> = {
  MDC: [
    'mdc',
    'missouri department of conservation',
    'conservation area',
    'conservation department',
  ],
  NPS: [
    'nps',
    'national park service',
    'ozark national scenic riverways',
    'onsr',
    'national monument',
  ],
  state_park: ['state park', 'missouri state parks', 'mo state park'],
  USFS: [
    'usfs',
    'forest service',
    'national forest',
    'mark twain national forest',
  ],
  county: ['county', 'county park', 'county access'],
  city: ['city', 'city park', 'municipal'],
  private: ['private', 'privately owned', 'commercial', 'outfitter'],
};

// ============================================
// AMENITY DETECTION KEYWORDS
// ============================================

export const AMENITY_KEYWORDS: Record<string, string[]> = {
  parking: ['parking', 'parking lot', 'parking area', 'vehicle parking'],
  restrooms: ['restroom', 'bathroom', 'toilet', 'facilities', 'outhouse'],
  camping: ['camping', 'campground', 'campsites', 'overnight'],
  boat_ramp: ['boat ramp', 'launch ramp', 'concrete ramp'],
  picnic: ['picnic', 'picnic area', 'picnic shelter', 'day use'],
  drinking_water: ['drinking water', 'water', 'potable water'],
  trash: ['trash', 'garbage', 'dumpster', 'waste disposal'],
  ada_accessible: ['accessible', 'ada', 'handicap', 'wheelchair'],
};

// ============================================
// MISSOURI BOUNDS (for coordinate validation)
// ============================================

export const MISSOURI_BOUNDS = {
  minLat: 35.9,
  maxLat: 40.7,
  minLng: -96.5,
  maxLng: -88.9,
};

// ============================================
// GOOGLE PLACES API CONFIG
// ============================================

export const GOOGLE_PLACES_CONFIG = {
  baseUrl: 'https://maps.googleapis.com/maps/api/place',
  searchRadius: 5000, // 5km radius for text search
  language: 'en',
  region: 'us',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if coordinates are within Missouri bounds
 */
export function isValidMissouriCoordinate(
  lat: number,
  lng: number
): boolean {
  return (
    lat >= MISSOURI_BOUNDS.minLat &&
    lat <= MISSOURI_BOUNDS.maxLat &&
    lng >= MISSOURI_BOUNDS.minLng &&
    lng <= MISSOURI_BOUNDS.maxLng
  );
}

/**
 * Slugify text for database slugs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Detect access point type from text
 */
export function detectType(text: string): {
  type: string;
  confidence: number;
} {
  const lowerText = text.toLowerCase();

  for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return { type, confidence: 0.9 };
      }
    }
  }

  return { type: 'access', confidence: 0.5 };
}

/**
 * Detect ownership from text
 */
export function detectOwnership(text: string): string | undefined {
  const lowerText = text.toLowerCase();

  for (const [ownership, keywords] of Object.entries(OWNERSHIP_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return ownership;
      }
    }
  }

  return undefined;
}

/**
 * Detect amenities from text
 */
export function detectAmenities(text: string): string[] {
  const lowerText = text.toLowerCase();
  const amenities: string[] = [];

  for (const [amenity, keywords] of Object.entries(AMENITY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword) && !amenities.includes(amenity)) {
        amenities.push(amenity);
        break;
      }
    }
  }

  return amenities;
}
