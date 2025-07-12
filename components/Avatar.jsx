// components/Avatar.jsx
import { AvatarCreator } from '@readyplayerme/react-avatar-creator';

export function Avatar({ onAvatarCreated, existingAvatarUrl }) {
  // Extract avatar ID from existing URL for editing
  const getAvatarIdFromUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    
    try {
      // Handle different Ready Player Me URL formats
      const patterns = [
        /\/([a-f0-9-]{36})\.glb$/i,  // Standard UUID format
        /\/([a-f0-9-]+)\.glb$/i,     // Your original pattern
        /models\.readyplayer\.me\/([a-f0-9-]+)/i, // Alternative extraction
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          console.log(`Extracted avatar ID: ${match[1]} from URL: ${url}`);
          return match[1];
        }
      }
      
      console.warn(`Could not extract avatar ID from URL: ${url}`);
      return null;
    } catch (error) {
      console.error('Error extracting avatar ID:', error);
      return null;
    }
  };

  const avatarId = getAvatarIdFromUrl(existingAvatarUrl);

  const config = {
    clearCache: false, // Set to false when editing existing avatar
    bodyType: 'fullbody',
    quickStart: false,
    language: 'en',
    // If we have an existing avatar ID, use it for editing
    ...(avatarId && { avatarId: avatarId }),
  };

  const style = { 
    width: '100%', 
    height: '600px', 
    border: 'none',
    borderRadius: '8px'
  };

  const handleOnAvatarExported = (event) => {
    console.log(`Avatar URL is: ${event.data.url}`);
    
    // Call the parent component's callback with the avatar URL
    if (onAvatarCreated) {
      onAvatarCreated(event.data.url);
    }
  };

  return (
    <div className="w-full">
      {avatarId && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-700">
            ✏️ Editing existing avatar. Your current customizations will be loaded.
          </p>
        </div>
      )}
      <AvatarCreator 
        subdomain="scanxr" 
        config={config} 
        style={style} 
        onAvatarExported={handleOnAvatarExported} 
      />
    </div>
  );
}

export default Avatar;