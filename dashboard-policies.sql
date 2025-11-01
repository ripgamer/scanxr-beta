-- Copy these policies one by one into Supabase Dashboard
-- Policy Template Editor

-- POLICY 1: Allow uploads to scanxr-files bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'scanxr-files'
);

-- POLICY 2: Allow reads from scanxr-files bucket  
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT USING (
    bucket_id = 'scanxr-files'
);

-- POLICY 3 (Optional): Allow updates
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE USING (
    bucket_id = 'scanxr-files'
);

-- POLICY 4 (Optional): Allow deletes
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE USING (
    bucket_id = 'scanxr-files'
);