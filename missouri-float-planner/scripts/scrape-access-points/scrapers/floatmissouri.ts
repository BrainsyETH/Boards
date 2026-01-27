/**
 * Scraper for floatmissouri.com
 * TODO: Implement based on website structure
 */

import type { SourceScraper, ScrapedAccessPoint } from '../types';
import { SOURCE_URLS, detectType, detectOwnership, detectAmenities } from '../config';
import { parseCoordinates } from '../utils';

export const floatMissouriScraper: SourceScraper = {
  name: 'floatmissouri',
  displayName: 'Float Missouri',
  baseUrl: SOURCE_URLS.floatmissouri,

  async scrape(riverSlug: string, riverName: string): Promise<ScrapedAccessPoint[]> {
    console.log(`\n📍 Scraping Float Missouri for ${riverName}...`);

    try {
      // TODO: Implement Float Missouri scraping
      // Note: There's already import-floatmissouri.ts script
      // This scraper could potentially reuse that logic

      const accessPoints: ScrapedAccessPoint[] = [];

      // Could potentially call existing floatmissouri import logic
      // or scrape directly from the website

      console.log(`  ⚠️ Float Missouri scraper not yet implemented`);
      console.log(`  💡 Note: Consider reusing logic from scripts/import-floatmissouri.ts`);
      return accessPoints;
    } catch (error) {
      console.error(`  ❌ Error scraping Float Missouri: ${error}`);
      return [];
    }
  },
};
