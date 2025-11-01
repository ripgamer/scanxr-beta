-- EASIEST FIX: Create simple open policies for your storage bucket
-- Run this in Supabase SQL Editor

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE to upload to scanxr-files (simplest approach)
CREATE POLICY "Allow uploads to scanxr-files" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'scanxr-files');

-- Allow ANYONE to read from scanxr-files
CREATE POLICY "Allow reads from scanxr-files" ON storage.objects
FOR SELECT 
USING (bucket_id = 'scanxr-files');

-- Allow ANYONE to update files in scanxr-files
CREATE POLICY "Allow updates in scanxr-files" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'scanxr-files');

-- Allow ANYONE to delete from scanxr-files  
CREATE POLICY "Allow deletes in scanxr-files" ON storage.objects
FOR DELETE 
USING (bucket_id = 'scanxr-files');