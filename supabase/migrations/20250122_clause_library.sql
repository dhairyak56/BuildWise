-- Clause categories
CREATE TABLE IF NOT EXISTS clause_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clause templates
CREATE TABLE IF NOT EXISTS clause_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES clause_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT true,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's custom clauses
CREATE TABLE IF NOT EXISTS user_clauses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES clause_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clause usage tracking
CREATE TABLE IF NOT EXISTS clause_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clause_id UUID REFERENCES clause_templates(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clause_templates_category ON clause_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_clause_templates_user ON clause_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_clause_templates_public ON clause_templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_user_clauses_user ON user_clauses(user_id);
CREATE INDEX IF NOT EXISTS idx_clause_usage_user ON clause_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_clause_usage_contract ON clause_usage(contract_id);

-- RLS Policies
ALTER TABLE clause_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE clause_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clause_usage ENABLE ROW LEVEL SECURITY;

-- Categories are public (read-only)
CREATE POLICY "Categories are viewable by everyone" ON clause_categories
    FOR SELECT USING (true);

-- Public templates are viewable by everyone
CREATE POLICY "Public templates are viewable by everyone" ON clause_templates
    FOR SELECT USING (is_public = true OR user_id = auth.uid());

-- Users can create their own templates
CREATE POLICY "Users can create templates" ON clause_templates
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own templates
CREATE POLICY "Users can update own templates" ON clause_templates
    FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates" ON clause_templates
    FOR DELETE USING (user_id = auth.uid());

-- User clauses policies
CREATE POLICY "Users can view own clauses" ON user_clauses
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create clauses" ON user_clauses
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own clauses" ON user_clauses
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own clauses" ON user_clauses
    FOR DELETE USING (user_id = auth.uid());

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON clause_usage
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can track usage" ON clause_usage
    FOR INSERT WITH CHECK (user_id = auth.uid());
