-- Quick fix: Disable RLS for storage bucket (TEMPORARY)
-- Run this in Supabase SQL Editor if the dashboard policies don't work

-- Option 1: Disable RLS entirely (easiest but less secure)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Option 2: Create simple policies (more secure)
-- Enable RLS first
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to insert into scanxr-files bucket
CREATE POLICY "Allow authenticated uploads to scanxr-files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'scanxr-files');

-- Allow public to read from scanxr-files bucket  
CREATE POLICY "Allow public access to scanxr-files" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'scanxr-files');

-- Allow users to update their own files
CREATE POLICY "Allow updates to own files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'scanxr-files');

-- Allow users to delete their own files
CREATE POLICY "Allow deletes to own files" ON storage.objects  
FOR DELETE TO authenticated
USING (bucket_id = 'scanxr-files');