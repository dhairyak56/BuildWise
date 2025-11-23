-- Create audit_logs table
create table if not exists audit_logs (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references projects(id) on delete set null,
    user_id uuid references auth.users(id) on delete set null,
    action text not null,
    details jsonb default '{}'::jsonb,
    ip_address text,
    created_at timestamp with time zone default now()
);

-- Enable RLS
alter table audit_logs enable row level security;

-- Policies

-- 1. Authenticated users can insert logs (for their own actions)
create policy "Users can insert audit logs"
    on audit_logs for insert
    with check (auth.uid() = user_id);

-- 2. Project owners can view logs for their projects
create policy "Project owners can view audit logs"
    on audit_logs for select
    using (
        exists (
            select 1 from projects
            where projects.id = audit_logs.project_id
            and projects.user_id = auth.uid()
        )
    );

-- 3. Users can view their own logs (optional, but good for transparency)
create policy "Users can view their own logs"
    on audit_logs for select
    using (auth.uid() = user_id);

-- Indexes for performance
create index idx_audit_logs_project_id on audit_logs(project_id);
create index idx_audit_logs_user_id on audit_logs(user_id);
create index idx_audit_logs_created_at on audit_logs(created_at desc);
