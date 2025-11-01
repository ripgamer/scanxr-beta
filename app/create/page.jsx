'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUpload, FaCamera, FaCube, FaArrowRight, FaCheck, FaImage } from 'react-icons/fa';

export default function CreatePage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    thumbnailFile: null,
    tags: [],
    visibility: 'public'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, router]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file extension - Support multiple 3D formats
    const allowedExtensions = ['.glb', '.gltf', '.obj', '.fbx', '.dae', '.3ds', '.blend', '.x3d', '.ply', '.stl'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      setError('Please upload a valid 3D model file. Supported formats: GLB, GLTF, OBJ, FBX, DAE, 3DS, BLEND, X3D, PLY, STL');
      return;
    }

    // Validate file size (100MB)
    const maxSizeInBytes = 100 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setError('File size too large. Maximum size is 100MB.');
      return;
    }

    // Clear any previous errors
    setError('');
    setFormData(prev => ({ ...prev, file }));
    setStep(2);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, tag] 
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type - Support multiple image formats
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml', 'image/avif'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.tif', '.svg', '.avif'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!file.type.startsWith('image/') || !allowedImageTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
      setError('Please upload a valid image file. Supported formats: JPG, JPEG, PNG, WEBP, GIF, BMP, TIFF, SVG, AVIF');
      return;
    }

    // Validate file size (10MB)
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setError('Thumbnail size too large. Maximum size is 10MB.');
      return;
    }

    // Clear any previous errors
    setError('');
    setFormData(prev => ({ ...prev, thumbnailFile: file }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.file) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);
    
    try {
      // Basic validation (detailed validation happens on server)
      if (!formData.file || !formData.title.trim()) {
        throw new Error('Please provide both a title and a 3D model file.');
      }

      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('tags', formData.tags.join(','));
      uploadFormData.append('visibility', formData.visibility);
      uploadFormData.append('modelFile', formData.file);
      
      if (formData.thumbnailFile) {
        uploadFormData.append('thumbnailFile', formData.thumbnailFile);
      }

      // Start upload with progress simulation
      // In a real implementation, you'd get progress from the upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: uploadFormData,
      });

      clearInterval(progressInterval);
      setUploadProgress(95);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadProgress(100);

      // Success! Show completion message briefly then redirect to profile
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      // Keep uploading state until redirect
      if (!error) {
        setTimeout(() => setIsUploading(false), 1500);
      } else {
        setIsUploading(false);
      }
    }
  };

  const steps = [
    { number: 1, title: 'Upload Model', icon: FaUpload },
    { number: 2, title: 'Add Details', icon: FaCube },
    { number: 3, title: 'Publish', icon: FaCheck }
  ];

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to create content</h1>
          <p className="text-gray-600">You need to be signed in to upload 3D models.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Create New 3D Model
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your 3D model and share it with the ScanXR community
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  step >= stepItem.number
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <stepItem.icon className="w-5 h-5" />
              </motion.div>
              <span className={`ml-2 font-medium ${
                step >= stepItem.number ? 'text-purple-600' : 'text-gray-400'
              }`}>
                {stepItem.title}
              </span>
              {index < steps.length - 1 && (
                <FaArrowRight className="mx-4 text-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Content Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {step === 1 && (
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 mb-6">
                <FaUpload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Upload Your 3D Model</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop your .glb or .gltf file here, or click to browse
                </p>
                <label className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".glb,.gltf,.obj,.fbx,.dae,.3ds,.blend,.x3d,.ply,.stl"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Supported formats: GLB, GLTF, OBJ, FBX, DAE, 3DS, BLEND, X3D, PLY, STL (Max size: 100MB)
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                  placeholder="Enter a catchy title for your 3D model"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 h-32"
                  placeholder="Describe your 3D model, how it was created, or any special features..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail Image (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  {formData.thumbnailFile ? (
                    <div className="space-y-2">
                      <FaCheck className="w-8 h-8 mx-auto text-green-600" />
                      <p className="text-sm text-gray-600">{formData.thumbnailFile.name}</p>
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, thumbnailFile: null }))}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FaImage className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload a thumbnail image</p>
                      <label className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded cursor-pointer">
                        Choose Image
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif,.svg,.avif,image/*"
                          onChange={handleThumbnailUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                  placeholder="Add tags (press Enter)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTagAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Visibility</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                >
                  <option value="public">Public - Anyone can view</option>
                  <option value="unlisted">Unlisted - Only with link</option>
                  <option value="private">Private - Only you can view</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.title}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <FaCheck className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-2">Ready to Publish!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Review your model details and publish to the ScanXR community
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-left">
                <h4 className="font-semibold mb-2">Model Details:</h4>
                <p><strong>Title:</strong> {formData.title}</p>
                <p><strong>File:</strong> {formData.file?.name}</p>
                <p><strong>Thumbnail:</strong> {formData.thumbnailFile?.name || 'Auto-generated'}</p>
                <p><strong>Tags:</strong> {formData.tags.join(', ') || 'None'}</p>
                <p><strong>Visibility:</strong> {formData.visibility}</p>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  {uploadProgress === 100 ? (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                      <FaCheck className="w-4 h-4" />
                      Upload complete! Redirecting to your profile...
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uploading... {Math.round(uploadProgress)}%</p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={isUploading}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {isUploading ? `Publishing... ${uploadProgress}%` : 'Publish Model'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}