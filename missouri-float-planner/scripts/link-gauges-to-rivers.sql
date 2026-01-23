-- Link gauge stations to rivers in bulk using spatial proximity.
-- Adjust the threshold_miles value before running.
-- Requires PostGIS (used by existing schema).

-- ============================================
-- CONFIG
-- ============================================
-- Distance threshold (miles) to consider a gauge "related" to a river.
-- Update as needed (e.g., 15, 25, 50).
-- Replace the value in the CTE below.

-- ============================================
-- LINK ALL GAUGES WITHIN THRESHOLD
-- ============================================
WITH candidates AS (
  SELECT
    r.id AS river_id,
    gs.id AS gauge_station_id,
    ST_Distance(r.geom::geography, gs.location::geography) / 1609.34 AS distance_miles
  FROM rivers r
  JOIN gauge_stations gs ON gs.active = TRUE
  WHERE ST_DWithin(
    r.geom::geography,
    gs.location::geography,
    15 * 1609.34
  )
)
INSERT INTO river_gauges (
  river_id,
  gauge_station_id,
  distance_from_section_miles,
  is_primary,
  accuracy_warning_threshold_miles
)
SELECT
  river_id,
  gauge_station_id,
  distance_miles,
  FALSE,
  15.0
FROM candidates
ON CONFLICT (river_id, gauge_station_id)
DO UPDATE SET
  distance_from_section_miles = EXCLUDED.distance_from_section_miles;

-- ============================================
-- SET PRIMARY GAUGE PER RIVER (NEAREST)
-- ============================================
WITH ranked AS (
  SELECT
    r.id AS river_id,
    gs.id AS gauge_station_id,
    ROW_NUMBER() OVER (
      PARTITION BY r.id
      ORDER BY ST_Distance(r.geom::geography, gs.location::geography)
    ) AS rn
  FROM rivers r
  JOIN gauge_stations gs ON gs.active = TRUE
  WHERE ST_DWithin(
    r.geom::geography,
    gs.location::geography,
    15 * 1609.34
  )
)
UPDATE river_gauges rg
SET is_primary = (ranked.rn = 1)
FROM ranked
WHERE rg.river_id = ranked.river_id
  AND rg.gauge_station_id = ranked.gauge_station_id;

-- ============================================
-- OPTIONAL: REVIEW RESULTS
-- ============================================
-- SELECT
--   r.name AS river_name,
--   gs.name AS gauge_name,
--   gs.usgs_site_id,
--   rg.distance_from_section_miles,
--   rg.is_primary
-- FROM river_gauges rg
-- JOIN rivers r ON r.id = rg.river_id
-- JOIN gauge_stations gs ON gs.id = rg.gauge_station_id
-- ORDER BY r.name, rg.is_primary DESC, rg.distance_from_section_miles ASC;
