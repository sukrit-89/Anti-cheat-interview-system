-- Migration: Fix candidates.user_id column type
-- Reason: Supabase Auth returns UUIDs (varchar) but column was created as INTEGER
-- This drops the FK to the local users table and changes to VARCHAR to accept Supabase UUIDs

ALTER TABLE candidates DROP CONSTRAINT IF EXISTS candidates_user_id_fkey;
ALTER TABLE candidates ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR;
