/**
 * Export module for generating JSON and SQL files
 */

import type { ScraperOutput, VerifiedAccessPoint } from './types';
import * as fs from 'fs';
import * as path from 'path';
import { slugify } from './config';

// ============================================
// JSON EXPORT
// ============================================

/**
 * Export scraper output to JSON file
 */
export function exportToJSON(
  output: ScraperOutput,
  outputDir: string
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${output.river.slug}-${timestamp}.json`;
  const filepath = path.join(outputDir, filename);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write JSON file
  const jsonContent = JSON.stringify(output, null, 2);
  fs.writeFileSync(filepath, jsonContent, 'utf-8');

  console.log(`\n✅ JSON exported to: ${filepath}`);
  return filepath;
}

// ============================================
// SQL EXPORT
// ============================================

/**
 * Export access points to SQL import script
 */
export function exportToSQL(
  output: ScraperOutput,
  riverId: string,
  outputDir: string
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${output.river.slug}-${timestamp}.sql`;
  const filepath = path.join(outputDir, filename);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate SQL content
  const sqlLines: string[] = [];

  // Header
  sqlLines.push(`-- Access Points Import for ${output.river.name}`);
  sqlLines.push(`-- Generated: ${output.timestamp}`);
  sqlLines.push(`-- Sources: ${output.sources.join(', ')}`);
  sqlLines.push(`-- Total access points: ${output.accessPoints.length}`);
  sqlLines.push('');
  sqlLines.push('-- ============================================');
  sqlLines.push('-- INSTRUCTIONS');
  sqlLines.push('-- ============================================');
  sqlLines.push('-- 1. Review the JSON file for duplicates and warnings');
  sqlLines.push('-- 2. Manually approve data before running this script');
  sqlLines.push('-- 3. Run via Supabase SQL Editor or CLI');
  sqlLines.push('-- 4. Access points will be created as UNAPPROVED (approved=false)');
  sqlLines.push('-- 5. Run snap-access-points script after import');
  sqlLines.push('-- 6. Review in Geo Admin UI before approving');
  sqlLines.push('');

  // Only include unique access points (not duplicates)
  const uniquePoints = output.accessPoints.filter(ap => {
    const isDuplicate = output.duplicates.some(dup => dup.scraped === ap);
    return !isDuplicate;
  });

  if (uniquePoints.length === 0) {
    sqlLines.push('-- No unique access points to import');
  } else {
    sqlLines.push('-- ============================================');
    sqlLines.push(`-- INSERT ACCESS POINTS (${uniquePoints.length} total)`);
    sqlLines.push('-- ============================================');
    sqlLines.push('');

    for (const ap of uniquePoints) {
      sqlLines.push(...generateInsertStatement(ap, riverId));
      sqlLines.push('');
    }
  }

  // Append duplicates as comments
  if (output.duplicates.length > 0) {
    sqlLines.push('-- ============================================');
    sqlLines.push(`-- SKIPPED DUPLICATES (${output.duplicates.length} total)`);
    sqlLines.push('-- ============================================');
    sqlLines.push('--');

    for (const dup of output.duplicates) {
      sqlLines.push(`-- "${dup.scraped.name}" (${dup.scraped.source})`);
      sqlLines.push(`--   Matches: "${dup.existing.name}" (${dup.existing.approved ? 'approved' : 'pending'})`);
      sqlLines.push(`--   Reason: ${dup.notes}`);
      sqlLines.push('--');
    }
  }

  // Append flagged items as comments
  if (output.accessPoints.filter(ap => ap.needsReview).length > 0) {
    sqlLines.push('-- ============================================');
    sqlLines.push('-- FLAGGED FOR REVIEW');
    sqlLines.push('-- ============================================');
    sqlLines.push('--');

    for (const ap of output.accessPoints.filter(ap => ap.needsReview)) {
      sqlLines.push(`-- "${ap.name}" (${ap.source})`);
      if (ap.reviewNotes) {
        for (const note of ap.reviewNotes) {
          sqlLines.push(`--   - ${note}`);
        }
      }
      sqlLines.push('--');
    }
  }

  // Write SQL file
  const sqlContent = sqlLines.join('\n');
  fs.writeFileSync(filepath, sqlContent, 'utf-8');

  console.log(`✅ SQL exported to: ${filepath}`);
  return filepath;
}

/**
 * Generate SQL INSERT statement for an access point
 */
