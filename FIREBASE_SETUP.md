# Firebase Setup Guide for ScanXR

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `scanxr-beta` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Firebase Storage

1. In your Firebase project console, go to **Build > Storage**
2. Click "Get started"
3. Choose "Start in production mode" for security
4. Select a Cloud Storage location (choose closest to your users)
5. Click "Done"

## 3. Configure Storage Security Rules

1. In Firebase Storage, go to the **Rules** tab
2. Replace the default rules with the content from `firebase-storage.rules`
3. Click "Publish"

**Note**: The rules we created allow:
- Anyone to read thumbnails (for public display)
- Only authenticated users to read 3D models
- Only file owners to upload files
- File size limits (50MB for models, 5MB for images)

## 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click **Web app icon** (</>)
4. Register app name: `scanxr-web`
5. Copy the config object

## 5. Update Environment Variables

Add these to your `.env` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

## 6. Set Up Firebase Authentication (Optional but Recommended)

If you want to use Firebase Auth with Clerk:

1. Go to **Build > Authentication**
2. Click "Get started"
3. Go to **Settings > General**
4. In "Authorized domains", add your domain(s)

## 7. Storage Structure

Our app will create this file structure:

```
storage/
├── models/
│   └── {userId}/
│       ├── {timestamp}-model1.glb
│       ├── {timestamp}-model2.gltf
│       └── ...
└── thumbnails/
    └── {userId}/
        ├── {timestamp}-thumb1.jpg
        ├── {timestamp}-thumb2.png
        └── ...
```

## 8. Billing & Usage Limits

- **Free Tier**: 1GB storage, 10GB/month downloads
- **Upload Limits**: 
  - 3D Models: 50MB max per file
  - Thumbnails: 5MB max per file
- **File Types**:
  - Models: .glb, .gltf
  - Thumbnails: .jpg, .jpeg, .png, .webp

## 9. Testing the Setup

1. Start your development server: `npm run dev`
2. Go to `/create` page
3. Try uploading a small GLB file
4. Check Firebase Storage console to see if files appear

## 10. Production Deployment

For production deployment:

1. Update CORS settings in Firebase Storage
2. Add your production domain to authorized domains
3. Update storage rules if needed
4. Monitor usage in Firebase console

## Troubleshooting

**Common Issues:**

1. **Permission Denied**: Check storage rules and authentication
2. **File Too Large**: Ensure files are under size limits
3. **Invalid File Type**: Only GLB/GLTF for models, images for thumbnails
4. **Environment Variables**: Ensure all Firebase config vars are set

**Testing Storage Rules:**

Use Firebase Storage Rules simulator in the console to test your rules.

## Security Notes

- Never expose Firebase Admin SDK credentials in frontend
- Use Clerk for user authentication, Firebase for file storage only
- Regularly monitor storage usage and costs
- Consider implementing file scanning for malicious content in production