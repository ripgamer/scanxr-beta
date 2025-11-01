-- Simplified Supabase Storage Setup for ScanXR (using Clerk Auth)
-- Run this in your Supabase SQL Editor

-- Create the storage bucket for ScanXR files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scanxr-files', 
  'scanxr-files', 
  true,
  104857600, -- 100MB limit
  ARRAY[
    -- 3D Model MIME types
    'model/gltf-binary',
    'model/gltf+json',
    'model/obj',
    'application/octet-stream',
    'text/plain',
    'application/x-blender',
    'model/x3d+xml',
    'model/stl',
    'application/x-3ds',
    'model/ply',
    'application/x-fbx',
    'model/vnd.collada+xml',
    'model/mesh',
    'model/vrml',
    
    -- Image MIME types
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    'image/avif',
    'image/x-bmp',
    'image/x-ms-bmp',
    'image/heic',
    'image/heif',
    'image/jxl'
  ]
);

-- Since we're using Clerk (not Supabase Auth), we'll use simpler policies
-- Allow public read access (we'll control access in our application layer)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'scanxr-files');

-- Allow public insert (we'll validate in application layer)
CREATE POLICY "Public insert access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'scanxr-files');

-- Allow public delete (we'll validate in application layer)
CREATE POLICY "Public delete access"
ON storage.objects FOR DELETE
USING (bucket_id = 'scanxr-files');