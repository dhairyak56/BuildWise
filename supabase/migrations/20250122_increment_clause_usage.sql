-- Function to safely increment clause usage count
CREATE OR REPLACE FUNCTION increment_clause_usage(clause_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE clause_templates
    SET usage_count = COALESCE(usage_count, 0) + 1
    WHERE id = clause_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
