-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    extracted_data JSONB,
    status TEXT NOT NULL DEFAULT 'processing', -- processing, completed, error
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist (in case table already existed with missing columns)
DO $$
BEGIN
    -- extracted_data
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'extracted_data') THEN
        ALTER TABLE documents ADD COLUMN extracted_data JSONB;
    END IF;

    -- status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'status') THEN
        ALTER TABLE documents ADD COLUMN status TEXT NOT NULL DEFAULT 'processing';
    END IF;

    -- file_path
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'file_path') THEN
        ALTER TABLE documents ADD COLUMN file_path TEXT NOT NULL DEFAULT '';
    END IF;

    -- file_type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'file_type') THEN
        ALTER TABLE documents ADD COLUMN file_type TEXT NOT NULL DEFAULT 'unknown';
    END IF;

    -- size
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'size') THEN
        ALTER TABLE documents ADD COLUMN size INTEGER NOT NULL DEFAULT 0;
    END IF;

    -- Ensure client_name exists in payments table (needed for OCR auto-entry)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'client_name') THEN
        ALTER TABLE payments ADD COLUMN client_name TEXT;
    END IF;

    -- Ensure name exists in payments table (used for description)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'name') THEN
        ALTER TABLE payments ADD COLUMN name TEXT;
    END IF;

    -- Ensure user_id exists in payments table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'user_id') THEN
        ALTER TABLE payments ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Ensure project_id exists in payments table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'project_id') THEN
        ALTER TABLE payments ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE CASCADE;
    END IF;

    -- Ensure amount exists in payments table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'amount') THEN
        ALTER TABLE payments ADD COLUMN amount NUMERIC;
    END IF;

    -- Ensure payment_date exists in payments table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'payment_date') THEN
        ALTER TABLE payments ADD COLUMN payment_date DATE;
    END IF;

    -- Ensure status exists in payments table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'status') THEN
        ALTER TABLE payments ADD COLUMN status TEXT DEFAULT 'Pending';
    END IF;
END $$;

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies
-- Policies
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
CREATE POLICY "Users can view their own documents" ON documents
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
CREATE POLICY "Users can insert their own documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
CREATE POLICY "Users can update their own documents" ON documents
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;
CREATE POLICY "Users can delete their own documents" ON documents
    FOR DELETE USING (auth.uid() = user_id);

-- Storage Bucket (if not exists)
-- Note: Storage buckets are usually created via the Supabase Dashboard or specific storage API calls, 
-- but we can try to insert into storage.buckets if permissions allow. 
-- For now, we'll assume the user needs to create a 'documents' bucket or we use a public one.
-- We'll add a policy for storage objects just in case.

-- Policy for storage objects (assuming 'documents' bucket exists)
-- This SQL might fail if the user doesn't have permissions to modify storage.objects directly via SQL editor
-- So we will skip the storage creation SQL and ask the user to create the bucket 'documents' in the dashboard.
