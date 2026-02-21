-- Migration: Convert recruiter_id to support Supabase UUIDs
-- Run this SQL directly in your PostgreSQL database

BEGIN;

-- 1. Drop the foreign key constraint
ALTER TABLE sessions 
  DROP CONSTRAINT IF EXISTS sessions_recruiter_id_fkey;

-- 2. Delete all existing sessions (if any exist - they reference old user IDs)
TRUNCATE TABLE sessions CASCADE;

-- 3. Change recruiter_id type from INTEGER to VARCHAR(255)
ALTER TABLE sessions 
  ALTER COLUMN recruiter_id TYPE VARCHAR(255);

-- 4. Add index for recruiter_id (was part of foreign key before)
CREATE INDEX IF NOT EXISTS idx_session_recruiter_id ON sessions(recruiter_id);

COMMIT;

-- Verification query
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sessions' AND column_name = 'recruiter_id';
