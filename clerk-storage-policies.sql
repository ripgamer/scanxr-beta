-- POLICIES FOR CLERK AUTHENTICATION
-- Supabase doesn't know about Clerk users, so we create open policies
-- Your app already handles auth via Clerk before reaching Supabase

-- POLICY 1: Allow uploads (Clerk handles auth in your app)
CREATE POLICY "Allow all uploads to scanxr-files"
ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'scanxr-files'
);

-- POLICY 2: Allow public reads
CREATE POLICY "Allow all reads from scanxr-files"
ON storage.objects FOR SELECT USING (
    bucket_id = 'scanxr-files'
);

-- POLICY 3: Allow updates
CREATE POLICY "Allow all updates to scanxr-files"
ON storage.objects FOR UPDATE USING (
    bucket_id = 'scanxr-files'
);

-- POLICY 4: Allow deletes
CREATE POLICY "Allow all deletes from scanxr-files"
ON storage.objects FOR DELETE USING (
    bucket_id = 'scanxr-files'
);

-- Note: Security is handled by Clerk in your Next.js API routes
-- Only authenticated Clerk users can reach your /api/posts endpoint