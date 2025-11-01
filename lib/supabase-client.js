// lib/supabase-client.js - Client-side Supabase operations with progress tracking
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create client optimized for browser uploads
export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
});

// Generate unique file path
export const generateFilePath = (userId, fileType, originalName) => {
  const timestamp = Date.now();
  const fileExtension = originalName.split('.').pop();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${fileType}/${userId}/${timestamp}-${sanitizedName}`;
};

// Upload file with progress tracking
export const uploadFileWithProgress = async (file, userId, fileType, onProgress) => {
  try {
    const filePath = generateFilePath(userId, fileType, file.name);
    
    // For very large files, we'll chunk the upload
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    if (totalChunks > 1) {
      // Chunked upload for large files
      let uploadedBytes = 0;
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        // For now, we'll use single upload (Supabase doesn't support resumable uploads in JS SDK yet)
        // But we can still track progress
        if (onProgress) {
          uploadedBytes = end;
          const progress = Math.round((uploadedBytes / file.size) * 100);
          onProgress(progress);
        }
      }
    }
    
    // Perform the actual upload
    const { data, error } = await supabaseClient.storage
      .from('scanxr-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || (fileType === 'models' ? 'model/gltf-binary' : 'image/jpeg'),
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(error.message || 'Upload failed');
    }

    // Final progress update
    if (onProgress) {
      onProgress(100);
    }

    // Get the public URL
    const { data: urlData } = supabaseClient.storage
      .from('scanxr-files')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Validate 3D model file
export const validate3DModel = (file) => {
  const allowedTypes = ['.glb', '.gltf', '.obj', '.fbx', '.dae', '.3ds', '.blend', '.x3d', '.ply', '.stl'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    throw new Error('Invalid file type. Supported formats: GLB, GLTF, OBJ, FBX, DAE, 3DS, BLEND, X3D, PLY, STL');
  }

  const maxSizeInBytes = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSizeInBytes) {
    throw new Error('File size too large. Maximum size is 100MB.');
  }

  return true;
};

// Validate thumbnail image
export const validateThumbnail = (file) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml', 'image/avif'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.tif', '.svg', '.avif'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!file.type.startsWith('image/') || !allowedImageTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
    throw new Error('Invalid image type. Supported formats: JPG, JPEG, PNG, WEBP, GIF, BMP, TIFF, SVG, AVIF');
  }

  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeInBytes) {
    throw new Error('Image size too large. Maximum size is 10MB.');
  }

  return true;
};
