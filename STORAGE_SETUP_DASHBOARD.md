# Supabase Storage Setup - Dashboard Method (No SQL Required!)

## 🖱️ **Option 1: Use Supabase Dashboard (Recommended)**

### Step 1: Create Bucket via UI
1. Go to [supabase.com](https://supabase.com) → Your Project
2. Navigate to **Storage** in the sidebar
3. Click **"New Bucket"**
4. Fill in:
   - **Bucket Name:** `scanxr-files`
   - **Public:** ✅ Checked
   - **File Size Limit:** `104857600` (100MB)
   - **Allowed MIME Types:** Copy/paste this list:

```
model/gltf-binary,model/gltf+json,model/obj,application/octet-stream,text/plain,application/x-blender,model/x3d+xml,model/stl,application/x-3ds,model/ply,application/x-fbx,model/vnd.collada+xml,model/mesh,model/vrml,image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/svg+xml,image/avif,image/x-bmp,image/x-ms-bmp,image/heic,image/heif,image/jxl
```

### Step 2: Set Up Policies (via Dashboard)
1. Go to **Storage** → **Policies**
2. Click **"New Policy"** for each:

**Policy 1 - Upload Models:**
- **Target:** `storage.objects`
- **Action:** `INSERT`
- **Role:** `authenticated`
- **Check:** `bucket_id = 'scanxr-files' AND auth.role() = 'authenticated'`

**Policy 2 - View Models:**
- **Target:** `storage.objects`  
- **Action:** `SELECT`
- **Role:** `public`
- **Check:** `bucket_id = 'scanxr-files'`

---

## 💻 **Option 2: Use SQL Editor (If you prefer code)**

Just copy/paste the `supabase-storage-comprehensive.sql` content into:
**Supabase Dashboard** → **SQL Editor** → **New Query** → Run

---

## 🎯 **Why This Separation Makes Sense**

### Your Prisma Models (App Data):
```javascript
// This stays in your Next.js app
const post = await prisma.post.create({
  data: {
    title: "My 3D Model",
    modelUrl: "https://supabase-storage-url/models/user123/model.glb", // ← File URL
    userId: user.id
  }
});
```

### Supabase Storage (File Hosting):
```javascript
// This handles the actual file upload
const { data } = await supabase.storage
  .from('scanxr-files')
  .upload(`models/${userId}/model.glb`, file);
```

## ✅ **The Flow:**
1. **User uploads file** → Supabase Storage (gets URL)
2. **Save metadata** → Prisma Database (stores URL + info)
3. **Display model** → Fetch from database, load file from storage URL

Think of it like:
- **Prisma** = Your app's brain (data/relationships)  
- **Supabase Storage** = Your app's file cabinet (actual files)

---

## 🚀 **Quick Test After Setup:**
1. Create the bucket (Dashboard or SQL)
2. Go to `localhost:3001/create`
3. Upload a GLB file
4. Check if it appears in Storage → scanxr-files