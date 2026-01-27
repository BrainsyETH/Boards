# Access Point Scraper

Automated system for scraping, verifying, and importing river access points from multiple sources.

## Overview

This script:
1. **Scrapes** access points from 5 different sources
2. **Verifies** locations using Google Places API
3. **Deduplicates** against existing database records
4. **Generates** JSON and SQL import files
5. **Flags** potential issues for manual review

## Quick Start

### Prerequisites

1. **Environment Variables** - Add to `.env.local`:
   ```bash
   # Required
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Optional but recommended
   GOOGLE_PLACES_API_KEY=your_google_api_key
   ```

2. **Google Places API Key** (optional but recommended):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Places API"
   - Create API key
   - Add to `.env.local`

### Usage

```bash
# Interactive mode - pick river from list
npx tsx scripts/scrape-access-points/index.ts

# Specify river directly
npx tsx scripts/scrape-access-points/index.ts --river=current

# Show help
npx tsx scripts/scrape-access-points/index.ts --help
```

## How It Works

### Step 1: Scraping

The script scrapes access points from:
- **missouriscenicrivers.com** - Missouri Scenic Rivers
- **waterdata.usgs.gov** - USGS Water Data
- **rivers.moherp.org** - MO HERP Rivers
- **floatmissouri.com** - Float Missouri
- **ozarkfloating.com** - Ozark Floating

Each source scraper extracts:
- Access point name
- Coordinates (if available)
- Description
- Amenities
- Access type (boat ramp, bridge, campground, etc.)

### Step 2: Internal Deduplication

Removes duplicates from scraped data (same access point from multiple sources).

### Step 3: Google Places Verification

For each access point:
- Searches Google Places API
- Gets accurate coordinates
- Retrieves formatted address
- Sets `directions_override` field

### Step 4: Database Deduplication

Compares scraped points against existing database records:
- **Name similarity** (using Levenshtein distance)
- **Coordinate proximity** (within 100m threshold)

Flags potential duplicates for review.

### Step 5: Export

Generates three files:
1. **JSON file** - Full data for review
2. **SQL file** - Import script
3. **Summary file** - Human-readable report

## Output Files

Files are saved to `scripts/output/scraped-data/`:

```
current-2024-01-27T10-30-00.json      # Complete data
current-2024-01-27T10-30-00.sql       # SQL import script
current-2024-01-27T10-30-00-summary.txt  # Summary report
```

### JSON File Structure

```json
{
  "river": { "slug": "current", "name": "Current River" },
  "timestamp": "2024-01-27T10:30:00Z",
  "sources": ["missouriscenicrivers", "usgs", ...],
  "stats": {
    "totalScraped": 25,
    "verified": 22,
    "duplicates": 3,
    "flagged": 2,
    "readyToImport": 20
  },
  "accessPoints": [...],
  "duplicates": [...],
  "warnings": [...]
}
```

### SQL File

Ready-to-run SQL script:
- INSERT statements for each access point
- Sets `approved=false` (requires manual review)
- Comments for duplicates and flagged items
- ON CONFLICT handling

## Configuration

Edit `scripts/scrape-access-points/config.ts`:

```typescript
export const DEFAULT_CONFIG: ScraperConfig = {
  deduplicationThresholds: {
    nameSimiarlityThreshold: 0.85,  // 85% similar = duplicate
    proximityThresholdMeters: 100,  // Within 100m = duplicate
  },
  enableGooglePlaces: true,
  sourcesToScrape: [
    'missouriscenicrivers',
    'usgs',
    'moherp',
    'floatmissouri',
    'ozarkfloating',
  ],
};
```

## Coordinate Logic

The script populates:

1. **`location_orig`** (GEOMETRY Point)
   - Primary access point coordinates
   - From Google Places or scraped data
   - Used for snapping to river centerline

2. **`driving_lat` / `driving_lng`** (NUMERIC)
   - Separate parking/driving destination
   - Used when parking is different from access point
   - Falls back to `location_orig` if not set

3. **`directions_override`** (TEXT)
   - Google Places name/address
   - Used for navigation (better than raw coords)
   - Example: "Bennett Spring State Park, Lebanon MO"

## Type Detection

Automatic type detection using keywords:

| Type | Keywords |
|------|----------|
| `boat_ramp` | "boat ramp", "launch", "concrete ramp" |
| `gravel_bar` | "gravel bar", "sand bar", "informal access" |
| `campground` | "campground", "camping", "rv park" |
| `bridge` | "bridge", "highway bridge" |
| `park` | "state park", "national park", "city park" |
| `access` | Default if no keywords match |

## Deduplication

