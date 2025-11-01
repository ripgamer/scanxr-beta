-- EASIEST FIX: Update bucket to be completely open
-- Run this in Supabase SQL Editor (this should work)

UPDATE storage.buckets 
SET public = true, 
    file_size_limit = 104857600,
    allowed_mime_types = NULL  -- Remove MIME restrictions
WHERE id = 'scanxr-files';

-- This makes the bucket completely open for uploads/downloads