'use client';
import { useEffect } from 'react';
import { useSession, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

export default function ProfileSetup() {
  const { user } = useUser();
  const { session } = useSession();

  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_KEY,
      {
        async accessToken() {
          return await session?.getToken({ template: 'supabase' });
        },
      }
    );
  }

  const client = createClerkSupabaseClient();

  useEffect(() => {
    if (!user || !session) return;

    async function ensureProfileExists() {
      const { data, error } = await client
        .from('profile')
        .select('id')
        .eq('clerk_id', user.id)
        .single();

      if (!data && !error) {
        const { error: insertError } = await client.from('profile').insert({
          clerk_id: user.id,
          avatar_url: null, // will be updated later by avatar creator
        });

        if (insertError) console.error("❌ Profile insert failed:", insertError);
        else console.log("✅ Profile created for:", user.id);
      }
    }

    ensureProfileExists();
  }, [user, session]);

  return null; // no UI needed, just logic
}
