'use client';
import { useEffect, useState } from 'react';
import { useSession, useUser } from '@clerk/nextjs';
import { Avatar } from '@/components/Avatar';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);

  const { user } = useUser();
  const { session } = useSession();

  useEffect(() => {
    if (!user) return;

    async function initializeUserProfile() {
      setLoading(true);

      try {
        // Use Prisma instead of Supabase
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const existingProfile = await response.json();
          if (existingProfile) {
            setUserProfile(existingProfile);
          } else {
            // Create new profile
            const createResponse = await fetch('/api/profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: user.id,
                avatar_url: null,
              }),
            });

            if (createResponse.ok) {
              const newProfile = await createResponse.json();
              setUserProfile(newProfile);
              setShowAvatarCreator(true);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
      } finally {
        setLoading(false);
      }
    }

    initializeUserProfile();
  }, [user]);

  const handleAvatarUpdated = async (updatedProfile) => {
    setUserProfile(updatedProfile);
    setShowAvatarCreator(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showAvatarCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {userProfile?.avatar_url ? 'Edit Your Avatar' : 'Create Your Avatar'}
              </h2>
              {userProfile?.avatar_url && (
                <button
                  onClick={() => setShowAvatarCreator(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              )}
            </div>
            <Avatar
              userId={user.id}
              avatarUrl={userProfile?.avatar_url}
              onAvatarUpdated={handleAvatarUpdated}
            />
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-blue-100">Welcome back, {user?.firstName || 'User'}!</p>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {userProfile?.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt="Your Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-4xl">👤</span>
                  </div>
                )}
                <div className="w-full h-full bg-gray-300 hidden items-center justify-center">
                  <span className="text-gray-500 text-4xl">👤</span>
                </div>
              </div>

              <button
                onClick={() => setShowAvatarCreator(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
              >
                {userProfile?.avatar_url ? '✏️ Edit Avatar' : '🎨 Create Avatar'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Username</p>
              <p className="font-semibold">{user?.username || user?.firstName || 'Not set'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Avatar Status</p>
              <p className="font-semibold">
                {userProfile?.avatar_url ? (
                  <span className="text-green-600">✅ Avatar Ready</span>
                ) : (
                  <span className="text-orange-600">⚠️ No Avatar</span>
                )}
              </p>
            </div>

            {userProfile?.created_at && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="font-semibold">
                  {new Date(userProfile.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 