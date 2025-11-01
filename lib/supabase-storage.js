// lib/supabase-storage.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Generate unique file path
export const generateFilePath = (userId, fileType, originalName) => {
  const timestamp = Date.now();
  const fileExtension = originalName.split('.').pop();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${fileType}/${userId}/${timestamp}-${sanitizedName}`;
};

// Upload 3D model with validation
export const upload3DModel = async (file, userId) => {
  try {
    // Validate file type - Support multiple 3D formats
    const allowedTypes = ['.glb', '.gltf', '.obj', '.fbx', '.dae', '.3ds', '.blend', '.x3d', '.ply', '.stl'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      throw new Error('Invalid file type. Supported formats: GLB, GLTF, OBJ, FBX, DAE, 3DS, BLEND, X3D, PLY, STL');
    }

    // Validate file size (100MB limit for 3D models)
    const maxSizeInBytes = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSizeInBytes) {
      throw new Error('File size too large. Maximum size is 100MB.');
    }

    const filePath = generateFilePath(userId, 'models', file.name);
    
    const { data, error } = await supabase.storage
      .from('scanxr-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('scanxr-files')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading GLB model:', error);
    throw error;
  }
};

// Upload thumbnail image with validation
export const uploadThumbnail = async (file, userId) => {
  try {
    // Validate file type - Support multiple image formats
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml', 'image/avif'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.tif', '.svg', '.avif'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!file.type.startsWith('image/') || !allowedImageTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
      throw new Error('Invalid image type. Supported formats: JPG, JPEG, PNG, WEBP, GIF, BMP, TIFF, SVG, AVIF');
    }

    // Validate file size (10MB limit for images)
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      throw new Error('Image size too large. Maximum size is 10MB.');
    }

    const filePath = generateFilePath(userId, 'thumbnails', file.name);
    
    const { data, error } = await supabase.storage
      .from('scanxr-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('scanxr-files')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw error;
  }
};

// Generic file upload function
export const uploadFileToSupabase = async (file, bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Delete file from storage
export const deleteFileFromSupabase = async (bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Backward compatibility
export const uploadGLBModel = upload3DModel;

export default supabase;