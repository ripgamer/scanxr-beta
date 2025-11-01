// Alternative: Use service role key for admin operations
// Add this to your .env.local (TEMPORARY - for development only)

// Get your service role key from Supabase Dashboard -> Settings -> API
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

// Then create a separate admin client for setup operations
// lib/supabase-admin.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Use this client to disable RLS:
// await supabaseAdmin.sql`ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;`