-- Comprehensive Supabase Storage Setup for ScanXR
-- Run this in your Supabase SQL Editor after creating your project

-- Create the storage bucket for ScanXR files with full MIME type support
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scanxr-files', 
  'scanxr-files', 
  true,
  104857600, -- 100MB limit for 3D models
  ARRAY[
    -- 3D Model formats
    'model/gltf-binary',      -- GLB files
    'model/gltf+json',        -- GLTF files  
    'model/obj',              -- OBJ files
    'application/octet-stream', -- Generic binary (GLB, FBX, 3DS, BLEND)
    'text/plain',             -- Text-based formats (OBJ, X3D, PLY)
    'application/x-blender',   -- BLEND files
    'model/x3d+xml',          -- X3D files
    'model/stl',              -- STL files
    'application/x-3ds',       -- 3DS files
    'model/ply',              -- PLY files
    'application/x-fbx',       -- FBX files
    'model/vnd.collada+xml',   -- DAE/COLLADA files
    'model/mesh',             -- Generic mesh formats
    'model/vrml',             -- VRML/WRL files
    
    -- Image formats for thumbnails
    'image/jpeg',             -- JPEG/JPG
    'image/png',              -- PNG
    'image/webp',             -- WebP
    'image/gif',              -- GIF
    'image/bmp',              -- BMP
    'image/tiff',             -- TIFF
    'image/svg+xml',          -- SVG
    'image/avif',             -- AVIF
    'image/x-bmp',            -- Alternative BMP MIME
    'image/x-ms-bmp',         -- Microsoft BMP
    'image/heic',             -- HEIC (iOS)
    'image/heif',             -- HEIF
    'image/jxl'               -- JPEG XL
  ]
);

-- Enable RLS (Row Level Security) on the storage bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to upload 3D models
CREATE POLICY "Users can upload their own 3D models"
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

-- Create policy for public read access to 3D models
CREATE POLICY "Public can view 3D models"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'scanxr-files' 
  AND (storage.foldername(name))[1] = 'models'
);

-- Create policy for public read access to thumbnails
CREATE POLICY "Public can view thumbnails"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'scanxr-files' 
  AND (storage.foldername(name))[1] = 'thumbnails'
);

-- Create policy for users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'scanxr-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Create policy for users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'scanxr-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Verify the bucket was created successfully
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'scanxr-files';

-- Show sample folder structure that will be created:
-- /models/{user_id}/{filename}.glb
-- /thumbnails/{user_id}/{filename}.jpg