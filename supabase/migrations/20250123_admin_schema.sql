-- Admin Dashboard Schema
-- This migration creates views and functions for the admin dashboard

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT COALESCE(
            (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
            false
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View: Admin User Statistics
CREATE OR REPLACE VIEW admin_user_stats AS
SELECT
    COUNT(DISTINCT id) as total_users,
    COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN id END) as new_users_30d,
    COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN id END) as new_users_7d,
    COUNT(DISTINCT CASE WHEN last_sign_in_at >= NOW() - INTERVAL '30 days' THEN id END) as active_users_30d,
    COUNT(DISTINCT CASE WHEN last_sign_in_at >= NOW() - INTERVAL '7 days' THEN id END) as active_users_7d
FROM auth.users;

-- View: Admin Project Statistics
CREATE OR REPLACE VIEW admin_project_stats AS
SELECT
    COUNT(*) as total_projects,
    COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_projects,
    COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_projects,
    COUNT(CASE WHEN status = 'On Hold' THEN 1 END) as on_hold_projects,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_projects_30d,
    SUM(contract_value) as total_contract_value,
    AVG(contract_value) as avg_contract_value
FROM projects;

-- View: Admin Revenue Statistics
CREATE OR REPLACE VIEW admin_revenue_stats AS
SELECT
    COUNT(*) as total_payments,
    SUM(amount) as total_revenue,
    SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END) as paid_revenue,
    SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END) as pending_revenue,
    SUM(CASE WHEN payment_date >= NOW() - INTERVAL '30 days' THEN amount ELSE 0 END) as revenue_30d,
    SUM(CASE WHEN payment_date >= NOW() - INTERVAL '7 days' THEN amount ELSE 0 END) as revenue_7d,
    AVG(amount) as avg_payment_amount
FROM payments;

-- View: User List with Stats (for admin user management)
CREATE OR REPLACE VIEW admin_users_list AS
SELECT
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    COUNT(DISTINCT p.id) as project_count,
    COUNT(DISTINCT c.id) as contract_count,
    COALESCE(SUM(pay.amount), 0) as total_revenue
FROM auth.users u
LEFT JOIN projects p ON p.user_id = u.id
LEFT JOIN contracts c ON c.project_id = p.id
LEFT JOIN payments pay ON pay.project_id = p.id AND pay.status = 'Paid'
GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at
ORDER BY u.created_at DESC;

-- View: All Projects with User Info (for admin project monitoring)
CREATE OR REPLACE VIEW admin_projects_list AS
SELECT
    p.id,
    p.name as project_name,
    p.status,
    p.contract_value,
    p.created_at,
    p.user_id,
    u.email as user_email,
    COUNT(DISTINCT c.id) as contract_count,
    COUNT(DISTINCT pay.id) as payment_count,
    COALESCE(SUM(CASE WHEN pay.status = 'Paid' THEN pay.amount ELSE 0 END), 0) as total_paid
FROM projects p
LEFT JOIN auth.users u ON u.id = p.user_id
LEFT JOIN contracts c ON c.project_id = p.id
LEFT JOIN payments pay ON pay.project_id = p.id
GROUP BY p.id, p.name, p.status, p.contract_value, p.created_at, p.user_id, u.email
ORDER BY p.created_at DESC;

-- RLS Policies for Admin Views
-- Note: These views are only accessible to admin users

-- Enable RLS on views (they inherit from base tables, but we add explicit policies)
ALTER VIEW admin_user_stats SET (security_barrier = true);
ALTER VIEW admin_project_stats SET (security_barrier = true);
ALTER VIEW admin_revenue_stats SET (security_barrier = true);
ALTER VIEW admin_users_list SET (security_barrier = true);
ALTER VIEW admin_projects_list SET (security_barrier = true);

-- Grant access to authenticated users (RLS will filter based on is_admin)
GRANT SELECT ON admin_user_stats TO authenticated;
GRANT SELECT ON admin_project_stats TO authenticated;
GRANT SELECT ON admin_revenue_stats TO authenticated;
GRANT SELECT ON admin_users_list TO authenticated;
GRANT SELECT ON admin_projects_list TO authenticated;