### Name Matching
- Normalizes names (removes "Access", "Boat Ramp", etc.)
- Calculates Levenshtein distance
- 85% similarity threshold

### Coordinate Matching
- Haversine distance formula
- 100m proximity threshold

### Match Types
- **exact_name** - Identical names
- **similar_name** - 85%+ similar
- **close_coordinates** - Within 100m
- **both** - Name + coordinates match

### Recommendations
- **skip** - Very likely duplicate
- **flag** - Potential duplicate, needs review

## After Scraping

### 1. Review Output Files

Check JSON and summary files:
- Verify access point data
- Review flagged items
- Check duplicate matches

### 2. Run SQL Import

```bash
# Via Supabase SQL Editor
# Copy/paste contents of generated SQL file

# Or via psql
psql -U postgres -h your-db-host -d your-db -f current-2024-01-27T10-30-00.sql
```

### 3. Snap Access Points

```bash
npm run db:snap-access-points
```

This:
- Snaps `location_orig` to river centerline
- Calculates `river_mile_downstream`
- Updates `location_snap`

### 4. Review in Geo Admin

- Go to admin panel
- Check unapproved access points
- Verify coordinates on map
- Approve when ready

## Implementing Scrapers

Each scraper in `scrapers/` folder implements `SourceScraper` interface:

```typescript
export const exampleScraper: SourceScraper = {
  name: 'example',
  displayName: 'Example Source',
  baseUrl: 'https://example.com',

  async scrape(riverSlug: string, riverName: string): Promise<ScrapedAccessPoint[]> {
    // 1. Fetch data from source
    const url = `${this.baseUrl}/rivers/${riverSlug}`;
    const response = await fetch(url);
    const html = await response.text();

    // 2. Parse HTML (use cheerio, jsdom, or regex)
    // 3. Extract access points
    // 4. Return array of ScrapedAccessPoint objects

    return accessPoints;
  },
};
```

### Helper Functions

```typescript
import {
  detectType,        // Detect access point type from text
  detectOwnership,   // Detect ownership from text
  detectAmenities,   // Extract amenities from text
  parseCoordinates,  // Parse coordinates from text
} from '../config';

import {
  extractTextFromHTML,  // Strip HTML tags
  cleanText,            // Clean up text
} from '../utils';
```

## Troubleshooting

### "No access points scraped"

**Cause**: Scrapers not implemented yet
**Solution**: Implement scraper logic in `scrapers/` folder

### "Google Places verification failed"

**Cause**: Missing API key or rate limit
**Solution**:
- Add `GOOGLE_PLACES_API_KEY` to `.env.local`
- Check API quotas in Google Cloud Console

### "Missing Supabase credentials"

**Cause**: Environment variables not loaded
**Solution**: Create `.env.local` with Supabase credentials

### "River not found"

**Cause**: River slug doesn't exist in database
**Solution**:
```bash
# List available rivers
npx tsx scripts/scrape-access-points/index.ts
# Then select from the list
```

## API Rate Limits

### Google Places API
- Default: 50 requests per second
- Script adds 200ms delay between requests
- Implements exponential backoff on errors

### Source Websites
- Be respectful
- Add delays if needed
- Cache responses when possible

## Data Flow

```
┌─────────────────┐
│  Source Sites   │
│  (5 sources)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Scrapers      │
│  Extract data   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Internal Dedup  │
│  Merge sources  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Google Places   │
│ Verify coords   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Database Dedup  │
│ Check existing  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Export Files    │
│ JSON + SQL      │
└─────────────────┘
```

## Project Structure

```
scrape-access-points/
├── index.ts                    # Main entry point
├── types.ts                    # TypeScript interfaces
├── config.ts                   # Configuration & constants
├── utils.ts                    # Helper functions
├── google-places.ts            # Google Places verification
├── deduplicator.ts             # Deduplication logic
├── exporter.ts                 # JSON/SQL export
├── scrapers/                   # Source-specific scrapers
│   ├── missouriscenicrivers.ts
│   ├── usgs.ts
│   ├── moherp.ts
│   ├── floatmissouri.ts
│   └── ozarkfloating.ts
└── README.md                   # This file
```

## Contributing

When adding a new scraper:

1. Create file in `scrapers/` folder
2. Implement `SourceScraper` interface
3. Export scraper object
4. Import in `index.ts`
5. Add to `ALL_SCRAPERS` array
6. Test with a single river first

## Future Enhancements

- [ ] Web UI for reviewing scraped data
- [ ] Automatic approval for high-confidence matches
- [ ] Support for POI scraping (not just access points)
- [ ] Scheduled scraping (cron jobs)
- [ ] Email notifications for new access points
- [ ] API endpoint for real-time scraping
