# Supabase Storage Setup Guide

## Quick Setup

1. **Go to your Supabase Dashboard** → Storage → Create Bucket
2. **Copy and paste** the SQL from `supabase-storage-comprehensive.sql` into your SQL Editor
3. **Run the script** to create the bucket with all MIME types and security policies

## Supported File Types

### 3D Models (up to 100MB)
- **GLB/GLTF**: `model/gltf-binary`, `model/gltf+json`
- **OBJ**: `model/obj`, `text/plain`
- **FBX**: `application/x-fbx`, `application/octet-stream`
- **DAE/COLLADA**: `model/vnd.collada+xml`
- **STL**: `model/stl`
- **PLY**: `model/ply`
- **3DS**: `application/x-3ds`
- **BLEND**: `application/x-blender`
- **X3D**: `model/x3d+xml`

### Images (up to 10MB)
- **JPEG/JPG**: `image/jpeg`
- **PNG**: `image/png`
- **WebP**: `image/webp`
- **GIF**: `image/gif`
- **BMP**: `image/bmp`, `image/x-bmp`
- **TIFF**: `image/tiff`
- **SVG**: `image/svg+xml`
- **AVIF**: `image/avif`

## File Structure
```
scanxr-files/
├── models/
│   └── {user_id}/
│       ├── model1.glb
│       ├── model2.obj
│       └── model3.fbx
└── thumbnails/
    └── {user_id}/
        ├── thumb1.jpg
        ├── thumb2.png
        └── thumb3.webp
```

## Security
- ✅ Users can only upload to their own folders
- ✅ All files are publicly readable (for sharing)
- ✅ Users can update/delete only their own files
- ✅ File size limits enforced at bucket level

## Testing
After setup, test with:
1. Upload a GLB file
2. Upload an OBJ file  
3. Upload a JPG thumbnail
4. Verify files appear in Storage → scanxr-files

## Need Help?
Check the `MIME_TYPES.md` file for complete MIME type reference and validation patterns.