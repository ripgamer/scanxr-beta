'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Upload, Check, X } from "lucide-react"
import RippleWaveLoader from "@/components/mvpblocks/ripple-loader"

export function EditProfileDialog({ profile, userId }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [formData, setFormData] = useState({
    username: profile.user?.username || '',
    bio: profile.bio || '',
    avatarUrl: profile.avatarUrl || ''
  })

  const checkUsernameAvailability = async (username) => {
    if (username === profile.user?.username) {
      setUsernameAvailable(true)
      return
    }

    if (!username || username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setIsCheckingUsername(true)
    try {
      const response = await fetch(`/api/profile/check-username?username=${encodeURIComponent(username)}`)
      const data = await response.json()
      setUsernameAvailable(data.available)
    } catch (error) {
      console.error('Error checking username:', error)
      setUsernameAvailable(null)
    } finally {
      setIsCheckingUsername(false)
    }
  }

  const handleUsernameChange = (newUsername) => {
    const sanitized = newUsername.toLowerCase().replace(/[^a-z0-9-_]/g, '')
    setFormData({ ...formData, username: sanitized })
    
    // Debounce username check
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(sanitized)
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploadingAvatar(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('userId', userId)

      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        body: formDataUpload,
      })

      const data = await response.json()

      if (response.ok) {
        setFormData({ ...formData, avatarUrl: data.url })
      } else {
        alert(data.error || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!usernameAvailable && formData.username !== profile.user?.username) {
      alert('Username is not available')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          username: formData.username,
          slug: formData.username, // Slug is same as username
          bio: formData.bio,
          avatarUrl: formData.avatarUrl
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOpen(false)
        // Redirect to new slug if username changed
        if (formData.username !== profile.user?.username) {
          router.push(`/${formData.username}`)
        } else {
          router.refresh()
        }
      } else {
        alert(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <RippleWaveLoader />}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 text-sm sm:text-base px-4 sm:px-6 py-2">
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information. Changes will be reflected immediately.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border bg-muted">
                  <img 
                    src={formData.avatarUrl || '/professional-profile.png'} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/professional-profile.png'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                  />
                  <Label
                    htmlFor="avatar-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Max 5MB. JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="Enter username"
                  required
                  minLength={3}
                  className={`pr-10 ${
                    usernameAvailable === false ? 'border-red-500' : 
                    usernameAvailable === true && formData.username !== profile.user?.username ? 'border-green-500' : ''
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCheckingUsername && (
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  )}
                  {!isCheckingUsername && usernameAvailable === true && formData.username !== profile.user?.username && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  {!isCheckingUsername && usernameAvailable === false && (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your profile URL will be: scanxr.com/{formData.username || 'username'}
              </p>
              {usernameAvailable === false && (
                <p className="text-xs text-red-500">This username is already taken</p>
              )}
              {usernameAvailable === true && formData.username !== profile.user?.username && (
                <p className="text-xs text-green-500">This username is available</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/500
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || uploadingAvatar || (usernameAvailable === false)}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
