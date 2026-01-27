/**
 * Google Places API verification module
 * Verifies and enriches access point data using Google Places API
 */

import type {
  ScrapedAccessPoint,
  GooglePlacesResult,
  VerifiedAccessPoint,
  ConfidenceLevel,
} from './types';
import { GOOGLE_PLACES_CONFIG, isValidMissouriCoordinate } from './config';
import { delay, retryWithBackoff } from './utils';

// ============================================
// GOOGLE PLACES API TYPES
// ============================================

interface PlacesTextSearchResponse {
  results: PlacesResult[];
  status: string;
  error_message?: string;
}

interface PlacesResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
}

interface PlacesDetailsResponse {
  result: PlacesResult;
  status: string;
  error_message?: string;
}

// ============================================
// GOOGLE PLACES API CLIENT
// ============================================

export class GooglePlacesClient {
  private apiKey: string;
  private requestCount: number = 0;
  private readonly rateLimit: number = 50; // requests per second

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Search for a place by text query
   */
  async textSearch(query: string, location?: { lat: number; lng: number }): Promise<PlacesResult[]> {
    await this.throttle();

    const params = new URLSearchParams({
      query,
      key: this.apiKey,
      language: GOOGLE_PLACES_CONFIG.language,
      region: GOOGLE_PLACES_CONFIG.region,
    });

    if (location) {
      params.set('location', `${location.lat},${location.lng}`);
      params.set('radius', GOOGLE_PLACES_CONFIG.searchRadius.toString());
    }

    const url = `${GOOGLE_PLACES_CONFIG.baseUrl}/textsearch/json?${params}`;

    const response = await retryWithBackoff(async () => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json() as Promise<PlacesTextSearchResponse>;
    });

    if (response.status !== 'OK' && response.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API error: ${response.status} - ${response.error_message || 'Unknown error'}`);
    }

    return response.results || [];
  }

  /**
   * Get place details by place ID
   */
  async getPlaceDetails(placeId: string): Promise<PlacesResult | null> {
    await this.throttle();

    const params = new URLSearchParams({
      place_id: placeId,
      key: this.apiKey,
      language: GOOGLE_PLACES_CONFIG.language,
    });

    const url = `${GOOGLE_PLACES_CONFIG.baseUrl}/details/json?${params}`;

    const response = await retryWithBackoff(async () => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json() as Promise<PlacesDetailsResponse>;
    });

    if (response.status !== 'OK') {
      return null;
    }

    return response.result;
  }

  /**
   * Rate limiting
   */
  private async throttle(): Promise<void> {
    this.requestCount++;
    if (this.requestCount % this.rateLimit === 0) {
      await delay(1000); // Wait 1 second every N requests
    }
  }
}

// ============================================
// VERIFICATION LOGIC
// ============================================

/**
 * Verify an access point using Google Places API
 */
export async function verifyAccessPoint(
  accessPoint: ScrapedAccessPoint,
  client: GooglePlacesClient,
  riverName: string
): Promise<VerifiedAccessPoint> {
  try {
    // Build search query
    const query = buildSearchQuery(accessPoint, riverName);
    console.log(`  🔍 Searching: "${query}"`);

    // Search for the place
    const results = await client.textSearch(
      query,
      accessPoint.latitude && accessPoint.longitude
        ? { lat: accessPoint.latitude, lng: accessPoint.longitude }
        : undefined
    );

    if (results.length === 0) {
      return {
        ...accessPoint,
        verificationStatus: 'not_found',
        verificationNotes: 'No results found in Google Places',
        needsReview: true,
        reviewNotes: [
          ...(accessPoint.reviewNotes || []),
          'Could not verify location with Google Places',
        ],
      };
    }

    // Take the best match (first result)
    const bestMatch = results[0];
    const googlePlaces: GooglePlacesResult = {
      placeId: bestMatch.place_id,
      name: bestMatch.name,
      formattedAddress: bestMatch.formatted_address,
      latitude: bestMatch.geometry.location.lat,
      longitude: bestMatch.geometry.location.lng,
      types: bestMatch.types,
      confidence: results.length === 1 ? 'high' : 'medium',
    };

    // Validate coordinates are in Missouri
    if (!isValidMissouriCoordinate(googlePlaces.latitude, googlePlaces.longitude)) {
      return {
        ...accessPoint,
        googlePlaces,
        verificationStatus: 'verified',
        verificationNotes: 'Found but coordinates outside Missouri',
        needsReview: true,
        reviewNotes: [
          ...(accessPoint.reviewNotes || []),
          `Google Places coordinates (${googlePlaces.latitude}, ${googlePlaces.longitude}) are outside Missouri bounds`,
        ],
      };
    }

    // Update access point with Google Places data
    const verified: VerifiedAccessPoint = {
      ...accessPoint,
      latitude: googlePlaces.latitude,
      longitude: googlePlaces.longitude,
      directionsOverride: googlePlaces.name, // Use Google's name for directions
      googlePlaces,
      verificationStatus: 'verified',
      verificationNotes: `Verified with Google Places (${results.length} results)`,
    };

    // Flag if multiple results (ambiguous)
    if (results.length > 3) {
      verified.needsReview = true;
      verified.reviewNotes = [
        ...(verified.reviewNotes || []),
        `Ambiguous: ${results.length} Google Places results found`,
      ];
      verified.verificationStatus = 'ambiguous';
    }

    console.log(`  ✅ Verified: ${googlePlaces.name} (${googlePlaces.formattedAddress})`);

    return verified;
  } catch (error) {
    console.log(`  ⚠️ Error verifying: ${error instanceof Error ? error.message : String(error)}`);
    return {
      ...accessPoint,
      verificationStatus: 'skipped',
      verificationNotes: `Error: ${error instanceof Error ? error.message : String(error)}`,
      needsReview: true,
      reviewNotes: [
        ...(accessPoint.reviewNotes || []),
        'Verification failed due to API error',
      ],
    };
  }
}

/**
 * Build Google Places search query from access point data
 */
function buildSearchQuery(accessPoint: ScrapedAccessPoint, riverName: string): string {
  const parts: string[] = [accessPoint.name];

  // Add river name for context
  if (!accessPoint.name.toLowerCase().includes(riverName.toLowerCase())) {
    parts.push(riverName);
  }

  // Add state
  parts.push('Missouri');

  return parts.join(' ');
}

/**
 * Determine confidence level based on verification results
 */
function determineConfidence(
  resultCount: number,
  hasCoordinates: boolean
): ConfidenceLevel {
  if (resultCount === 1 && hasCoordinates) return 'high';
  if (resultCount <= 3) return 'medium';
  return 'low';
}

/**
 * Batch verify multiple access points with progress tracking
 */
export async function batchVerifyAccessPoints(
  accessPoints: ScrapedAccessPoint[],
  client: GooglePlacesClient,
  riverName: string
): Promise<VerifiedAccessPoint[]> {
  const verified: VerifiedAccessPoint[] = [];

  console.log(`\n📍 Verifying ${accessPoints.length} access points with Google Places API...`);

  for (let i = 0; i < accessPoints.length; i++) {
    const ap = accessPoints[i];
    console.log(`\n[${i + 1}/${accessPoints.length}] ${ap.name}`);

    const result = await verifyAccessPoint(ap, client, riverName);
    verified.push(result);

    // Add delay to respect rate limits
    if (i < accessPoints.length - 1) {
      await delay(200); // 200ms between requests
    }
  }

  return verified;
}
