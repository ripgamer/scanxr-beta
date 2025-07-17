// hooks/useUserProfile.js
import { useEffect, useState } from 'react'
import { useSession, useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { user } = useUser()
  const { session } = useSession()

  // Create Supabase client with Clerk auth
  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_KEY,
      {
        global: {
          accessToken: async () => {
            const token = await session?.getToken({ template: 'supabase' })
            return token || null
          },
        },
      }
    )
  }
  

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
        const client = createClerkSupabaseClient()
        
        // Check if user already has a profile
        const { data: existingProfile, error: fetchError } = await client
          .from('profile')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (existingProfile && !fetchError) {
          // User has profile, load it
          setUserProfile(existingProfile)
        } else {
          // New user, create profile without avatar_url
          const { data: newProfile, error: createError } = await client
            .from('profile')
            .insert({
              user_id: user.id,
              avatar_url: null,
            })
            .select('*')
            .single()

          if (createError) {
            throw createError
          }
          
          setUserProfile(newProfile)
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
      const client = createClerkSupabaseClient()
      const { data: updatedProfile, error } = await client
        .from('profile')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', user.id)
        .select('*')
        .single()
      
      if (error) {
        throw error
      }
      
      setUserProfile(updatedProfile)
      return true
    } catch (err) {
      console.error('Error updating avatar:', err)
      setError(err.message)
      return false
    }
  }

  return {
    user,
    userProfile,
    loading,
    error,
    updateAvatarUrl
  }
}