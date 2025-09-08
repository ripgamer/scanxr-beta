// hooks/useUserProfile.js
import { useEffect, useState } from 'react'
import { useSession, useUser } from '@clerk/nextjs'

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { user } = useUser()
  const { session } = useSession()
  

  // Load or create user profile on login
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function initializeUserProfile() {
      setLoading(true)
      setError(null)
      
      try {
        // Check if user already has a profile
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUserData(data.user)
          }
          if (data.profile) {
            setUserProfile(data.profile)
          } else {
            // New user, create profile
            const createResponse = await fetch('/api/profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.primaryEmailAddress?.emailAddress,
                username: user.username || user.firstName || `user-${user.id.slice(-8)}`,
                avatarUrl: null,
              }),
            })

            if (createResponse.ok) {
              const newData = await createResponse.json()
              setUserData(newData.user)
              setUserProfile(newData.profile)
            } else {
              throw new Error('Failed to create profile')
            }
          }
        } else {
          throw new Error('Failed to fetch profile')
        }
      } catch (err) {
        console.error('Error initializing user profile:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeUserProfile()
  }, [user, session])

  const updateAvatarUrl = async (avatarUrl) => {
    if (!userProfile) return false
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarUrl: avatarUrl,
        }),
      })
      
      if (response.ok) {
        const updatedProfile = await response.json()
        setUserProfile(updatedProfile)
        return true
      } else {
        throw new Error('Failed to update avatar')
      }
    } catch (err) {
      console.error('Error updating avatar:', err)
      setError(err.message)
      return false
    }
  }

  return {
    user,
    userData,
    userProfile,
    loading,
    error,
    updateAvatarUrl
  }
}