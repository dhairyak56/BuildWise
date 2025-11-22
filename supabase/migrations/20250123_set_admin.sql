-- Set admin flag for initial admin user
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'dhairyakandhari18@gmail.com';
