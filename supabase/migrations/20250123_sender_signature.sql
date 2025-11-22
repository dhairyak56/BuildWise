-- Add sender signature columns to contracts table
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS sender_signature TEXT,
ADD COLUMN IF NOT EXISTS sender_signed_at TIMESTAMPTZ;
