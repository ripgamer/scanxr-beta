-- QUICK FIX: Disable RLS for storage objects
-- Run this single line in Supabase SQL Editor

ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- That's it! Your uploads should work immediately after this.