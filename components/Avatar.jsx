// components/Avatar.jsx
import { AvatarCreator } from '@readyplayerme/react-avatar-creator'

export function Avatar({
  userId,
  avatarUrl,
  onAvatarUpdated,
  supabaseClient
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

    // Update Supabase with the new avatar URL
    const { data, error } = await supabaseClient
      .from('profile')
      .update({ avatar_url: newAvatarUrl })
      .eq('user_id', userId)
      .select()
      .single()

    if (!error && onAvatarUpdated) {
      onAvatarUpdated(data)
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
