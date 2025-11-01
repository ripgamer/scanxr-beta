# MIME Types Reference for ScanXR

This document lists all MIME types used in the ScanXR application for file validation and storage configuration.

## 🎨 3D Model MIME Types

### Primary 3D Formats
```
model/gltf-binary           # .glb files (Binary glTF)
model/gltf+json             # .gltf files (Text-based glTF)
model/obj                   # .obj files (Wavefront OBJ)
```

### Extended 3D Formats
```
application/octet-stream    # Generic binary (covers many 3D formats)
text/plain                  # Text-based formats (.obj, .dae, .x3d)
application/x-blender       # .blend files (Blender)
model/x3d+xml              # .x3d files (X3D format)
model/stl                  # .stl files (Stereolithography)
application/x-3ds          # .3ds files (3D Studio Max)
model/ply                  # .ply files (Polygon File Format)
application/x-fbx          # .fbx files (Autodesk FBX)
model/vnd.collada+xml      # .dae files (COLLADA)
```

### Fallback MIME Types for 3D
```
application/x-tgif          # Generic 3D interchange
model/mesh                  # Generic mesh format
model/vrml                  # VRML format
application/sla             # SLA format
```

## 🖼️ Image MIME Types

### Standard Image Formats
```
image/jpeg                  # .jpg, .jpeg files
image/png                   # .png files
image/webp                  # .webp files
image/gif                   # .gif files
image/bmp                   # .bmp files
image/tiff                  # .tiff, .tif files
image/svg+xml              # .svg files
image/avif                  # .avif files
```

### Extended Image Formats
```
image/x-bmp                # Alternative BMP MIME type
image/x-ms-bmp             # Microsoft BMP
image/vnd.microsoft.icon   # .ico files
image/x-icon               # Alternative ICO
image/heic                 # .heic files (HEIF)
image/heif                 # .heif files
image/jxl                  # .jxl files (JPEG XL)
```

## 📄 Configuration Files

### For Supabase Storage Bucket
```sql
-- Complete MIME types array for Supabase
ARRAY[
  -- 3D Model formats
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
  
  -- Image formats
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
```

### For JavaScript Validation
```javascript
// 3D Model MIME types for validation
const allowed3DTypes = [
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
  'model/vnd.collada+xml'
];

// Image MIME types for validation
const allowedImageTypes = [
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
  'image/heif'
];
```

### For HTML File Input Accept Attribute
```html
<!-- 3D Models -->
<input 
  type="file" 
  accept=".glb,.gltf,.obj,.fbx,.dae,.3ds,.blend,.x3d,.ply,.stl,
          model/gltf-binary,model/gltf+json,model/obj,application/octet-stream"
>

<!-- Images -->
<input 
  type="file" 
  accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif,.svg,.avif,
          image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/svg+xml,image/avif"
>
```

## 🔍 MIME Type Detection Issues

### Common Problems and Solutions

1. **Binary Files Detected as `application/octet-stream`**
   - Many 3D formats are binary and get this generic MIME type
   - Solution: Also check file extensions for validation

2. **Text-based Files Detected as `text/plain`**
   - Formats like .obj, .dae, .x3d are text-based
   - Solution: Use extension validation alongside MIME type

3. **Browser MIME Type Inconsistencies**
   - Different browsers may report different MIME types
   - Solution: Use both MIME type and extension validation

### Robust Validation Function
```javascript
function validateFile(file, allowedExtensions, allowedMimeTypes) {
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  const mimeType = file.type;
  
  const isValidExtension = allowedExtensions.includes(extension);
  const isValidMimeType = allowedMimeTypes.includes(mimeType) || 
                         mimeType === 'application/octet-stream' || 
                         mimeType === 'text/plain';
  
  return isValidExtension && (isValidMimeType || !mimeType);
}
```

## 🌐 Browser Support Notes

### 3D Format Support
- **GLB/GLTF**: Excellent browser support via Three.js
- **OBJ**: Good support, widely used
- **FBX**: Limited browser support, needs conversion
- **BLEND**: No direct browser support, for download only
- **STL**: Good support for 3D printing workflows

### Image Format Support
- **WEBP**: Modern browsers (95%+ support)
- **AVIF**: Newer format, growing support (85%+ support)
- **HEIC/HEIF**: Limited support, mainly iOS
- **JXL**: Limited support, experimental

## 🔧 Implementation Examples

### Supabase Storage Policy with MIME Types
```sql
CREATE POLICY "Allow 3D model uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'scanxr-files' AND
  (storage.foldername(name))[1] = 'models' AND
  (
    (metadata->>'mimetype') = ANY(ARRAY[
      'model/gltf-binary',
      'model/gltf+json',
      'model/obj',
      'application/octet-stream'
    ]) OR
    name ~* '\.(glb|gltf|obj|fbx|dae|3ds|blend|x3d|ply|stl)$'
  )
);
```

### Express.js Multer Configuration
```javascript
const multer = require('multer');

const fileFilter = (req, file, cb) => {
  const allowed3D = ['.glb', '.gltf', '.obj', '.fbx', '.dae', '.3ds', '.blend', '.x3d', '.ply', '.stl'];
  const allowedImages = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.svg', '.avif'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if ([...allowed3D, ...allowedImages].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});
```

## 📚 References

- [IANA Media Types Registry](https://www.iana.org/assignments/media-types/media-types.xhtml)
- [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [Khronos glTF Specification](https://www.khronos.org/gltf/)
- [Three.js Supported Formats](https://threejs.org/docs/index.html#manual/en/introduction/Loading-3D-models)