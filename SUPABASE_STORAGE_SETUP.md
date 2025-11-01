# Supabase Storage Setup Guide for ScanXR

## 🗃️ **Step 1: Create Storage Bucket**

### Option A: Via Supabase Dashboard (Recommended)
1. Go to your Supabase project: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to **Storage** in the sidebar
3. Click **"New Bucket"**
4. Enter bucket details:
   - **Name**: `scanxr-files`
   - **Public bucket**: ✅ **Enable** (for public access to files)
   - **File size limit**: `100 MB`
   - **Allowed MIME types**: 
     ```
     model/gltf-binary
     model/gltf+json
     application/octet-stream
     model/obj
     text/plain
     application/x-blender
     image/jpeg
     image/png
     image/webp
     image/gif
     image/bmp
     image/tiff
     image/svg+xml
     image/avif
     ```
5. Click **"Create bucket"**

### Option B: Via SQL Editor
1. Go to **SQL Editor** in your Supabase dashboard
2. Run the contents of `supabase-storage-simple.sql`

## 🔒 **Step 2: Configure Storage Policies**

Since you're using Clerk for authentication, we use simple policies:

1. Go to **Storage > Policies** in Supabase dashboard
2. For the `scanxr-files` bucket, you should see:
   - ✅ **Public read access** (allows downloading files)
   - ✅ **Public insert access** (allows uploading files)
   - ✅ **Public delete access** (allows deleting files)

**Note**: We handle access control in our Next.js API routes using Clerk authentication.

## 📁 **Step 3: Understand File Structure**

Your files will be organized as:
```
scanxr-files/
├── models/
│   └── {userId}/
│       ├── 1635724800000-awesome_chair.glb
│       ├── 1635724900000-cool_table.gltf
│       ├── 1635725000000-vintage_lamp.obj
│       └── 1635725100000-modern_desk.fbx
└── thumbnails/
    └── {userId}/
        ├── 1635724800000-chair_thumb.jpg
        ├── 1635724900000-table_thumb.png
        └── 1635725000000-lamp_thumb.webp
```

## 🎨 **Supported File Formats**

### **3D Models** (Max: 100MB each)
- **GLB** - Binary glTF (recommended for web)
- **GLTF** - Text-based glTF
- **OBJ** - Wavefront OBJ (widely supported)
- **FBX** - Autodesk FBX
- **DAE** - Collada
- **3DS** - 3D Studio Max
- **BLEND** - Blender files
- **X3D** - Extensible 3D
- **PLY** - Polygon File Format
- **STL** - Stereolithography

### **Thumbnail Images** (Max: 10MB each)
- **JPG/JPEG** - Joint Photographic Experts Group
- **PNG** - Portable Network Graphics
- **WEBP** - Modern web format (recommended)
- **GIF** - Graphics Interchange Format
- **BMP** - Bitmap
- **TIFF** - Tagged Image File Format
- **SVG** - Scalable Vector Graphics
- **AVIF** - AV1 Image File Format

## 🔧 **Step 4: Environment Variables**

Your `.env` already has the required Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://uuoxbspcaagtmyyxbozm.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ✅ **Step 5: Test the Setup**

After creating the bucket:

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Test file upload**:
   - Go to `/create`
   - Upload a GLB file and thumbnail
   - Check Supabase Storage dashboard to see uploaded files

## 📊 **Supabase Free Tier Limits**

- **Storage**: 1GB total
- **Bandwidth**: 2GB/month
- **File uploads**: Unlimited
- **File size**: Up to 100MB per file

## 🔍 **Troubleshooting**

### Common Issues:
1. **"Bucket does not exist"** - Create the bucket first
2. **"Permission denied"** - Check RLS policies
3. **"File too large"** - Ensure 3D models are under 100MB, images under 10MB
4. **"Invalid MIME type"** - Check allowed file types in bucket settings

### Verify Setup:
```bash
# Check if bucket exists by trying to list files
curl -X GET \
  'https://uuoxbspcaagtmyyxbozm.supabase.co/storage/v1/object/list/scanxr-files' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY'
```

## 🚀 **Advantages of Supabase Storage**

- ✅ **Integrated** with your existing Supabase database
- ✅ **No billing surprises** - clear free tier limits
- ✅ **Simple setup** - no complex Firebase configuration
- ✅ **CDN included** - fast file delivery worldwide
- ✅ **Automatic resizing** - can resize images on-the-fly
- ✅ **Built-in security** - RLS policies for access control