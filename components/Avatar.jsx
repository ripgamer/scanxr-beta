// components/Avatar.jsx
import { AvatarCreator } from '@readyplayerme/react-avatar-creator'

export function Avatar({
  userId,
  avatarUrl,
  onAvatarUpdated
}) {
  // Extract avatar ID from existing URL
  const getAvatarIdFromUrl = (url) => {
    if (!url || typeof url !== 'string') return null

    const patterns = [
      /\/([a-f0-9-]{36})\.glb$/i,
      /\/([a-f0-9-]+)\.glb$/i,
      /models\.readyplayer\.me\/([a-f0-9-]+)/i,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) return match[1]
    }

    return null
  }

  const avatarId = getAvatarIdFromUrl(avatarUrl)

  const config = {
    clearCache: false,
    bodyType: 'fullbody',
    quickStart: false,
    language: 'en',
    ...(avatarId && { avatarId })
  }

  const style = {
    width: '100%',
    height: '600px',
    border: 'none',
    borderRadius: '8px'
  }

  const handleOnAvatarExported = async (event) => {
    const newAvatarUrl = event.data.url

    try {
      // Update profile using the new API
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarUrl: newAvatarUrl,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        if (onAvatarUpdated) {
          onAvatarUpdated(updatedProfile);
        }
      } else {
        console.error('Failed to update avatar');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  }

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
  )
}
