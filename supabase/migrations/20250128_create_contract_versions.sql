-- Drop existing tables if they exist
DROP TABLE IF EXISTS contract_changes CASCADE;
DROP TABLE IF EXISTS contract_versions CASCADE;

-- Create contract versions table
CREATE TABLE contract_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    changes_summary TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contract_id, version_number)
);

-- Create contract changes table
CREATE TABLE contract_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID REFERENCES contract_versions(id) ON DELETE CASCADE,
    change_type TEXT NOT NULL, -- added, removed, modified
    section_title TEXT,
    old_content TEXT,
    new_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_contract_versions_contract_id ON contract_versions(contract_id);
CREATE INDEX idx_contract_versions_created_at ON contract_versions(created_at DESC);
CREATE INDEX idx_contract_changes_version_id ON contract_changes(version_id);

-- Enable RLS
ALTER TABLE contract_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_changes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contract_versions
CREATE POLICY "Users can view versions of their contracts"
    ON contract_versions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM contracts c
            JOIN projects p ON c.project_id = p.id
            WHERE c.id = contract_versions.contract_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create versions of their contracts"
    ON contract_versions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM contracts c
            JOIN projects p ON c.project_id = p.id
            WHERE c.id = contract_versions.contract_id
            AND p.user_id = auth.uid()
        )
    );

-- RLS Policies for contract_changes
CREATE POLICY "Users can view changes of their contract versions"
    ON contract_changes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM contract_versions cv
            JOIN contracts c ON cv.contract_id = c.id
            JOIN projects p ON c.project_id = p.id
            WHERE cv.id = contract_changes.version_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create changes for their contract versions"
    ON contract_changes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM contract_versions cv
            JOIN contracts c ON cv.contract_id = c.id
            JOIN projects p ON c.project_id = p.id
            WHERE cv.id = contract_changes.version_id
            AND p.user_id = auth.uid()
        )
    );

-- Function to auto-create version on contract update
CREATE OR REPLACE FUNCTION create_contract_version()
RETURNS TRIGGER AS $$
DECLARE
    next_version INTEGER;
BEGIN
    -- Get the next version number
    SELECT COALESCE(MAX(version_number), 0) + 1
    INTO next_version
    FROM contract_versions
    WHERE contract_id = NEW.id;

    -- Create new version
    INSERT INTO contract_versions (
        contract_id,
        version_number,
        content,
        changes_summary,
        created_by
    ) VALUES (
        NEW.id,
        next_version,
        NEW.content,
        'Auto-saved version',
        auth.uid()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create version on contract update
CREATE TRIGGER contract_version_trigger
    AFTER UPDATE OF content ON contracts
    FOR EACH ROW
    WHEN (OLD.content IS DISTINCT FROM NEW.content)
    EXECUTE FUNCTION create_contract_version();
