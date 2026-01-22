# Missouri River Float Planner - Master Plan

> **Purpose**: This document serves as the complete technical specification for building a Missouri river float trip planning web application. It is designed to be fed to Claude Code for implementation.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [API Specifications](#5-api-specifications)
6. [Frontend Components](#6-frontend-components)
7. [External Integrations](#7-external-integrations)
8. [Data Requirements](#8-data-requirements)
9. [Implementation Phases](#9-implementation-phases)
10. [Environment Variables](#10-environment-variables)
11. [Deployment](#11-deployment)

---

## 1. Project Overview

### 1.1 Description

A web application for planning float trips on Missouri rivers. Users select a put-in and take-out point on an interactive map, and the app calculates:

- River distance (miles)
- Estimated float time (based on vessel type and current water conditions)
- Drive-back shuttle time
- Current river conditions (from USGS gauge data)

### 1.2 MVP Rivers

1. Meramec
2. Current
3. Eleven Point
4. Jacks Fork
5. Niangua
6. Big Piney
7. Huzzah
8. Courtois

### 1.3 Key Features

- Interactive map with river lines and access point markers
- Click-to-select put-in and take-out points
- Real-time water conditions from USGS gauges
- Float time estimates by vessel type (raft, canoe, kayak)
- Driving shuttle time calculation
- Shareable plan URLs
- Admin panel for managing access points

### 1.4 Out of Scope (MVP)

- User accounts for general users
- User-submitted access points (admin-only for MVP)
- Native mobile apps
- Arbitrary point selection (must use predefined access points)
- Multi-day trip planning
- Outfitter integrations or booking

---

## 2. Technology Stack

### 2.1 Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 14+ | React framework with App Router |
| TypeScript | Type safety |
| MapLibre GL JS | Interactive maps |
| Tailwind CSS | Styling |
| React Query (TanStack Query) | Data fetching and caching |

### 2.2 Backend

| Technology | Purpose |
|------------|---------|
| Next.js API Routes | Serverless API endpoints |
| Supabase | PostgreSQL database + Auth |
| PostGIS | Geospatial queries |
| pg_cron | Scheduled gauge updates |

### 2.3 External Services

| Service | Purpose |
|---------|---------|
| USGS Water Services API | Real-time gauge data |
| Mapbox Directions API | Driving time calculations |
| MapTiler / OpenStreetMap | Base map tiles |

### 2.4 Deployment

| Service | Purpose |
|---------|---------|
| Vercel | Frontend + API hosting |
| Supabase Cloud | Database hosting |

---

## 3. Project Structure

```
missouri-float-planner/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Home/map page
│   │   ├── plan/
│   │   │   └── [shortCode]/
│   │   │       └── page.tsx            # Shareable plan view
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Admin auth wrapper
│   │   │   ├── page.tsx                # Admin dashboard
│   │   │   ├── access-points/
│   │   │   │   └── page.tsx            # Manage access points
│   │   │   └── rivers/
│   │   │       └── page.tsx            # Manage rivers
│   │   └── api/
│   │       ├── rivers/
│   │       │   └── route.ts            # GET rivers list
│   │       ├── rivers/
│   │       │   └── [id]/
│   │       │       ├── route.ts        # GET river details
│   │       │       └── access-points/
│   │       │           └── route.ts    # GET access points for river
│   │       ├── plan/
│   │       │   ├── route.ts            # GET calculate plan
│   │       │   └── save/
│   │       │       └── route.ts        # POST save plan
│   │       ├── conditions/
│   │       │   └── [riverId]/
│   │       │       └── route.ts        # GET current conditions
│   │       ├── admin/
│   │       │   ├── access-points/
│   │       │   │   ├── route.ts        # POST create, GET all
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts    # PUT update, DELETE
│   │       │   └── update-gauges/
│   │       │       └── route.ts        # POST trigger gauge update
│   │       └── cron/
│   │           └── update-gauges/
│   │               └── route.ts        # Vercel cron endpoint
│   ├── components/
│   │   ├── map/
│   │   │   ├── MapContainer.tsx        # Main map wrapper
│   │   │   ├── RiverLayer.tsx          # River line rendering
│   │   │   ├── AccessPointMarkers.tsx  # Access point icons
│   │   │   ├── RouteHighlight.tsx      # Selected segment highlight
│   │   │   └── AccessPointPopup.tsx    # Info popup
│   │   ├── plan/
│   │   │   ├── PlanSummary.tsx         # Trip details panel
│   │   │   ├── VesselSelector.tsx      # Raft/canoe/kayak picker
│   │   │   ├── ConditionBadge.tsx      # Water condition indicator
│   │   │   └── ShareButton.tsx         # Copy shareable URL
│   │   ├── ui/
│   │   │   ├── RiverSelector.tsx       # Dropdown to pick river
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── Button.tsx
│   │   └── admin/
│   │       ├── AccessPointForm.tsx
│   │       ├── AccessPointList.tsx
│   │       └── GaugeStatus.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser client
│   │   │   ├── server.ts               # Server client
│   │   │   └── admin.ts                # Service role client
│   │   ├── mapbox/
│   │   │   └── directions.ts           # Mapbox API wrapper
│   │   ├── usgs/
│   │   │   └── gauges.ts               # USGS API wrapper
│   │   ├── calculations/
│   │   │   ├── floatTime.ts            # Float duration logic
│   │   │   └── conditions.ts           # Condition label logic
│   │   └── utils/
│   │       ├── geo.ts                  # GeoJSON helpers
│   │       └── formatters.ts           # Display formatting
│   ├── hooks/
│   │   ├── useRivers.ts
│   │   ├── useAccessPoints.ts
│   │   ├── useFloatPlan.ts
│   │   └── useConditions.ts
│   ├── types/
│   │   ├── database.ts                 # Supabase generated types
│   │   ├── api.ts                      # API request/response types
│   │   └── geo.ts                      # GeoJSON types
│   └── constants/
│       └── index.ts                    # App-wide constants
├── supabase/
│   ├── migrations/
│   │   ├── 00001_extensions.sql
│   │   ├── 00002_tables.sql
│   │   ├── 00003_functions.sql
│   │   ├── 00004_rls_policies.sql
│   │   └── 00005_seed_vessel_types.sql
│   └── seed/
│       ├── rivers.sql
│       ├── gauge_stations.sql
│       └── access_points.sql
├── scripts/
│   ├── import-nhd-rivers.ts            # NHD data import script
│   ├── snap-access-points.ts           # Snap points to river lines
│   └── fetch-gauge-stations.ts         # Find USGS stations
├── public/
│   └── markers/
│       ├── access-public.svg
│       ├── access-private.svg
│       ├── put-in.svg
│       └── take-out.svg
├── .env.local.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 4. Database Schema

### 4.1 Extensions

```sql
-- File: supabase/migrations/00001_extensions.sql

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

### 4.2 Tables

```sql
-- File: supabase/migrations/00002_tables.sql

-- ============================================
-- RIVERS
-- ============================================
CREATE TABLE rivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    
    -- Geometry (WGS84 - SRID 4326)
    geom GEOMETRY(LineString, 4326) NOT NULL,
    length_miles NUMERIC(6,2),
    
    -- Flow direction reference
    -- Convention: measure 0 = downstream end (mouth/confluence)
    downstream_point GEOMETRY(Point, 4326),
    direction_verified BOOLEAN DEFAULT FALSE,
    
    -- Display
    description TEXT,
    difficulty_rating TEXT,  -- e.g., "Class I", "Class I-II"
    region TEXT,             -- e.g., "Ozarks", "Central Missouri"
    
    -- Source reference
    nhd_feature_id TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rivers_geom ON rivers USING GIST (geom);
CREATE INDEX idx_rivers_slug ON rivers(slug);

-- ============================================
-- GAUGE STATIONS
-- ============================================
CREATE TABLE gauge_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usgs_site_id TEXT UNIQUE NOT NULL,  -- e.g., "07019000"
    name TEXT NOT NULL,
    
    -- Location
    location GEOMETRY(Point, 4326) NOT NULL,
    
    -- Metadata
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gauge_stations_location ON gauge_stations USING GIST (location);

-- ============================================
-- RIVER <-> GAUGE RELATIONSHIP
-- ============================================
CREATE TABLE river_gauges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    river_id UUID REFERENCES rivers(id) ON DELETE CASCADE,
    gauge_station_id UUID REFERENCES gauge_stations(id) ON DELETE CASCADE,
    
    -- Distance from floatable section
    distance_from_section_miles NUMERIC(5,2),
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Accuracy threshold
    accuracy_warning_threshold_miles NUMERIC(5,2) DEFAULT 15.0,
    
    -- River-specific thresholds
    threshold_unit TEXT DEFAULT 'ft' CHECK (threshold_unit IN ('ft', 'cfs')),
    
    level_too_low NUMERIC(6,2),
    level_low NUMERIC(6,2),
    level_optimal_min NUMERIC(6,2),
    level_optimal_max NUMERIC(6,2),
    level_high NUMERIC(6,2),
    level_dangerous NUMERIC(6,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(river_id, gauge_station_id)
);

-- ============================================
-- GAUGE READINGS
-- ============================================
CREATE TABLE gauge_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gauge_station_id UUID REFERENCES gauge_stations(id) ON DELETE CASCADE,
    
    reading_timestamp TIMESTAMPTZ NOT NULL,
    gauge_height_ft NUMERIC(6,2),
    discharge_cfs NUMERIC(10,2),
    
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(gauge_station_id, reading_timestamp)
);

CREATE INDEX idx_gauge_readings_latest 
    ON gauge_readings(gauge_station_id, reading_timestamp DESC);

-- ============================================
-- ACCESS POINTS
-- ============================================
CREATE TABLE access_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    river_id UUID REFERENCES rivers(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    
    -- Location
    location_orig GEOMETRY(Point, 4326) NOT NULL,
    location_snap GEOMETRY(Point, 4326),
    
    -- Linear reference (miles from downstream end)
    river_mile_downstream NUMERIC(6,2),
    river_mile_upstream NUMERIC(6,2),
    
    -- Classification
    type TEXT DEFAULT 'access' CHECK (type IN (
        'boat_ramp', 'gravel_bar', 'campground', 'bridge', 'access', 'park'
    )),
    is_public BOOLEAN DEFAULT TRUE,
    ownership TEXT,  -- 'MDC', 'NPS', 'private', 'county', 'city', 'state_park'
    
    -- Details
    description TEXT,
    amenities TEXT[],  -- ARRAY['parking', 'restrooms', 'camping', 'boat_ramp', 'picnic']
    parking_info TEXT,
    fee_required BOOLEAN DEFAULT FALSE,
    fee_notes TEXT,
    
    -- Admin workflow
    approved BOOLEAN DEFAULT FALSE,
    submitted_by UUID,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(river_id, slug)
);

CREATE INDEX idx_access_points_geom ON access_points USING GIST (location_snap);
CREATE INDEX idx_access_points_river ON access_points(river_id, river_mile_downstream);
CREATE INDEX idx_access_points_approved ON access_points(approved) WHERE approved = TRUE;

-- ============================================
-- RIVER HAZARDS
-- ============================================
CREATE TABLE river_hazards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    river_id UUID REFERENCES rivers(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'low_water_dam', 'portage', 'strainer', 'rapid', 'private_property', 
        'waterfall', 'shoal', 'bridge_piling', 'other'
    )),
    
    -- Location
    location GEOMETRY(Point, 4326),
    river_mile_downstream NUMERIC(6,2),
    
    -- Details
    description TEXT,
    severity TEXT CHECK (severity IN ('info', 'caution', 'warning', 'danger')),
    portage_required BOOLEAN DEFAULT FALSE,
    portage_side TEXT,  -- 'left', 'right', 'either'
    
    -- Conditional visibility
    active BOOLEAN DEFAULT TRUE,
    seasonal_notes TEXT,
    min_safe_level NUMERIC(6,2),  -- Only relevant above this level
    max_safe_level NUMERIC(6,2),  -- Only relevant below this level
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_river_hazards_river ON river_hazards(river_id, river_mile_downstream);

-- ============================================
-- DRIVE TIME CACHE
-- ============================================
CREATE TABLE drive_time_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    start_access_id UUID REFERENCES access_points(id) ON DELETE CASCADE,
    end_access_id UUID REFERENCES access_points(id) ON DELETE CASCADE,
    
    drive_minutes NUMERIC(5,1),
    drive_miles NUMERIC(6,2),
    route_summary TEXT,
    
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    
    UNIQUE(start_access_id, end_access_id)
);

-- ============================================
-- VESSEL TYPES
-- ============================================
CREATE TABLE vessel_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    
    -- Base speeds (mph) adjusted by flow conditions
    speed_low_water NUMERIC(3,1),
    speed_normal NUMERIC(3,1),
    speed_high_water NUMERIC(3,1),
    
    description TEXT,
    icon TEXT,  -- Icon identifier for UI
    sort_order INT DEFAULT 0
);

-- ============================================
-- SAVED FLOAT PLANS
-- ============================================
CREATE TABLE float_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_code TEXT UNIQUE NOT NULL,  -- For shareable URLs
    
    river_id UUID REFERENCES rivers(id),
    start_access_id UUID REFERENCES access_points(id),
    end_access_id UUID REFERENCES access_points(id),
    vessel_type_id UUID REFERENCES vessel_types(id),
    
    -- Snapshot at creation
    distance_miles NUMERIC(5,2),
    estimated_float_minutes INT,
    drive_back_minutes INT,
    condition_at_creation TEXT,
    gauge_reading_at_creation NUMERIC(6,2),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    view_count INT DEFAULT 0,
    last_viewed_at TIMESTAMPTZ
);

CREATE INDEX idx_float_plans_short_code ON float_plans(short_code);

-- ============================================
-- USER ROLES (for admin)
-- ============================================
CREATE TABLE user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 Functions

```sql
-- File: supabase/migrations/00003_functions.sql

-- ============================================
-- SNAP POINT TO RIVER
-- ============================================
CREATE OR REPLACE FUNCTION snap_to_river(
    p_point GEOMETRY(Point, 4326),
    p_river_id UUID
) RETURNS TABLE (
    snapped_point GEOMETRY(Point, 4326),
    river_mile NUMERIC(6,2),
    distance_from_original_meters NUMERIC(8,2)
) AS $$
DECLARE
    v_river_geom GEOMETRY;
    v_river_length_miles NUMERIC;
    v_fraction NUMERIC;
BEGIN
    SELECT geom, length_miles 
    INTO v_river_geom, v_river_length_miles
    FROM rivers WHERE id = p_river_id;
    
    IF v_river_geom IS NULL THEN
        RAISE EXCEPTION 'River not found: %', p_river_id;
    END IF;
    
    v_fraction := ST_LineLocatePoint(v_river_geom, p_point);
    
    RETURN QUERY SELECT
        ST_LineInterpolatePoint(v_river_geom, v_fraction)::GEOMETRY(Point, 4326),
        (v_fraction * v_river_length_miles)::NUMERIC(6,2),
        ST_Distance(
            p_point::geography, 
            ST_LineInterpolatePoint(v_river_geom, v_fraction)::geography
        )::NUMERIC(8,2);
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- GET FLOAT SEGMENT GEOMETRY
-- ============================================
CREATE OR REPLACE FUNCTION get_float_segment(
    p_start_access_id UUID,
    p_end_access_id UUID
) RETURNS TABLE (
    segment_geom GEOMETRY(LineString, 4326),
    distance_miles NUMERIC(5,2),
    start_name TEXT,
    end_name TEXT,
    start_river_mile NUMERIC(6,2),
    end_river_mile NUMERIC(6,2)
) AS $$
DECLARE
    v_river_id UUID;
    v_river_geom GEOMETRY;
    v_start_mile NUMERIC;
    v_end_mile NUMERIC;
    v_start_name TEXT;
    v_end_name TEXT;
    v_river_length NUMERIC;
    v_start_fraction NUMERIC;
    v_end_fraction NUMERIC;
    v_end_river_id UUID;
BEGIN
    -- Get start access point details
    SELECT ap.river_id, ap.river_mile_downstream, ap.name, r.geom, r.length_miles
    INTO v_river_id, v_start_mile, v_start_name, v_river_geom, v_river_length
    FROM access_points ap
    JOIN rivers r ON r.id = ap.river_id
    WHERE ap.id = p_start_access_id;
    
    IF v_river_id IS NULL THEN
        RAISE EXCEPTION 'Start access point not found: %', p_start_access_id;
    END IF;
    
    -- Get end access point details
    SELECT river_id, river_mile_downstream, name 
    INTO v_end_river_id, v_end_mile, v_end_name
    FROM access_points WHERE id = p_end_access_id;
    
    IF v_end_river_id IS NULL THEN
        RAISE EXCEPTION 'End access point not found: %', p_end_access_id;
    END IF;
    
    IF v_river_id != v_end_river_id THEN
        RAISE EXCEPTION 'Access points must be on the same river';
    END IF;
    
    -- Convert miles to fractions
    v_start_fraction := v_start_mile / v_river_length;
    v_end_fraction := v_end_mile / v_river_length;
    
    -- Return segment (always order fractions correctly for ST_LineSubstring)
    IF v_start_fraction > v_end_fraction THEN
        -- Put-in is upstream (higher river mile)
        RETURN QUERY SELECT
            ST_LineSubstring(v_river_geom, v_end_fraction, v_start_fraction)::GEOMETRY(LineString, 4326),
            ABS(v_start_mile - v_end_mile)::NUMERIC(5,2),
            v_start_name,
            v_end_name,
            v_start_mile,
            v_end_mile;
    ELSE
        -- Put-in is downstream (lower river mile) - unusual but handle it
        RETURN QUERY SELECT
            ST_LineSubstring(v_river_geom, v_start_fraction, v_end_fraction)::GEOMETRY(LineString, 4326),
            ABS(v_end_mile - v_start_mile)::NUMERIC(5,2),
            v_start_name,
            v_end_name,
            v_start_mile,
            v_end_mile;
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- GET RIVER CONDITION
-- ============================================
CREATE OR REPLACE FUNCTION get_river_condition(p_river_id UUID)
RETURNS TABLE (
    condition_label TEXT,
    condition_code TEXT,
    gauge_height_ft NUMERIC,
    discharge_cfs NUMERIC,
    reading_timestamp TIMESTAMPTZ,
    reading_age_hours NUMERIC,
    accuracy_warning BOOLEAN,
    accuracy_warning_reason TEXT,
    gauge_name TEXT,
    gauge_usgs_id TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH primary_gauge AS (
        SELECT 
            rg.gauge_station_id,
            rg.distance_from_section_miles,
            rg.accuracy_warning_threshold_miles,
            rg.threshold_unit,
            rg.level_too_low,
            rg.level_low,
            rg.level_optimal_min,
            rg.level_optimal_max,
            rg.level_high,
            rg.level_dangerous,
            gs.name as gauge_name,
            gs.usgs_site_id
        FROM river_gauges rg
        JOIN gauge_stations gs ON gs.id = rg.gauge_station_id
        WHERE rg.river_id = p_river_id
          AND rg.is_primary = TRUE
          AND gs.active = TRUE
        LIMIT 1
    ),
    latest_reading AS (
        SELECT 
            gr.gauge_height_ft,
            gr.discharge_cfs,
            gr.reading_timestamp,
            EXTRACT(EPOCH FROM (NOW() - gr.reading_timestamp)) / 3600 as age_hours
        FROM gauge_readings gr
        JOIN primary_gauge pg ON pg.gauge_station_id = gr.gauge_station_id
        ORDER BY gr.reading_timestamp DESC
        LIMIT 1
    )
    SELECT
        CASE
            WHEN lr.gauge_height_ft IS NULL THEN 'Unknown'
            WHEN lr.gauge_height_ft >= pg.level_dangerous THEN 'Dangerous - Do Not Float'
            WHEN lr.gauge_height_ft >= pg.level_high THEN 'High Water - Experienced Only'
            WHEN lr.gauge_height_ft >= pg.level_optimal_min 
                 AND lr.gauge_height_ft <= pg.level_optimal_max THEN 'Optimal Conditions'
            WHEN lr.gauge_height_ft >= pg.level_low THEN 'Low - Floatable'
            WHEN lr.gauge_height_ft >= pg.level_too_low THEN 'Very Low - Scraping Likely'
            ELSE 'Too Low - Not Recommended'
        END,
        CASE
            WHEN lr.gauge_height_ft IS NULL THEN 'unknown'
            WHEN lr.gauge_height_ft >= pg.level_dangerous THEN 'dangerous'
            WHEN lr.gauge_height_ft >= pg.level_high THEN 'high'
            WHEN lr.gauge_height_ft >= pg.level_optimal_min 
                 AND lr.gauge_height_ft <= pg.level_optimal_max THEN 'optimal'
            WHEN lr.gauge_height_ft >= pg.level_low THEN 'low'
            WHEN lr.gauge_height_ft >= pg.level_too_low THEN 'very_low'
            ELSE 'too_low'
        END,
        lr.gauge_height_ft,
        lr.discharge_cfs,
        lr.reading_timestamp,
        lr.age_hours::NUMERIC(5,1),
        (pg.distance_from_section_miles > pg.accuracy_warning_threshold_miles 
         OR lr.age_hours > 6),
        CASE
            WHEN pg.distance_from_section_miles > pg.accuracy_warning_threshold_miles 
                THEN 'Gauge is ' || pg.distance_from_section_miles::TEXT || ' miles from float section'
            WHEN lr.age_hours > 6 
                THEN 'Reading is ' || ROUND(lr.age_hours)::TEXT || ' hours old'
            ELSE NULL
        END,
        pg.gauge_name,
        pg.usgs_site_id
    FROM primary_gauge pg
    LEFT JOIN latest_reading lr ON TRUE;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- CALCULATE FLOAT TIME
-- ============================================
CREATE OR REPLACE FUNCTION calculate_float_time(
    p_distance_miles NUMERIC,
    p_vessel_type_id UUID,
    p_condition_code TEXT
) RETURNS TABLE (
    float_minutes INT,
    speed_mph NUMERIC,
    vessel_name TEXT
) AS $$
DECLARE
    v_speed NUMERIC;
    v_vessel_name TEXT;
BEGIN
    SELECT 
        name,
        CASE p_condition_code
            WHEN 'dangerous' THEN NULL  -- Don't calculate for dangerous
            WHEN 'high' THEN speed_high_water
            WHEN 'optimal' THEN speed_normal
            WHEN 'low' THEN speed_low_water
            WHEN 'very_low' THEN speed_low_water * 0.75
            WHEN 'too_low' THEN speed_low_water * 0.5
            ELSE speed_normal  -- Default to normal
        END
    INTO v_vessel_name, v_speed
    FROM vessel_types
    WHERE id = p_vessel_type_id;
    
    IF v_speed IS NULL OR v_speed = 0 THEN
        RETURN QUERY SELECT NULL::INT, NULL::NUMERIC, v_vessel_name;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT
        ROUND((p_distance_miles / v_speed) * 60)::INT,
        v_speed,
        v_vessel_name;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- GENERATE SHORT CODE
-- ============================================
CREATE OR REPLACE FUNCTION generate_short_code(length INT DEFAULT 8)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghjkmnpqrstuvwxyz23456789';  -- No confusing chars
    result TEXT := '';
    i INT;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ============================================
-- TRIGGER: Update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rivers_updated_at
    BEFORE UPDATE ON rivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER access_points_updated_at
    BEFORE UPDATE ON access_points
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER river_hazards_updated_at
    BEFORE UPDATE ON river_hazards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER river_gauges_updated_at
    BEFORE UPDATE ON river_gauges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- TRIGGER: Auto-snap access points
-- ============================================
CREATE OR REPLACE FUNCTION auto_snap_access_point()
RETURNS TRIGGER AS $$
DECLARE
    snap_result RECORD;
BEGIN
    -- Snap to river
    SELECT * INTO snap_result 
    FROM snap_to_river(NEW.location_orig, NEW.river_id);
    
    NEW.location_snap := snap_result.snapped_point;
    NEW.river_mile_downstream := snap_result.river_mile;
    
    -- Calculate upstream mile (requires river length)
    SELECT length_miles - snap_result.river_mile 
    INTO NEW.river_mile_upstream
    FROM rivers WHERE id = NEW.river_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER access_points_auto_snap
    BEFORE INSERT OR UPDATE OF location_orig, river_id ON access_points
    FOR EACH ROW EXECUTE FUNCTION auto_snap_access_point();
```

### 4.4 Row Level Security

```sql
-- File: supabase/migrations/00004_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE rivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gauge_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE river_gauges ENABLE ROW LEVEL SECURITY;
ALTER TABLE gauge_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE river_hazards ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_time_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE float_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC READ POLICIES
-- ============================================

-- Rivers: Anyone can read
CREATE POLICY "Rivers are viewable by everyone"
    ON rivers FOR SELECT
    USING (true);

-- Gauge stations: Anyone can read
CREATE POLICY "Gauge stations are viewable by everyone"
    ON gauge_stations FOR SELECT
    USING (true);

-- River gauges: Anyone can read
CREATE POLICY "River gauges are viewable by everyone"
    ON river_gauges FOR SELECT
    USING (true);

-- Gauge readings: Anyone can read
CREATE POLICY "Gauge readings are viewable by everyone"
    ON gauge_readings FOR SELECT
    USING (true);

-- Access points: Anyone can read approved points
CREATE POLICY "Approved access points are viewable by everyone"
    ON access_points FOR SELECT
    USING (approved = true);

-- River hazards: Anyone can read active hazards
CREATE POLICY "Active hazards are viewable by everyone"
    ON river_hazards FOR SELECT
    USING (active = true);

-- Vessel types: Anyone can read
CREATE POLICY "Vessel types are viewable by everyone"
    ON vessel_types FOR SELECT
    USING (true);

-- Float plans: Anyone can read (they're shareable)
CREATE POLICY "Float plans are viewable by everyone"
    ON float_plans FOR SELECT
    USING (true);

-- Drive time cache: Anyone can read
CREATE POLICY "Drive time cache is viewable by everyone"
    ON drive_time_cache FOR SELECT
    USING (true);

-- ============================================
-- PUBLIC WRITE POLICIES
-- ============================================

-- Float plans: Anyone can create
CREATE POLICY "Anyone can create float plans"
    ON float_plans FOR INSERT
    WITH CHECK (true);

-- Float plans: Anyone can update view count
CREATE POLICY "Anyone can update float plan view count"
    ON float_plans FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- ============================================
-- ADMIN HELPER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ADMIN POLICIES
-- ============================================

-- Rivers: Admin can do everything
CREATE POLICY "Admins can manage rivers"
    ON rivers FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Gauge stations: Admin can manage
CREATE POLICY "Admins can manage gauge stations"
    ON gauge_stations FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- River gauges: Admin can manage
CREATE POLICY "Admins can manage river gauges"
    ON river_gauges FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Gauge readings: Admin can insert/update (for cron job)
CREATE POLICY "Admins can manage gauge readings"
    ON gauge_readings FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Access points: Admin can see all, manage all
CREATE POLICY "Admins can view all access points"
    ON access_points FOR SELECT
    USING (is_admin());

CREATE POLICY "Admins can manage access points"
    ON access_points FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- River hazards: Admin can manage
CREATE POLICY "Admins can manage hazards"
    ON river_hazards FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Vessel types: Admin can manage
CREATE POLICY "Admins can manage vessel types"
    ON vessel_types FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- Drive time cache: Admin can manage
CREATE POLICY "Admins can manage drive time cache"
    ON drive_time_cache FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- User roles: Admin can view
CREATE POLICY "Admins can view user roles"
    ON user_roles FOR SELECT
    USING (is_admin() OR user_id = auth.uid());

-- ============================================
-- SERVICE ROLE BYPASS
-- Note: Service role bypasses RLS by default
-- This is used for cron jobs and background tasks
-- ============================================
```

### 4.5 Seed Data

```sql
-- File: supabase/migrations/00005_seed_vessel_types.sql

INSERT INTO vessel_types (name, slug, speed_low_water, speed_normal, speed_high_water, description, icon, sort_order) VALUES
    ('Raft', 'raft', 1.5, 2.0, 2.5, 'Multi-person inflatable raft. Slower but stable.', 'raft', 1),
    ('Canoe', 'canoe', 2.0, 2.5, 3.5, 'Traditional canoe. Good balance of speed and capacity.', 'canoe', 2),
    ('Kayak', 'kayak', 2.5, 3.0, 4.0, 'Single or tandem kayak. Fastest option.', 'kayak', 3),
    ('Tube', 'tube', 1.0, 1.5, 2.0, 'Inner tube. Leisurely pace, best for short floats.', 'tube', 4);
```

---

## 5. API Specifications

### 5.1 Public Endpoints

#### GET /api/rivers

List all rivers.

**Response:**
```typescript
{
  rivers: Array<{
    id: string;
    name: string;
    slug: string;
    lengthMiles: number;
    description: string | null;
    difficultyRating: string | null;
    region: string | null;
    accessPointCount: number;
    currentCondition: {
      label: string;
      code: string;
    } | null;
  }>;
}
```

#### GET /api/rivers/[slug]

Get river details with geometry.

**Response:**
```typescript
{
  river: {
    id: string;
    name: string;
    slug: string;
    lengthMiles: number;
    description: string | null;
    difficultyRating: string | null;
    region: string | null;
    geometry: GeoJSON.LineString;
    bounds: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  };
}
```

#### GET /api/rivers/[slug]/access-points

Get access points for a river.

**Response:**
```typescript
{
  accessPoints: Array<{
    id: string;
    name: string;
    slug: string;
    riverMile: number;
    type: string;
    isPublic: boolean;
    ownership: string | null;
    description: string | null;
    amenities: string[];
    parkingInfo: string | null;
    feeRequired: boolean;
    feeNotes: string | null;
    coordinates: {
      lng: number;
      lat: number;
    };
  }>;
}
```

#### GET /api/rivers/[slug]/hazards

Get hazards for a river.

**Response:**
```typescript
{
  hazards: Array<{
    id: string;
    name: string;
    type: string;
    riverMile: number;
    description: string | null;
    severity: string;
    portageRequired: boolean;
    portageSide: string | null;
    seasonalNotes: string | null;
    coordinates: {
      lng: number;
      lat: number;
    };
  }>;
}
```

#### GET /api/conditions/[riverId]

Get current river conditions.

**Response:**
```typescript
{
  condition: {
    label: string;
    code: 'dangerous' | 'high' | 'optimal' | 'low' | 'very_low' | 'too_low' | 'unknown';
    gaugeHeightFt: number | null;
    dischargeCfs: number | null;
    readingTimestamp: string | null;
    readingAgeHours: number | null;
    accuracyWarning: boolean;
    accuracyWarningReason: string | null;
    gaugeName: string | null;
    gaugeUsgsId: string | null;
  } | null;
  available: boolean;
}
```

#### GET /api/plan

Calculate a float plan.

**Query Parameters:**
- `riverId` (required): UUID
- `startId` (required): UUID - Put-in access point
- `endId` (required): UUID - Take-out access point
- `vesselTypeId` (optional): UUID - Defaults to canoe

**Response:**
```typescript
{
  plan: {
    river: {
      id: string;
      name: string;
      slug: string;
    };
    putIn: {
      id: string;
      name: string;
      riverMile: number;
      coordinates: { lng: number; lat: number };
    };
    takeOut: {
      id: string;
      name: string;
      riverMile: number;
      coordinates: { lng: number; lat: number };
    };
    vessel: {
      id: string;
      name: string;
      slug: string;
    };
    distance: {
      miles: number;
      formatted: string; // "8.3 miles"
    };
    floatTime: {
      minutes: number;
      formatted: string; // "~3 hours 20 minutes"
      speedMph: number;
    } | null; // null if conditions are dangerous
    driveBack: {
      minutes: number;
      miles: number;
      formatted: string; // "28 minutes"
      routeSummary: string | null;
    };
    condition: {
      label: string;
      code: string;
      gaugeHeightFt: number | null;
      accuracyWarning: boolean;
      accuracyWarningReason: string | null;
    };
    hazards: Array<{
      name: string;
      type: string;
      riverMile: number;
      severity: string;
      description: string | null;
    }>;
    route: GeoJSON.Feature<GeoJSON.LineString>; // For map display
    warnings: string[]; // Any warnings to display
  };
}
```

#### POST /api/plan/save

Save a plan and get shareable URL.

**Request Body:**
```typescript
{
  riverId: string;
  startId: string;
  endId: string;
  vesselTypeId: string;
}
```

**Response:**
```typescript
{
  shortCode: string;
  url: string; // Full shareable URL
}
```

#### GET /api/plan/[shortCode]

Get a saved plan by short code.

**Response:** Same as GET /api/plan

#### GET /api/vessel-types

Get available vessel types.

**Response:**
```typescript
{
  vesselTypes: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    speeds: {
      lowWater: number;
      normal: number;
      highWater: number;
    };
  }>;
}
```

### 5.2 Admin Endpoints

All admin endpoints require authentication and admin role.

#### GET /api/admin/access-points

List all access points (including unapproved).

#### POST /api/admin/access-points

Create a new access point.

**Request Body:**
```typescript
{
  riverId: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  isPublic: boolean;
  ownership?: string;
  description?: string;
  amenities?: string[];
  parkingInfo?: string;
  feeRequired?: boolean;
  feeNotes?: string;
  approved?: boolean;
}
```

#### PUT /api/admin/access-points/[id]

Update an access point.

#### DELETE /api/admin/access-points/[id]

Delete an access point.

#### POST /api/admin/access-points/[id]/approve

Approve an access point.

#### POST /api/admin/update-gauges

Manually trigger gauge update.

### 5.3 Cron Endpoint

#### POST /api/cron/update-gauges

Called by Vercel Cron every hour to update gauge readings.

**Headers:**
- `Authorization: Bearer ${CRON_SECRET}`

---

## 6. Frontend Components

### 6.1 Pages

#### Home Page (`/`)

Main planning interface with:
- Full-screen map
- River selector dropdown (top left)
- Vessel type selector
- Plan summary panel (slides in when plan is calculated)

#### Shared Plan Page (`/plan/[shortCode]`)

Pre-loaded plan view:
- Map centered on route
- Plan summary displayed
- "Plan Your Own" CTA

#### Admin Dashboard (`/admin`)

- Login required
- Overview stats
- Quick links to management pages

#### Admin Access Points (`/admin/access-points`)

- Table of all access points
- Filter by river, approval status
- Add/Edit/Delete/Approve actions

### 6.2 Component Specifications

#### MapContainer

```typescript
interface MapContainerProps {
  initialBounds?: [number, number, number, number];
  onAccessPointClick?: (point: AccessPoint) => void;
}
```

Features:
- MapLibre GL JS map
- Custom markers for access points
- River line layers
- Route highlight layer
- Popups on marker click

#### PlanSummary

```typescript
interface PlanSummaryProps {
  plan: FloatPlan | null;
  isLoading: boolean;
  onClose: () => void;
  onShare: () => void;
}
```

Displays:
- River name
- Put-in / Take-out names
- Distance
- Float time estimate
- Drive-back time
- Current condition badge
- Hazard warnings
- Share button

#### ConditionBadge

```typescript
interface ConditionBadgeProps {
  code: ConditionCode;
  label: string;
  showWarning?: boolean;
  warningReason?: string;
}
```

Color coding:
- `dangerous`: Red
- `high`: Orange
- `optimal`: Green
- `low`: Yellow
- `very_low`: Orange
- `too_low`: Red
- `unknown`: Gray

#### VesselSelector

```typescript
interface VesselSelectorProps {
  value: string;
  onChange: (vesselTypeId: string) => void;
}
```

Displays vessel icons with names, highlights selected.

### 6.3 Map Styling

**Access Point Markers:**
- Public: Green circle with boat icon
- Private: Red circle with lock icon
- Selected Put-in: Blue flag
- Selected Take-out: Checkered flag

**River Lines:**
- Unselected rivers: Light blue, 2px
- Selected river: Dark blue, 4px
- Float route segment: Highlighted blue, 6px, animated dash

**Hazard Markers:**
- Warning triangle icon
- Color matches severity

---

## 7. External Integrations

### 7.1 USGS Water Services API

**Base URL:** `https://waterservices.usgs.gov/nwis/iv/`

**Endpoint for real-time data:**
```
GET https://waterservices.usgs.gov/nwis/iv/
  ?format=json
  &sites={siteIds}
  &parameterCd=00065,00060
  &siteStatus=active
```

Parameters:
- `00065`: Gauge height (ft)
- `00060`: Discharge (cfs)

**Example Response Parsing:**
```typescript
interface USGSResponse {
  value: {
    timeSeries: Array<{
      sourceInfo: {
        siteCode: [{ value: string }];
        siteName: string;
      };
      variable: {
        variableCode: [{ value: string }];
      };
      values: Array<{
        value: Array<{
          value: string;
          dateTime: string;
        }>;
      }>;
    }>;
  };
}
```

**Update Frequency:** Every hour via Vercel Cron

### 7.2 Mapbox Directions API

**Base URL:** `https://api.mapbox.com/directions/v5/mapbox/driving/`

**Endpoint:**
```
GET https://api.mapbox.com/directions/v5/mapbox/driving/{coordinates}
  ?access_token={token}
  &geometries=geojson
  &overview=false
```

**Coordinates format:** `{lng1},{lat1};{lng2},{lat2}`

**Response Fields Used:**
- `routes[0].duration`: Travel time in seconds
- `routes[0].distance`: Distance in meters

**Caching:** Results cached for 30 days in `drive_time_cache` table.

### 7.3 Map Tiles

**Provider:** MapTiler (or OpenStreetMap via MapLibre)

**Style URL:** Configure in environment variable

---

## 8. Data Requirements

### 8.1 Rivers Data (TO BE FILLED)

Source: National Hydrography Dataset (NHD)

| River | Slug | NHD ID | Length (mi) | Region |
|-------|------|--------|-------------|--------|
| Meramec | meramec | _TBD_ | _TBD_ | Ozarks |
| Current | current | _TBD_ | _TBD_ | Ozarks |
| Eleven Point | eleven-point | _TBD_ | _TBD_ | Ozarks |
| Jacks Fork | jacks-fork | _TBD_ | _TBD_ | Ozarks |
| Niangua | niangua | _TBD_ | _TBD_ | Ozarks |
| Big Piney | big-piney | _TBD_ | _TBD_ | Ozarks |
| Huzzah | huzzah | _TBD_ | _TBD_ | Ozarks |
| Courtois | courtois | _TBD_ | _TBD_ | Ozarks |

### 8.2 Gauge Stations (TO BE FILLED)

Source: USGS Water Resources

| River | USGS Site ID | Site Name | Distance | Thresholds (ft) |
|-------|--------------|-----------|----------|-----------------|
| Meramec | _TBD_ | _TBD_ | _TBD_ mi | too_low: _ / low: _ / opt_min: _ / opt_max: _ / high: _ / danger: _ |
| Current | _TBD_ | _TBD_ | _TBD_ mi | ... |
| Eleven Point | _TBD_ | _TBD_ | _TBD_ mi | ... |
| Jacks Fork | _TBD_ | _TBD_ | _TBD_ mi | ... |
| Niangua | _TBD_ | _TBD_ | _TBD_ mi | ... |
| Big Piney | _TBD_ | _TBD_ | _TBD_ mi | ... |
| Huzzah | _TBD_ | _TBD_ | _TBD_ mi | ... |
| Courtois | _TBD_ | _TBD_ | _TBD_ mi | ... |

### 8.3 Access Points (TO BE FILLED)

Source: MDC, NPS, local knowledge

**Template per river:**

```
River: [River Name]

1. [Access Point Name]
   - Coordinates: [lat], [lng]
   - Type: [boat_ramp | gravel_bar | campground | bridge | access | park]
   - Public: [yes | no]
   - Ownership: [MDC | NPS | private | county | city | state_park]
   - Amenities: [parking, restrooms, camping, boat_ramp, picnic]
   - Fee: [yes | no] - Notes: [if yes]
   - Description: [optional notes]

2. ...
```

### 8.4 Hazards (TO BE FILLED)

**Template:**

```
River: [River Name]

1. [Hazard Name]
   - Type: [low_water_dam | portage | strainer | rapid | private_property | other]
   - River Mile: [approximate]
   - Severity: [info | caution | warning | danger]
   - Portage Required: [yes | no]
   - Portage Side: [left | right | either]
   - Description: [details]
   - Seasonal Notes: [if applicable]
```

---

## 9. Implementation Phases

### Phase 1: Foundation (Week 1)

**Goals:** Project setup, database, basic API

**Tasks:**
1. Initialize Next.js project with TypeScript and Tailwind
2. Set up Supabase project
3. Enable PostGIS extension
4. Run all database migrations
5. Configure Supabase client in Next.js
6. Set up environment variables
7. Create basic API routes structure
8. Implement `/api/rivers` endpoint
9. Implement `/api/vessel-types` endpoint

**Deliverable:** Database schema live, basic API returning test data

### Phase 2: Data Pipeline (Week 2)

**Goals:** River geometry import, access point seeding

**Tasks:**
1. Download NHD data for Missouri
2. Create import script for rivers
3. Import all 8 rivers with verified geometry
4. Calculate and store river lengths
5. Research and document gauge stations
6. Create gauge stations seed data
7. Research and compile access points
8. Create access points seed data
9. Run full data import

**Deliverable:** All rivers and access points in database

### Phase 3: Core API (Week 3)

**Goals:** Float plan calculation, conditions

**Tasks:**
1. Implement USGS API integration
2. Create gauge update cron job
3. Implement `/api/conditions/[riverId]`
4. Implement Mapbox directions integration
5. Implement drive time caching
6. Implement `/api/plan` endpoint
7. Implement `/api/plan/save` endpoint
8. Add hazards to plan response
9. Test all calculation logic

**Deliverable:** Full float plan API working

### Phase 4: Frontend Map (Week 4)

**Goals:** Interactive map interface

**Tasks:**
1. Set up MapLibre GL JS
2. Create MapContainer component
3. Implement river line layers
4. Implement access point markers
5. Create AccessPointPopup component
6. Implement point selection logic
7. Create route highlight layer
8. Add RiverSelector dropdown
9. Add VesselSelector component
10. Mobile responsive layout

**Deliverable:** Map UI with point selection

### Phase 5: Plan Display (Week 5)

**Goals:** Plan summary, sharing

**Tasks:**
1. Create PlanSummary component
2. Create ConditionBadge component
3. Integrate plan API with frontend
4. Display hazard warnings
5. Implement shareable URLs
6. Create `/plan/[shortCode]` page
7. Add share button and copy functionality
8. Loading states and error handling
9. Polish animations and transitions

**Deliverable:** Complete user flow working

### Phase 6: Admin & Polish (Week 6)

**Goals:** Admin panel, final polish

**Tasks:**
1. Set up Supabase Auth
2. Create admin login page
3. Create admin layout with auth guard
4. Create AccessPointList component
5. Create AccessPointForm component
6. Implement CRUD operations
7. Implement approval workflow
8. Create GaugeStatus component
9. Final testing and bug fixes
10. Performance optimization
11. Deploy to production

**Deliverable:** Production-ready MVP

---

## 10. Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Mapbox
MAPBOX_ACCESS_TOKEN=pk.eyJ...

# Map Tiles (MapTiler or similar)
NEXT_PUBLIC_MAP_STYLE_URL=https://api.maptiler.com/maps/streets/style.json?key=...

# Cron Security
CRON_SECRET=your-random-secret-string

# App
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## 11. Deployment

### 11.1 Vercel Configuration

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/update-gauges",
      "schedule": "0 * * * *"
    }
  ]
}
```

### 11.2 Supabase Configuration

1. Enable PostGIS extension
2. Enable pg_cron extension (if using DB-level cron)
3. Set up auth providers (email for admin)
4. Configure RLS policies
5. Set up database backups

### 11.3 Domain & DNS

1. Add custom domain in Vercel
2. Configure DNS records
3. Enable HTTPS (automatic with Vercel)

### 11.4 Monitoring

1. Vercel Analytics (built-in)
2. Supabase Dashboard for DB metrics
3. Set up error alerting (optional: Sentry)

---

## Appendix A: Type Definitions

```typescript
// src/types/database.ts
// Generate with: npx supabase gen types typescript --project-id [id] > src/types/database.ts

// src/types/api.ts
export interface River {
  id: string;
  name: string;
  slug: string;
  lengthMiles: number;
  description: string | null;
  difficultyRating: string | null;
  region: string | null;
}

export interface AccessPoint {
  id: string;
  riverId: string;
  name: string;
  slug: string;
  riverMile: number;
  type: AccessPointType;
  isPublic: boolean;
  ownership: string | null;
  description: string | null;
  amenities: string[];
  parkingInfo: string | null;
  feeRequired: boolean;
  feeNotes: string | null;
  coordinates: {
    lng: number;
    lat: number;
  };
}

export type AccessPointType = 
  | 'boat_ramp' 
  | 'gravel_bar' 
  | 'campground' 
  | 'bridge' 
  | 'access' 
  | 'park';

export interface VesselType {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  speeds: {
    lowWater: number;
    normal: number;
    highWater: number;
  };
}

export type ConditionCode = 
  | 'dangerous' 
  | 'high' 
  | 'optimal' 
  | 'low' 
  | 'very_low' 
  | 'too_low' 
  | 'unknown';

export interface RiverCondition {
  label: string;
  code: ConditionCode;
  gaugeHeightFt: number | null;
  dischargeCfs: number | null;
  readingTimestamp: string | null;
  readingAgeHours: number | null;
  accuracyWarning: boolean;
  accuracyWarningReason: string | null;
  gaugeName: string | null;
  gaugeUsgsId: string | null;
}

export interface Hazard {
  id: string;
  riverId: string;
  name: string;
  type: HazardType;
  riverMile: number;
  description: string | null;
  severity: HazardSeverity;
  portageRequired: boolean;
  portageSide: 'left' | 'right' | 'either' | null;
  seasonalNotes: string | null;
  coordinates: {
    lng: number;
    lat: number;
  };
}

export type HazardType = 
  | 'low_water_dam'
  | 'portage'
  | 'strainer'
  | 'rapid'
  | 'private_property'
  | 'waterfall'
  | 'shoal'
  | 'bridge_piling'
  | 'other';

export type HazardSeverity = 'info' | 'caution' | 'warning' | 'danger';

export interface FloatPlan {
  river: River;
  putIn: AccessPoint;
  takeOut: AccessPoint;
  vessel: VesselType;
  distance: {
    miles: number;
    formatted: string;
  };
  floatTime: {
    minutes: number;
    formatted: string;
    speedMph: number;
  } | null;
  driveBack: {
    minutes: number;
    miles: number;
    formatted: string;
    routeSummary: string | null;
  };
  condition: RiverCondition;
  hazards: Hazard[];
  route: GeoJSON.Feature<GeoJSON.LineString>;
  warnings: string[];
}
```

---

## Appendix B: Useful PostGIS Queries

```sql
-- Find nearest river to a point
SELECT id, name, ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(-91.5, 37.8), 4326)::geography) as distance_meters
FROM rivers
ORDER BY geom <-> ST_SetSRID(ST_MakePoint(-91.5, 37.8), 4326)
LIMIT 1;

-- Get river as GeoJSON
SELECT ST_AsGeoJSON(geom) as geojson FROM rivers WHERE slug = 'meramec';

-- Get all access points for a river as GeoJSON FeatureCollection
SELECT json_build_object(
  'type', 'FeatureCollection',
  'features', json_agg(
    json_build_object(
      'type', 'Feature',
      'geometry', ST_AsGeoJSON(location_snap)::json,
      'properties', json_build_object(
        'id', id,
        'name', name,
        'type', type,
        'riverMile', river_mile_downstream
      )
    )
  )
) as geojson
FROM access_points
WHERE river_id = '[river-uuid]' AND approved = true;

-- Calculate river length in miles
UPDATE rivers 
SET length_miles = ST_Length(geom::geography) / 1609.34
WHERE length_miles IS NULL;

-- Find access points between two river miles
SELECT * FROM access_points
WHERE river_id = '[river-uuid]'
  AND river_mile_downstream BETWEEN 20 AND 35
  AND approved = true
ORDER BY river_mile_downstream DESC;
```

---

## Appendix C: USGS Gauge Station Research Links

Use these to find gauge stations for each river:

- USGS Water Resources Map: https://maps.waterdata.usgs.gov/mapper/
- Missouri Water Science Center: https://www.usgs.gov/centers/missouri-water-science-center
- Real-time data search: https://waterdata.usgs.gov/mo/nwis/rt

**Search tips:**
1. Search by river name in the mapper
2. Look for stations with parameter codes 00065 (gauge height) and 00060 (discharge)
3. Verify station is currently active
4. Note the site ID (8-digit number)

---

*End of Master Plan Document*
