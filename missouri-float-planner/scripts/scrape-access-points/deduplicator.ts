/**
 * Deduplication module for access points
 * Identifies duplicates and flags potential conflicts
 */

import type {
  VerifiedAccessPoint,
  ExistingAccessPoint,
  DuplicateMatch,
  DeduplicationResult,
  ScraperConfig,
} from './types';
import {
  stringSimilarity,
  normalizeAccessPointName,
  calculateDistance,
  formatDistance,
  formatSimilarity,
} from './utils';

// ============================================
// DEDUPLICATION LOGIC
// ============================================

/**
 * Deduplicate scraped access points against existing database records
 */
export function deduplicateAccessPoints(
  scraped: VerifiedAccessPoint[],
  existing: ExistingAccessPoint[],
  config: ScraperConfig
): DeduplicationResult {
  const duplicates: DuplicateMatch[] = [];
  const unique: VerifiedAccessPoint[] = [];
  const flaggedForReview: VerifiedAccessPoint[] = [];

  console.log(`\n🔍 Checking ${scraped.length} scraped points against ${existing.length} existing points...`);

  for (const scrapedPoint of scraped) {
    const matches = findMatches(scrapedPoint, existing, config);

    if (matches.length === 0) {
      // No duplicates found
      if (scrapedPoint.needsReview) {
        flaggedForReview.push(scrapedPoint);
      } else {
        unique.push(scrapedPoint);
      }
    } else {
      // Found potential duplicates
      const bestMatch = selectBestMatch(matches);
      duplicates.push(bestMatch);

      console.log(
        `  ⚠️ Duplicate: "${scrapedPoint.name}" matches "${bestMatch.existing.name}" (${bestMatch.matchType}, ${formatSimilarity(bestMatch.nameSimilarity)}, ${formatDistance(bestMatch.distanceMeters)})`
      );
    }
  }

  console.log(`\n✅ Unique: ${unique.length}`);
  console.log(`⚠️ Flagged: ${flaggedForReview.length}`);
  console.log(`🔄 Duplicates: ${duplicates.length}`);

  return {
    unique,
    duplicates,
    flaggedForReview,
  };
}

/**
 * Find all matching existing access points for a scraped point
 */
function findMatches(
  scraped: VerifiedAccessPoint,
  existing: ExistingAccessPoint[],
  config: ScraperConfig
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];

  for (const existingPoint of existing) {
    const match = checkForMatch(scraped, existingPoint, config);
    if (match) {
      matches.push(match);
    }
  }

  return matches;
}

/**
 * Check if a scraped point matches an existing point
 */
function checkForMatch(
  scraped: VerifiedAccessPoint,
  existing: ExistingAccessPoint,
  config: ScraperConfig
): DuplicateMatch | null {
  // Calculate name similarity
  const normalizedScraped = normalizeAccessPointName(scraped.name);
  const normalizedExisting = normalizeAccessPointName(existing.name);
  const nameSimilarity = stringSimilarity(normalizedScraped, normalizedExisting);

  // Calculate distance if both have coordinates
  let distanceMeters = Infinity;
  if (scraped.latitude && scraped.longitude && existing.latitude && existing.longitude) {
    distanceMeters = calculateDistance(
      scraped.latitude,
      scraped.longitude,
      existing.latitude,
      existing.longitude
    );
  }

  // Determine if it's a match
  const nameMatch = nameSimilarity >= config.deduplicationThresholds.nameSimiarlityThreshold;
  const coordinateMatch = distanceMeters <= config.deduplicationThresholds.proximityThresholdMeters;

  if (!nameMatch && !coordinateMatch) {
    return null; // Not a match
  }

  // Determine match type
  let matchType: DuplicateMatch['matchType'];
  if (nameMatch && coordinateMatch) {
    matchType = 'both';
  } else if (nameMatch) {
    matchType = nameSimilarity === 1 ? 'exact_name' : 'similar_name';
  } else {
    matchType = 'close_coordinates';
  }

  // Determine recommendation
  let recommendation: DuplicateMatch['recommendation'];
  let notes: string;

  if (matchType === 'both' || matchType === 'exact_name') {
    recommendation = 'skip';
    notes = 'Very likely duplicate - skip import';
  } else if (matchType === 'similar_name' && nameSimilarity > 0.95) {
    recommendation = 'skip';
    notes = 'Highly similar name - likely duplicate';
  } else {
    recommendation = 'flag';
    notes = 'Potential duplicate - needs manual review';
  }

  // Check if existing is approved or pending
  if (existing.approved) {
    notes += ' (existing is approved)';
  } else {
    notes += ' (existing is pending)';
  }

  return {
    existing,
    scraped,
    matchType,
    nameSimilarity,
    distanceMeters,
    recommendation,
    notes,
  };
}

