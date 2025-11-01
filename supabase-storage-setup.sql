-- Supabase Storage Setup for ScanXR
-- Run this in your Supabase SQL Editor

-- Create the storage bucket for ScanXR files
INSERT INTO storage.buckets (id, name, public)
VALUES ('scanxr-files', 'scanxr-files', true);

-- Enable RLS on the bucket
UPDATE storage.buckets 
SET public = true 
WHERE id = 'scanxr-files';

-- Create policy for authenticated users to upload files
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'scanxr-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'models' 
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Create policy for authenticated users to upload thumbnails
CREATE POLICY "Users can upload their own thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'scanxr-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'thumbnails' 
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Create policy for public read access to thumbnails
CREATE POLICY "Public can view thumbnails"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'scanxr-files' 
  AND (storage.foldername(name))[1] = 'thumbnails'
);

-- Create policy for authenticated users to view models
CREATE POLICY "Authenticated users can view models"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'scanxr-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'models'
);

-- Create policy for users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'scanxr-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[2] = auth.uid()::text
);