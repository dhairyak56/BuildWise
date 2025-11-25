-- Seed data for verifying project management features
-- This version selects the first user from auth.users to avoid null user_id error

INSERT INTO projects (
    name, 
    client_name, 
    status, 
    job_type, 
    address, 
    start_date, 
    end_date, 
    contract_value, 
    user_id
) 
SELECT 
    'PM Feature Test Project',
    'Test Client',
    'Active',
    'Residential Construction',
    '123 Test St',
    NOW(),
    NOW() + INTERVAL '6 months',
    500000,
    (SELECT id FROM auth.users LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM projects WHERE name = 'PM Feature Test Project'
);