/**
 * Select the best match from multiple potential duplicates
 */
function selectBestMatch(matches: DuplicateMatch[]): DuplicateMatch {
  // Sort by name similarity (descending) then distance (ascending)
  matches.sort((a, b) => {
    if (a.nameSimilarity !== b.nameSimilarity) {
      return b.nameSimilarity - a.nameSimilarity;
    }
    return a.distanceMeters - b.distanceMeters;
  });

  return matches[0];
}

// ============================================
// INTERNAL DEDUPLICATION (within scraped data)
// ============================================

/**
 * Remove duplicates within scraped data (from multiple sources)
 */
export function deduplicateScrapedData(
  accessPoints: VerifiedAccessPoint[],
  config: ScraperConfig
): VerifiedAccessPoint[] {
  const unique: VerifiedAccessPoint[] = [];
  const seenNames = new Set<string>();

  console.log(`\n🔍 Deduplicating ${accessPoints.length} scraped access points...`);

  for (const point of accessPoints) {
    const normalizedName = normalizeAccessPointName(point.name);

    // Check for exact name match
    if (seenNames.has(normalizedName)) {
      console.log(`  ⚠️ Internal duplicate: "${point.name}" (from ${point.source})`);
      continue;
    }

    // Check for similar names
    let isDuplicate = false;
    for (const existing of unique) {
      const existingNormalized = normalizeAccessPointName(existing.name);
      const similarity = stringSimilarity(normalizedName, existingNormalized);

      if (similarity >= config.deduplicationThresholds.nameSimiarlityThreshold) {
        // Check coordinates if available
        if (
          point.latitude &&
          point.longitude &&
          existing.latitude &&
          existing.longitude
        ) {
          const distance = calculateDistance(
            point.latitude,
            point.longitude,
            existing.latitude,
            existing.longitude
          );

          if (distance <= config.deduplicationThresholds.proximityThresholdMeters) {
            console.log(
              `  ⚠️ Internal duplicate: "${point.name}" ≈ "${existing.name}" (${formatDistance(distance)})`
            );
            isDuplicate = true;
            break;
          }
        } else {
          // No coordinates, rely on name similarity
          console.log(
            `  ⚠️ Internal duplicate: "${point.name}" ≈ "${existing.name}" (${formatSimilarity(similarity)} similar)`
          );
          isDuplicate = true;
          break;
        }
      }
    }

    if (!isDuplicate) {
      unique.push(point);
      seenNames.add(normalizedName);
    }
  }

  console.log(`✅ ${unique.length} unique access points after internal deduplication`);

  return unique;
}

// ============================================
// REPORTING
// ============================================

/**
 * Generate a deduplication report
 */
export function generateDeduplicationReport(result: DeduplicationResult): string {
  const lines: string[] = [];

  lines.push('='.repeat(70));
  lines.push('DEDUPLICATION REPORT');
  lines.push('='.repeat(70));
  lines.push('');

  // Summary
  lines.push('Summary:');
  lines.push(`  Unique access points: ${result.unique.length}`);
  lines.push(`  Flagged for review: ${result.flaggedForReview.length}`);
  lines.push(`  Duplicates found: ${result.duplicates.length}`);
  lines.push('');

  // Duplicates
  if (result.duplicates.length > 0) {
    lines.push('Duplicates:');
    lines.push('-'.repeat(70));

    for (const dup of result.duplicates) {
      lines.push(`  Scraped: "${dup.scraped.name}" (${dup.scraped.source})`);
      lines.push(`  Existing: "${dup.existing.name}" (${dup.existing.approved ? 'approved' : 'pending'})`);
      lines.push(`  Match type: ${dup.matchType}`);
      lines.push(`  Similarity: ${formatSimilarity(dup.nameSimilarity)}`);
      lines.push(`  Distance: ${formatDistance(dup.distanceMeters)}`);
      lines.push(`  Recommendation: ${dup.recommendation.toUpperCase()}`);
      lines.push(`  Notes: ${dup.notes}`);
      lines.push('');
    }
  }

  // Flagged for review
  if (result.flaggedForReview.length > 0) {
    lines.push('Flagged for Review:');
    lines.push('-'.repeat(70));

    for (const flagged of result.flaggedForReview) {
      lines.push(`  Name: "${flagged.name}" (${flagged.source})`);
      lines.push(`  Verification: ${flagged.verificationStatus}`);
      if (flagged.reviewNotes && flagged.reviewNotes.length > 0) {
        lines.push(`  Reasons:`);
        for (const note of flagged.reviewNotes) {
          lines.push(`    - ${note}`);
        }
      }
      lines.push('');
    }
  }

  lines.push('='.repeat(70));

  return lines.join('\n');
}
