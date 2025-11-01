# Large File Upload Fix

## Problem
Upload was failing with big 3D model files (especially files larger than 4-5MB) due to:

1. **Next.js default body size limit** (~4-5MB for API routes)
2. **Server-side upload bottleneck** - Files were being uploaded through the API route
3. **No real progress tracking** - Only simulated progress
4. **Timeout issues** with large files taking too long to upload through server

## Solution Implemented

### 1. Direct Client-to-Supabase Upload
- **Before**: Client → API Route → Supabase (slow, double upload)
- **After**: Client → Supabase directly (fast, single upload)

### 2. Real Progress Tracking
- Added `uploadFileWithProgress()` function in `lib/supabase-client.js`
- Provides real-time upload progress (0-100%)
- Multi-step progress: Model upload (5-70%), Thumbnail (70-85%), Database (85-100%)

### 3. Configuration Changes

#### next.config.mjs
```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '100mb', // Increased from default ~4MB
  },
}
```

#### lib/supabase-client.js (NEW FILE)
- Client-side Supabase operations
- `uploadFileWithProgress()` - Direct upload with progress callback
- `validate3DModel()` - Client-side validation
- `validateThumbnail()` - Client-side validation

#### app/create/page.jsx
- Updated to use direct Supabase upload
- Real progress tracking for both model and thumbnail
- Better error handling with specific messages

#### app/api/posts/route.js
- Now accepts both JSON (new flow) and FormData (legacy)
- New flow: Receives pre-uploaded URLs from client
- Legacy flow: Still supports direct file upload for backwards compatibility

## How It Works Now

1. **User selects file** → Validated client-side
2. **Upload starts** → Direct to Supabase Storage with progress tracking
   - Model upload: 0-70% progress
   - Thumbnail upload: 70-85% progress
3. **Database record created** → 85-95% progress
4. **Redirect to profile** → 100% complete

## File Size Limits

- **3D Models**: Up to 100MB
  - Supported: GLB, GLTF, OBJ, FBX, DAE, 3DS, BLEND, X3D, PLY, STL
- **Thumbnails**: Up to 10MB
  - Supported: JPG, JPEG, PNG, WEBP, GIF, BMP, TIFF, SVG, AVIF

## Testing Large Files

1. Go to `/create`
2. Upload a large 3D model (50-100MB)
3. Watch the progress bar - should show real upload progress
4. Upload should complete successfully without timeouts
5. Check Supabase Storage bucket for uploaded files

## Benefits

✅ **Faster uploads** - Direct to storage, no server bottleneck
✅ **Real progress** - See actual upload status
✅ **Better UX** - More reliable with large files
✅ **Scalable** - Server doesn't handle file data
✅ **Cost efficient** - Less server bandwidth usage

## Important Notes

- Supabase Storage RLS policies must allow uploads
- Currently using open policies for development
- **TODO**: Tighten RLS policies for production (user-specific access)

## Supabase Storage Policies

Current setup (development):
```sql
-- Allow all uploads (DEVELOPMENT ONLY)
CREATE POLICY "Allow all uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'scanxr-files');

-- Allow all reads
CREATE POLICY "Allow all reads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'scanxr-files');
```

Production recommendations:
```sql
-- Only allow authenticated users to upload
CREATE POLICY "Authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'scanxr-files' AND
  (storage.foldername(name))[1] = 'models' OR
  (storage.foldername(name))[1] = 'thumbnails'
);

-- Only allow users to upload to their own folder
CREATE POLICY "User folder uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'scanxr-files' AND
  (storage.foldername(name))[2] = auth.uid()::text
);
```

## Troubleshooting

### Upload fails with 403 error
- Check Supabase Storage RLS policies
- Ensure bucket 'scanxr-files' exists
- Verify policies allow uploads

### Progress stuck at certain %
- Check browser console for errors
- Verify Supabase credentials in .env
- Check network tab for failed requests

### "File too large" error
- Model: Max 100MB
- Thumbnail: Max 10MB
- Check file size before upload

### Slow upload speed
- Check internet connection
- Supabase storage region (currently aws-0-ap-south-1)
- Consider using closer Supabase region if needed
