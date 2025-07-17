// components/LoginHandler.jsx
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SignInButton } from '@clerk/nextjs';

export function LoginHandler({ children }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <SignInButton mode="modal">
            <button className="bg-primary text-white px-4 py-2 rounded">Sign In</button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return children
}