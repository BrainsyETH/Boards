/**
 * Type definitions for access point scraping system
 */

// ============================================
// CORE ACCESS POINT TYPES
// ============================================

export type AccessPointType =
  | 'boat_ramp'
  | 'gravel_bar'
  | 'campground'
  | 'bridge'
  | 'access'
  | 'park';

export type OwnershipType =
  | 'MDC'
  | 'NPS'
  | 'private'
  | 'county'
  | 'city'
  | 'state_park'
  | 'USFS'
  | 'unknown';

export interface ScrapedAccessPoint {
  // Required fields
  name: string;
  source: SourceType;
  sourceUrl: string;
  rawData: string; // Original text from source for reference

  // Location data
  latitude?: number;
  longitude?: number;
  drivingLatitude?: number; // Parking lot location
  drivingLongitude?: number;
  directionsOverride?: string; // Google Maps destination (place name or address)

  // Classification
  type: AccessPointType;
  isPublic: boolean;
  ownership?: OwnershipType;

  // Details
  description?: string;
  amenities?: string[];
  parkingInfo?: string;
  feeRequired?: boolean;
  feeNotes?: string;

  // Metadata
  confidence: ConfidenceLevel; // How confident we are in the data
  needsReview: boolean; // Requires manual review
  reviewNotes?: string[]; // Why it needs review
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

// ============================================
// SOURCE TYPES
// ============================================

export type SourceType =
  | 'missouriscenicrivers'
  | 'usgs'
  | 'moherp'
  | 'floatmissouri'
  | 'ozarkfloating';

export interface SourceScraper {
  name: SourceType;
  displayName: string;
  baseUrl: string;
  scrape(riverSlug: string, riverName: string): Promise<ScrapedAccessPoint[]>;
}

// ============================================
// GOOGLE PLACES API TYPES
// ============================================

export interface GooglePlacesResult {
  placeId: string;
  name: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  types: string[];
  confidence: ConfidenceLevel;
}

export interface VerifiedAccessPoint extends ScrapedAccessPoint {
  googlePlaces?: GooglePlacesResult;
  verificationStatus: 'verified' | 'not_found' | 'ambiguous' | 'skipped';
  verificationNotes?: string;
}

// ============================================
// DEDUPLICATION TYPES
// ============================================

export interface ExistingAccessPoint {
  id: string;
  river_id: string;
  name: string;
  slug: string;
  type: AccessPointType;
  latitude: number;
  longitude: number;
  approved: boolean;
  description?: string;
}

export interface DuplicateMatch {
  existing: ExistingAccessPoint;
  scraped: VerifiedAccessPoint;
  matchType: 'exact_name' | 'similar_name' | 'close_coordinates' | 'both';
  nameSimilarity: number; // 0-1 score
  distanceMeters: number;
  recommendation: 'skip' | 'flag' | 'merge';
  notes: string;
}

export interface DeduplicationResult {
  unique: VerifiedAccessPoint[];
  duplicates: DuplicateMatch[];
  flaggedForReview: VerifiedAccessPoint[];
}

// ============================================
// OUTPUT TYPES
// ============================================

export interface ScraperOutput {
  river: {
    slug: string;
    name: string;
  };
  timestamp: string;
  sources: SourceType[];
  stats: {
    totalScraped: number;
    verified: number;
    duplicates: number;
    flagged: number;
    readyToImport: number;
  };
  accessPoints: VerifiedAccessPoint[];
  duplicates: DuplicateMatch[];
  warnings: string[];
}

// ============================================
// RIVER TYPES
// ============================================

export interface River {
  id: string;
  slug: string;
  name: string;
  length_miles: number;
  region: string;
}

// ============================================
// CONFIGURATION TYPES
// ============================================

export interface ScraperConfig {
  googlePlacesApiKey?: string;
  deduplicationThresholds: {
    nameSimiarlityThreshold: number; // 0-1, default 0.85
    proximityThresholdMeters: number; // Default 100m
  };
  outputDir: string;
  enableGooglePlaces: boolean;
  sourcesToScrape: SourceType[];
}
