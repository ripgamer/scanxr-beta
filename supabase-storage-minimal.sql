-- Minimal Supabase Storage Setup (Run this in SQL Editor)
-- This should work without permission errors

-- Create just the bucket (no policies)
INSERT INTO storage.buckets (id, name, public)
VALUES ('scanxr-files', 'scanxr-files', true);

-- Verify it was created
SELECT * FROM storage.buckets WHERE id = 'scanxr-files';