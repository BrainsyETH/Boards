-- scripts/link-gauges-to-rivers.sql
-- Automatically link gauge stations to nearby rivers based on proximity
-- Run after importing gauge stations and rivers

-- Distance threshold in meters (15 miles = 15 * 1609.34 meters)
-- Adjust based on your needs:
--   5 miles (~8km) = tight, only very close gauges
--   10 miles (~16km) = moderate, good balance
--   15 miles (~24km) = loose, catches more gauges but less accurate
--   20+ miles = very loose, may link unrelated gauges

DO $$
DECLARE
    distance_miles CONSTANT numeric := 10; -- ADJUST THIS VALUE
    distance_meters CONSTANT numeric := distance_miles * 1609.34;
    links_created integer := 0;
BEGIN
    -- Clear existing auto-generated links (keep manual ones by checking for specific IDs if needed)
    -- DELETE FROM river_gauges WHERE is_auto_linked = true;

    -- Insert new links for gauges within threshold distance of river geometry
    INSERT INTO river_gauges (
        river_id,
        gauge_station_id,
        distance_from_section_miles,
        is_primary,
        accuracy_warning_threshold_miles,
        threshold_unit
    )
    SELECT DISTINCT ON (g.id, r.id)
        r.id as river_id,
        g.id as gauge_station_id,
        -- Calculate distance in miles
        ROUND((ST_Distance(
            g.location::geography,
            r.geom::geography
        ) / 1609.34)::numeric, 1) as distance_from_section_miles,
        -- Mark as primary if it's the closest gauge to this river
        ROW_NUMBER() OVER (
            PARTITION BY r.id
            ORDER BY ST_Distance(g.location::geography, r.geom::geography)
        ) = 1 as is_primary,
        -- Set warning threshold based on distance
        CASE
            WHEN ST_Distance(g.location::geography, r.geom::geography) < 5 * 1609.34 THEN 5
            WHEN ST_Distance(g.location::geography, r.geom::geography) < 10 * 1609.34 THEN 10
            ELSE 15
        END as accuracy_warning_threshold_miles,
        'miles' as threshold_unit
    FROM gauge_stations g
    CROSS JOIN rivers r
    WHERE
        g.active = true
        AND ST_DWithin(
            g.location::geography,
            r.geom::geography,
            distance_meters
        )
        -- Don't create duplicate links
        AND NOT EXISTS (
            SELECT 1 FROM river_gauges rg
            WHERE rg.river_id = r.id
            AND rg.gauge_station_id = g.id
        )
    ORDER BY g.id, r.id, ST_Distance(g.location::geography, r.geom::geography);

    GET DIAGNOSTICS links_created = ROW_COUNT;
    RAISE NOTICE 'Created % gauge-river links within % mile radius', links_created, distance_miles;
END $$;

-- View results
SELECT
    r.name as river_name,
    g.name as gauge_name,
    g.usgs_site_id,
    rg.distance_from_section_miles,
    rg.is_primary,
    rg.accuracy_warning_threshold_miles
FROM river_gauges rg
JOIN rivers r ON r.id = rg.river_id
JOIN gauge_stations g ON g.id = rg.gauge_station_id
ORDER BY r.name, rg.distance_from_section_miles;
