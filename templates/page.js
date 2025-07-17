'use client';
import { useEffect, useState } from 'react';
import { useSession, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import AFrameScene from '@/templates/AFrameScene';
import ModelViewer from '@/components/ModelViewer';
import { LoginHandler } from './LoginHandler';
import { Avatar } from '../components/Avatar';
import { useUserProfile } from '../hooks/useUserProfile';

export default function Home() {
  const { user, userProfile, loading, error } = useUserProfile();

  return (
    <LoginHandler>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-600">
              Hello, {user?.firstName || 'User'}! 👋
            </p>
          </div>

          {/* Main Content */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {loading ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-red-500 mb-4 text-4xl">❌</div>
                    <p className="text-red-600">Error: {error}</p>
                  </div>
                </div>
              ) : (
                <Avatar />
              )}
            </div>
          </div>

          {/* Additional Info */}
          {userProfile && (
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Member since: {new Date(userProfile.created_at).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </LoginHandler>
  );
  // return (
  //   <div>
  //     <AFrameScene gltfUrl={"https://models.readyplayer.me/6871000ee5afd79c7a5faca7.glb"}></AFrameScene>
  //     {/* <ModelViewer gltfUrl={"https://models.readyplayer.me/6871000ee5afd79c7a5faca7.glb"}></ModelViewer> */}
  //   </div>
  // );
}