function generateInsertStatement(
  ap: VerifiedAccessPoint,
  riverId: string
): string[] {
  const lines: string[] = [];
  const slug = slugify(ap.name);

  lines.push(`-- ${ap.name} (${ap.source})`);

  // Check for issues
  if (!ap.latitude || !ap.longitude) {
    lines.push('-- WARNING: Missing coordinates - REVIEW REQUIRED');
  }
  if (ap.verificationStatus === 'not_found') {
    lines.push('-- WARNING: Not verified with Google Places');
  }
  if (ap.needsReview) {
    lines.push('-- WARNING: Flagged for manual review');
  }

  lines.push('INSERT INTO access_points (');
  lines.push('  river_id,');
  lines.push('  name,');
  lines.push('  slug,');
  lines.push('  type,');
  lines.push('  location_orig,');

  if (ap.drivingLatitude && ap.drivingLongitude) {
    lines.push('  driving_lat,');
    lines.push('  driving_lng,');
  }

  if (ap.directionsOverride) {
    lines.push('  directions_override,');
  }

  lines.push('  is_public,');

  if (ap.ownership) {
    lines.push('  ownership,');
  }

  if (ap.description) {
    lines.push('  description,');
  }

  if (ap.amenities && ap.amenities.length > 0) {
    lines.push('  amenities,');
  }

  if (ap.parkingInfo) {
    lines.push('  parking_info,');
  }

  if (ap.feeRequired !== undefined) {
    lines.push('  fee_required,');
  }

  if (ap.feeNotes) {
    lines.push('  fee_notes,');
  }

  lines.push('  approved,');
  lines.push('  created_at,');
  lines.push('  updated_at');
  lines.push(') VALUES (');
  lines.push(`  '${riverId}'::uuid,`);
  lines.push(`  ${escapeSQLString(ap.name)},`);
  lines.push(`  ${escapeSQLString(slug)},`);
  lines.push(`  '${ap.type}',`);

  // location_orig as PostGIS Point
  if (ap.latitude && ap.longitude) {
    lines.push(`  ST_SetSRID(ST_MakePoint(${ap.longitude}, ${ap.latitude}), 4326),`);
  } else {
    lines.push(`  NULL,`);
  }

  if (ap.drivingLatitude && ap.drivingLongitude) {
    lines.push(`  ${ap.drivingLatitude},`);
    lines.push(`  ${ap.drivingLongitude},`);
  }

  if (ap.directionsOverride) {
    lines.push(`  ${escapeSQLString(ap.directionsOverride)},`);
  }

  lines.push(`  ${ap.isPublic},`);

  if (ap.ownership) {
    lines.push(`  '${ap.ownership}',`);
  }

  if (ap.description) {
    lines.push(`  ${escapeSQLString(ap.description)},`);
  }

  if (ap.amenities && ap.amenities.length > 0) {
    const amenitiesArray = `ARRAY[${ap.amenities.map(a => escapeSQLString(a)).join(', ')}]::text[]`;
    lines.push(`  ${amenitiesArray},`);
  }

  if (ap.parkingInfo) {
    lines.push(`  ${escapeSQLString(ap.parkingInfo)},`);
  }

  if (ap.feeRequired !== undefined) {
    lines.push(`  ${ap.feeRequired},`);
  }

  if (ap.feeNotes) {
    lines.push(`  ${escapeSQLString(ap.feeNotes)},`);
  }

  lines.push(`  false, -- approved (requires manual review)`);
  lines.push(`  NOW(),`);
  lines.push(`  NOW()`);
  lines.push(`)');
  lines.push(`ON CONFLICT (river_id, slug) DO NOTHING;`);

  return lines;
}

/**
 * Escape SQL string value
 */
function escapeSQLString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

// ============================================
// SUMMARY EXPORT
// ============================================

/**
 * Export a human-readable summary
 */
export function exportSummary(output: ScraperOutput, outputDir: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${output.river.slug}-${timestamp}-summary.txt`;
  const filepath = path.join(outputDir, filename);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const lines: string[] = [];

  lines.push('='.repeat(70));
  lines.push(`ACCESS POINT SCRAPING SUMMARY`);
  lines.push('='.repeat(70));
  lines.push('');
  lines.push(`River: ${output.river.name}`);
  lines.push(`Timestamp: ${output.timestamp}`);
  lines.push(`Sources: ${output.sources.join(', ')}`);
  lines.push('');

  lines.push('Statistics:');
  lines.push(`  Total scraped: ${output.stats.totalScraped}`);
  lines.push(`  Verified: ${output.stats.verified}`);
  lines.push(`  Duplicates: ${output.stats.duplicates}`);
  lines.push(`  Flagged: ${output.stats.flagged}`);
  lines.push(`  Ready to import: ${output.stats.readyToImport}`);
  lines.push('');

  if (output.warnings.length > 0) {
    lines.push('Warnings:');
    for (const warning of output.warnings) {
      lines.push(`  ⚠️ ${warning}`);
    }
    lines.push('');
  }

  lines.push('Next Steps:');
  lines.push('  1. Review the JSON file for data accuracy');
  lines.push('  2. Check duplicates section for potential conflicts');
  lines.push('  3. Review flagged items before import');
  lines.push('  4. Run the SQL script via Supabase SQL Editor');
  lines.push('  5. Run snap-access-points script to calculate river miles');
  lines.push('  6. Review in Geo Admin UI and approve');
  lines.push('');
  lines.push('='.repeat(70));

  const content = lines.join('\n');
  fs.writeFileSync(filepath, content, 'utf-8');

  console.log(`✅ Summary exported to: ${filepath}`);
  return filepath;
}
