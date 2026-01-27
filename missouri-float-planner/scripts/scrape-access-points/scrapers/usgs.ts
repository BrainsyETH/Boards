/**
 * Scraper for USGS (waterdata.usgs.gov)
 * TODO: Implement based on USGS API or website structure
 */

import type { SourceScraper, ScrapedAccessPoint } from '../types';
import { SOURCE_URLS, detectType, detectOwnership } from '../config';

export const usgsScraper: SourceScraper = {
  name: 'usgs',
  displayName: 'USGS Water Data',
  baseUrl: SOURCE_URLS.usgs,

  async scrape(riverSlug: string, riverName: string): Promise<ScrapedAccessPoint[]> {
    console.log(`\n📍 Scraping USGS for ${riverName}...`);

    try {
      // TODO: Implement USGS scraping
      // Note: USGS primarily provides gauge station data, not access points
      // This scraper might be better suited for gauge stations
      // or could scrape from USGS recreation data if available

      const accessPoints: ScrapedAccessPoint[] = [];

      // USGS might have API endpoints like:
      // https://waterdata.usgs.gov/nwis/inventory?format=rdb&site_tp_cd=ST&state_cd=MO

      // For now, returning empty array
      // Implement based on actual USGS data availability

      console.log(`  ⚠️ USGS scraper not yet implemented`);
      return accessPoints;
    } catch (error) {
      console.error(`  ❌ Error scraping USGS: ${error}`);
      return [];
    }
  },
};
