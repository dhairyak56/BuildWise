-- Create a view to easily fetch tasks with their project details
CREATE OR REPLACE VIEW user_tasks WITH (security_invoker=on) AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.status,
    t.due_date,
    t.created_at,
    t.assigned_to,
    t.project_id,
    p.name as project_name
FROM tasks t
JOIN projects p ON t.project_id = p.id;

-- Fix notifications type check constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('deadline', 'contract', 'payment', 'project', 'task', 'document'));

-- Reload schema cache
NOTIFY pgrst, 'reload config';
