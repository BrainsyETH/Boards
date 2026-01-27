/**
 * Utility functions for access point scraping
 */

// ============================================
// STRING SIMILARITY
// ============================================

/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0-1)
 * 1 = identical, 0 = completely different
 */
export function stringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1;

  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1;

  const distance = levenshteinDistance(s1, s2);
  return 1 - distance / maxLen;
}

/**
 * Normalize access point name for comparison
 * Removes common suffixes and prefixes
 */
export function normalizeAccessPointName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+(access|put-in|take-out|boat ramp|ramp|campground|park)$/i, '')
    .replace(/^(hwy|highway|state route|sr|county road|cr)\s+/i, '')
    .trim();
}

// ============================================
// COORDINATE UTILITIES
// ============================================

/**
 * Calculate distance between two coordinates in meters
 * Uses Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Parse coordinates from various string formats
 */
export function parseCoordinates(text: string): {
  latitude?: number;
  longitude?: number;
} | null {
  // Pattern 1: "lat, lng" or "lat,lng"
  const pattern1 = /(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/;
  const match1 = text.match(pattern1);
  if (match1) {
    const lat = parseFloat(match1[1]);
    const lng = parseFloat(match1[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // Pattern 2: Decimal degrees with labels
  const latMatch = text.match(/lat(?:itude)?:\s*(-?\d+\.?\d*)/i);
  const lngMatch = text.match(/l(?:on|ng)(?:gitude)?:\s*(-?\d+\.?\d*)/i);
  if (latMatch && lngMatch) {
    const lat = parseFloat(latMatch[1]);
    const lng = parseFloat(lngMatch[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  return null;
}

// ============================================
// TEXT PROCESSING
// ============================================

/**
 * Extract text content from HTML
 */
export function extractTextFromHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean up scraped text
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

// ============================================
// VALIDATION
// ============================================

/**
 * Validate coordinate values
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Check if text appears to be an address
 */
export function looksLikeAddress(text: string): boolean {
  const addressPatterns = [
    /\d+\s+\w+\s+(street|st|road|rd|avenue|ave|lane|ln|drive|dr|highway|hwy)/i,
    /\w+,\s*[A-Z]{2}\s*\d{5}/,
    /\d+\s+\w+.*,\s*\w+/,
  ];

  return addressPatterns.some(pattern => pattern.test(text));
}

// ============================================
// FORMATTING
// ============================================

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(2)}km`;
}

/**
 * Format similarity score as percentage
 */
export function formatSimilarity(score: number): string {
  return `${Math.round(score * 100)}%`;
}

// ============================================
// HTTP UTILITIES
// ============================================

/**
 * Add delay between requests (rate limiting)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delayMs = initialDelay * Math.pow(2, i);
        console.log(`  Retry ${i + 1}/${maxRetries} after ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }

  throw lastError;
}
