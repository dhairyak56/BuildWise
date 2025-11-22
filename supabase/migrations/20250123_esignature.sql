-- Create signature_requests table
CREATE TABLE IF NOT EXISTS signature_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    signer_email TEXT NOT NULL,
    signer_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, signed, rejected
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    signed_at TIMESTAMPTZ,
    signature_data TEXT, -- Base64 signature image
    ip_address TEXT,
    user_agent TEXT,
    access_token UUID DEFAULT uuid_generate_v4(), -- Unique token for secure access
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE signature_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view requests for their contracts
CREATE POLICY "Users can view signature requests for their contracts" ON signature_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM contracts
            JOIN projects ON contracts.project_id = projects.id
            WHERE contracts.id = signature_requests.contract_id
            AND projects.user_id = auth.uid()
        )
    );

-- Policy: Public access for signing via token (we'll handle this via secure API, but for direct RLS if needed)
-- For now, we'll rely on the API with service role for the public signing part to keep it simple and secure
