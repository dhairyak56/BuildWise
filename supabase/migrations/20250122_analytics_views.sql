-- Analytics database views and functions

-- Cash flow projection view
CREATE OR REPLACE VIEW cash_flow_projection AS
SELECT 
    date_trunc('month', p.payment_date) as month,
    SUM(p.amount) FILTER (WHERE p.status = 'pending') as expected_income,
    SUM(p.amount) FILTER (WHERE p.status = 'paid') as actual_income,
    COUNT(*) FILTER (WHERE p.status = 'overdue') as overdue_count,
    proj.user_id
FROM payments p
JOIN projects proj ON p.project_id = proj.id
GROUP BY month, proj.user_id
ORDER BY month;

-- Project profitability analysis
CREATE OR REPLACE VIEW project_profitability AS
SELECT 
    p.id,
    p.name,
    p.contract_value as budget,
    p.user_id,
    COALESCE(SUM(pay.amount) FILTER (WHERE pay.status = 'paid'), 0) as revenue,
    p.contract_value - COALESCE(SUM(pay.amount) FILTER (WHERE pay.status = 'paid'), 0) as remaining,
    (COALESCE(SUM(pay.amount) FILTER (WHERE pay.status = 'paid'), 0) / NULLIF(p.contract_value, 0) * 100) as completion_percentage
FROM projects p
LEFT JOIN payments pay ON pay.project_id = p.id
GROUP BY p.id, p.name, p.contract_value, p.user_id;

-- Payment trends
CREATE OR REPLACE VIEW payment_trends AS
SELECT 
    date_trunc('month', p.created_at) as month,
    COUNT(*) as total_payments,
    SUM(p.amount) as total_amount,
    AVG(p.amount) as avg_payment,
    COUNT(*) FILTER (WHERE p.status = 'paid') as paid_count,
    COUNT(*) FILTER (WHERE p.status = 'overdue') as overdue_count,
    proj.user_id
FROM payments p
JOIN projects proj ON p.project_id = proj.id
GROUP BY month, proj.user_id
ORDER BY month DESC;

-- Enable RLS on views
ALTER VIEW cash_flow_projection SET (security_invoker = on);
ALTER VIEW project_profitability SET (security_invoker = on);
ALTER VIEW payment_trends SET (security_invoker = on);

-- RLS Policies for views (they inherit from base tables)
-- No additional policies needed as views use auth.uid() filtering

-- Function to get analytics overview
CREATE OR REPLACE FUNCTION get_analytics_overview()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_revenue', COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'paid'), 0),
        'outstanding', COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'pending'), 0),
        'overdue', COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'overdue'), 0),
        'active_projects', (SELECT COUNT(*) FROM projects WHERE user_id = auth.uid() AND status = 'active'),
        'total_projects', (SELECT COUNT(*) FROM projects WHERE user_id = auth.uid()),
        'overdue_count', COUNT(*) FILTER (WHERE p.status = 'overdue')
    ) INTO result
    FROM payments p
    JOIN projects proj ON p.project_id = proj.id
    WHERE proj.user_id = auth.uid();
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
