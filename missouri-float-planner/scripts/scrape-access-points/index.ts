#!/usr/bin/env npx tsx
/**
 * Access Point Scraper - Main Entry Point
 *
 * Scrapes access points from multiple sources, verifies with Google Places API,
 * deduplicates against existing data, and generates import files.
 *
 * Usage:
 *   npx tsx scripts/scrape-access-points/index.ts                # Interactive river picker
 *   npx tsx scripts/scrape-access-points/index.ts --river=current  # Specific river
 *   npx tsx scripts/scrape-access-points/index.ts --help          # Show help
 */

import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

import type {
  River,
  ScrapedAccessPoint,
  VerifiedAccessPoint,
  ExistingAccessPoint,
  ScraperOutput,
  SourceScraper,
} from './types';
import { DEFAULT_CONFIG } from './config';
import { GooglePlacesClient, batchVerifyAccessPoints } from './google-places';
import {
  deduplicateAccessPoints,
  deduplicateScrapedData,
  generateDeduplicationReport,
} from './deduplicator';
import { exportToJSON, exportToSQL, exportSummary } from './exporter';

// Import scrapers
import { missouriScenicRiversScraper } from './scrapers/missouriscenicrivers';
import { usgsScraper } from './scrapers/usgs';
import { moherpScraper } from './scrapers/moherp';
import { floatMissouriScraper } from './scrapers/floatmissouri';
import { ozarkFloatingScraper } from './scrapers/ozarkfloating';

// Load environment variables
loadEnvConfig(process.cwd());

// ============================================
// CONSTANTS
// ============================================

const ALL_SCRAPERS: SourceScraper[] = [
  missouriScenicRiversScraper,
  usgsScraper,
  moherpScraper,
  floatMissouriScraper,
  ozarkFloatingScraper,
];

// ============================================
// SUPABASE CLIENT
// ============================================

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase credentials. Check .env.local file.');
  }

  return createClient(supabaseUrl, serviceKey);
}

// ============================================
// RIVER SELECTION
// ============================================

