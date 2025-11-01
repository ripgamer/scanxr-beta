-- Debug and fix Supabase storage policies
-- Run these queries one by one in Supabase SQL Editor

-- 1. Check existing policies (run this first to see what's already there)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects';

-- 2. If you see existing policies, drop them all (clean slate)
DROP POLICY IF EXISTS "Users can upload their own 3D models" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own thumbnails" ON storage.objects;  
DROP POLICY IF EXISTS "Public can view 3D models" ON storage.objects;
DROP POLICY IF EXISTS "Public can view thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to scanxr-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow reads from scanxr-files" ON storage.objects;

-- 3. Create simple working policies
CREATE POLICY "Allow all uploads to scanxr-files" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'scanxr-files');

CREATE POLICY "Allow all reads from scanxr-files" ON storage.objects
FOR SELECT 
USING (bucket_id = 'scanxr-files');

-- 4. Verify the policies were created
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND qual LIKE '%scanxr-files%';