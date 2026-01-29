-- Migration: Add image_url column to access_points table
-- This allows attaching photos to access points for display in the River Guide

-- Add image_url column
ALTER TABLE access_points
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN access_points.image_url IS 'URL to an image of this access point (stored in Supabase Storage or external URL)';
