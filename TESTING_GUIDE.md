# Quick Test Guide for Large File Uploads

## Server Info
🚀 Server running at: **http://localhost:3002**

## Test Steps

### 1. Basic Upload Test (Small File)
1. Go to http://localhost:3002/create
2. Upload a small 3D model file (<10MB)
3. Add title: "Test Small File"
4. Click through the 3-step process
5. ✅ Should upload quickly with progress bar

### 2. Medium File Test (10-30MB)
1. Go to http://localhost:3002/create
2. Upload a medium 3D model (10-30MB)
3. Add title: "Test Medium File"
4. **Watch the progress bar** - should show real progress
5. ✅ Should complete in 15-30 seconds

### 3. Large File Test (50-100MB)
1. Go to http://localhost:3002/create
2. Upload a large 3D model (50-100MB)
3. Add title: "Test Large File"
4. **Watch the progress bar closely**:
   - 0-5%: Starting
   - 5-70%: Uploading model (should be smooth, not jumpy)
   - 70-85%: Uploading thumbnail (if added)
   - 85-100%: Creating database record
5. ✅ Should complete in 1-2 minutes without timeout

### 4. Multiple Format Test
Test each format to ensure all work:
- [ ] .glb
- [ ] .gltf
- [ ] .obj
- [ ] .fbx
- [ ] .dae
- [ ] .stl

### 5. With Thumbnail Test
1. Upload a large model + thumbnail
2. Watch progress go through both stages
3. ✅ Should show smooth progress for both files

## What to Look For

### ✅ Good Signs
- Progress bar moves smoothly (not stuck)
- No console errors
- Upload completes successfully
- Redirects to profile after upload
- Files visible in Supabase Storage
- Post appears in profile

### ❌ Bad Signs
- Progress bar stuck at certain %
- 403 Forbidden errors (RLS policy issue)
- Timeout errors
- Upload fails silently
- Files not in Supabase Storage

## Troubleshooting

### If Upload Fails

1. **Check browser console** (F12)
   - Look for red errors
   - Note any 403, 500, or network errors

2. **Check terminal output**
   - Look for backend errors
   - Check database connection

3. **Verify Supabase Storage**
   - Go to Supabase Dashboard
   - Check Storage → scanxr-files bucket
   - Verify policies allow uploads

4. **Check file size**
   - Models: Max 100MB
   - Thumbnails: Max 10MB

### Common Issues

**"403 Forbidden"**
```
→ Storage RLS policies blocking upload
→ Fix: Update policies in Supabase dashboard
```

**"Network timeout"**
```
→ File too large or slow connection
→ Try smaller file first
```

**"Invalid file type"**
```
→ File format not supported
→ Use .glb, .gltf, .obj, .fbx, etc.
```

## Progress Bar Breakdown

| Stage | Progress % | What's Happening |
|-------|------------|------------------|
| Start | 0-5% | Initializing upload |
| Model Upload | 5-70% | Uploading 3D file to Supabase |
| Thumbnail Upload | 70-85% | Uploading preview image |
| Database | 85-95% | Creating post record |
| Complete | 95-100% | Finalizing and redirecting |

## Test Results Template

Copy and fill this out:

```
## Test Results

Date: ___________
Browser: ___________

### Small File (<10MB)
- File Size: _______
- Upload Time: _______
- Status: ✅ Success / ❌ Failed
- Notes: 

### Medium File (10-30MB)
- File Size: _______
- Upload Time: _______
- Status: ✅ Success / ❌ Failed
- Notes:

### Large File (50-100MB)
- File Size: _______
- Upload Time: _______
- Status: ✅ Success / ❌ Failed
- Notes:

### Issues Found:
1. 
2. 
3. 

### Overall: ✅ Working / ❌ Needs Fix
```

## Expected Performance

| File Size | Expected Time | Status |
|-----------|--------------|---------|
| 5MB | 5-10 seconds | Should be fast |
| 25MB | 20-30 seconds | Should be smooth |
| 50MB | 40-60 seconds | Should complete |
| 75MB | 60-90 seconds | Should complete |
| 100MB | 90-120 seconds | Should complete |

*Times vary based on internet speed*

## Next Steps After Testing

1. If all tests pass:
   - ✅ Large file upload is working!
   - Consider tightening Supabase policies for production
   
2. If tests fail:
   - Check error messages
   - Review console logs
   - Verify Supabase configuration
   - Check UPLOAD_FIX_SUMMARY.md for solutions