async function getAllRivers(): Promise<River[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('rivers')
    .select('id, slug, name, length_miles, region')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch rivers: ${error.message}`);
  }

  return data || [];
}

async function selectRiverInteractive(rivers: River[]): Promise<River> {
  console.log('\n📍 Available Rivers:');
  console.log('='.repeat(70));

  rivers.forEach((river, index) => {
    console.log(
      `  ${index + 1}. ${river.name.padEnd(25)} (${river.slug}) - ${river.length_miles} miles`
    );
  });

  console.log('='.repeat(70));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\nSelect a river (enter number): ', (answer) => {
      rl.close();
      const selection = parseInt(answer.trim(), 10);

      if (isNaN(selection) || selection < 1 || selection > rivers.length) {
        console.error('Invalid selection. Exiting.');
        process.exit(1);
      }

      const selectedRiver = rivers[selection - 1];
      console.log(`\n✅ Selected: ${selectedRiver.name}`);
      resolve(selectedRiver);
    });
  });
}

async function selectRiver(riverSlugArg?: string): Promise<River> {
  const rivers = await getAllRivers();

  if (rivers.length === 0) {
    throw new Error('No rivers found in database. Please seed rivers first.');
  }

  if (riverSlugArg) {
    const river = rivers.find((r) => r.slug === riverSlugArg);
    if (!river) {
      console.error(`River not found: ${riverSlugArg}`);
      console.log('\nAvailable rivers:');
      rivers.forEach((r) => console.log(`  - ${r.slug}`));
      process.exit(1);
    }
    return river;
  }

  return selectRiverInteractive(rivers);
}

// ============================================
// EXISTING ACCESS POINTS
// ============================================

async function getExistingAccessPoints(riverId: string): Promise<ExistingAccessPoint[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('access_points')
    .select('id, river_id, name, slug, type, approved, description')
    .eq('river_id', riverId);

  if (error) {
    throw new Error(`Failed to fetch existing access points: ${error.message}`);
  }

  // Convert geometry to lat/lng
  const accessPoints: ExistingAccessPoint[] = [];

  for (const ap of data || []) {
    const { data: coords } = await supabase.rpc('get_access_point_coordinates', {
      p_access_point_id: ap.id,
    });

    accessPoints.push({
      ...ap,
      latitude: coords?.lat || 0,
      longitude: coords?.lng || 0,
    });
  }

  return accessPoints;
}

// ============================================
// MAIN SCRAPING LOGIC
// ============================================

async function scrapeRiver(river: River): Promise<ScraperOutput> {
  console.log('\n' + '='.repeat(70));
  console.log(`SCRAPING ACCESS POINTS FOR ${river.name.toUpperCase()}`);
  console.log('='.repeat(70));

  const warnings: string[] = [];

  // Step 1: Scrape from all sources
  console.log('\n📥 Step 1: Scraping from all sources...');
  const scrapedPoints: ScrapedAccessPoint[] = [];

  for (const scraper of ALL_SCRAPERS) {
    try {
      const points = await scraper.scrape(river.slug, river.name);
      scrapedPoints.push(...points);
    } catch (error) {
      const errorMessage = `Failed to scrape ${scraper.displayName}: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`  ❌ ${errorMessage}`);
      warnings.push(errorMessage);
    }
  }

  console.log(`\n✅ Total scraped: ${scrapedPoints.length} access points`);

  if (scrapedPoints.length === 0) {
    console.log('⚠️ No access points scraped. Check scraper implementations.');
    return {
      river: { slug: river.slug, name: river.name },
      timestamp: new Date().toISOString(),
      sources: DEFAULT_CONFIG.sourcesToScrape,
      stats: {
        totalScraped: 0,
        verified: 0,
        duplicates: 0,
        flagged: 0,
        readyToImport: 0,
      },
      accessPoints: [],
      duplicates: [],
      warnings,
    };
  }

  // Step 2: Remove internal duplicates
  console.log('\n🔍 Step 2: Removing internal duplicates...');
  const deduplicatedScraped = deduplicateScrapedData(scrapedPoints, DEFAULT_CONFIG);

  // Step 3: Verify with Google Places API
  let verifiedPoints: VerifiedAccessPoint[] = [];

  if (DEFAULT_CONFIG.enableGooglePlaces && DEFAULT_CONFIG.googlePlacesApiKey) {
    console.log('\n📍 Step 3: Verifying with Google Places API...');
    const placesClient = new GooglePlacesClient(DEFAULT_CONFIG.googlePlacesApiKey);

    try {
      verifiedPoints = await batchVerifyAccessPoints(
        deduplicatedScraped,
        placesClient,
        river.name
      );
    } catch (error) {
      const errorMessage = `Google Places verification failed: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`  ❌ ${errorMessage}`);
      warnings.push(errorMessage);

      // Continue without verification
      verifiedPoints = deduplicatedScraped.map((ap) => ({
        ...ap,
        verificationStatus: 'skipped' as const,
        verificationNotes: 'Verification skipped due to API error',
      }));
    }
  } else {
    console.log('\n⚠️ Step 3: Skipping Google Places verification (API key not configured)');
    warnings.push('Google Places verification skipped - no API key');
    verifiedPoints = deduplicatedScraped.map((ap) => ({
      ...ap,
      verificationStatus: 'skipped' as const,
      verificationNotes: 'Verification skipped - no API key',
    }));
  }

  // Step 4: Deduplicate against existing database records
  console.log('\n🔍 Step 4: Checking for duplicates in database...');
  const existingPoints = await getExistingAccessPoints(river.id);
  console.log(`  Found ${existingPoints.length} existing access points in database`);

  const deduplicationResult = deduplicateAccessPoints(
    verifiedPoints,
    existingPoints,
    DEFAULT_CONFIG
  );

  // Step 5: Generate output
  console.log('\n📊 Step 5: Generating output files...');

  const stats = {
    totalScraped: scrapedPoints.length,
    verified: verifiedPoints.filter((ap) => ap.verificationStatus === 'verified').length,
    duplicates: deduplicationResult.duplicates.length,
    flagged: deduplicationResult.flaggedForReview.length,
    readyToImport: deduplicationResult.unique.filter((ap) => !ap.needsReview).length,
  };

  const output: ScraperOutput = {
    river: { slug: river.slug, name: river.name },
    timestamp: new Date().toISOString(),
    sources: DEFAULT_CONFIG.sourcesToScrape,
    stats,
    accessPoints: [...deduplicationResult.unique, ...deduplicationResult.flaggedForReview],
    duplicates: deduplicationResult.duplicates,
    warnings,
  };

  // Export files
  exportToJSON(output, DEFAULT_CONFIG.outputDir);
  exportToSQL(output, river.id, DEFAULT_CONFIG.outputDir);
  exportSummary(output, DEFAULT_CONFIG.outputDir);

  // Print deduplication report
  console.log('\n' + generateDeduplicationReport(deduplicationResult));

  return output;
}

// ============================================
// CLI
// ============================================

async function main() {
  const args = process.argv.slice(2);

  // Check for help
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Access Point Scraper

Scrapes access points from multiple sources, verifies with Google Places,
and generates import files.

Usage:
  npx tsx scripts/scrape-access-points/index.ts              # Interactive river picker
  npx tsx scripts/scrape-access-points/index.ts --river=current  # Specific river
  npx tsx scripts/scrape-access-points/index.ts --help       # Show this help

Options:
  --river=SLUG    Specify river slug (e.g., current, meramec)
  --help, -h      Show this help message

Environment Variables:
  GOOGLE_PLACES_API_KEY         Google Places API key (optional but recommended)
  NEXT_PUBLIC_SUPABASE_URL      Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY     Supabase service role key

Configuration:
  Edit scripts/scrape-access-points/config.ts to customize:
  - Deduplication thresholds
  - Sources to scrape
  - Output directory

Next Steps After Scraping:
  1. Review JSON and summary files in scripts/output/scraped-data/
  2. Check for duplicates and warnings
  3. Run SQL script via Supabase SQL Editor
  4. Run: npm run db:snap-access-points
  5. Review in Geo Admin UI and approve points
`);
    process.exit(0);
  }

  // Parse --river argument
  const riverArg = args.find((arg) => arg.startsWith('--river='));
  const riverSlug = riverArg?.split('=')[1];

  try {
    // Select river
    const river = await selectRiver(riverSlug);

    // Scrape
    const output = await scrapeRiver(river);

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ SCRAPING COMPLETE');
    console.log('='.repeat(70));
    console.log(`River: ${output.river.name}`);
    console.log(`Total scraped: ${output.stats.totalScraped}`);
    console.log(`Ready to import: ${output.stats.readyToImport}`);
    console.log(`Duplicates: ${output.stats.duplicates}`);
    console.log(`Flagged for review: ${output.stats.flagged}`);
    console.log('\nOutput files saved to:');
    console.log(`  ${DEFAULT_CONFIG.outputDir}/`);

    if (output.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      output.warnings.forEach((w) => console.log(`  - ${w}`));
    }

    console.log('\nNext steps:');
    console.log('  1. Review the output files');
    console.log('  2. Check duplicates and flagged items');
    console.log('  3. Run the SQL import script');
    console.log('  4. Run: npm run db:snap-access-points');
    console.log('  5. Review and approve in Geo Admin UI');
    console.log('');
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run main function
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
