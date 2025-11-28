-- Ensure link column exists (idempotent)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link VARCHAR(500);

-- Reload PostgREST schema cache to recognize the new column
NOTIFY pgrst, 'reload config';
