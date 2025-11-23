-- Create project_members table
create table if not exists project_members (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references projects(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade, -- Nullable for pending invites
    email text not null,
    role text not null check (role in ('owner', 'editor', 'viewer')),
    status text not null check (status in ('pending', 'accepted')) default 'pending',
    invited_at timestamp with time zone default now(),
    accepted_at timestamp with time zone,
    
    -- Ensure unique email per project
    unique(project_id, email)
);

-- Enable RLS
alter table project_members enable row level security;

-- Policies for project_members

-- 1. Project owners can view all members
create policy "Project owners can view members"
    on project_members for select
    using (
        exists (
            select 1 from projects
            where projects.id = project_members.project_id
            and projects.user_id = auth.uid()
        )
    );

-- 2. Project owners can insert members
create policy "Project owners can invite members"
    on project_members for insert
    with check (
        exists (
            select 1 from projects
            where projects.id = project_members.project_id
            and projects.user_id = auth.uid()
        )
    );

-- 3. Project owners can update members
create policy "Project owners can update members"
    on project_members for update
    using (
        exists (
            select 1 from projects
            where projects.id = project_members.project_id
            and projects.user_id = auth.uid()
        )
    );

-- 4. Project owners can delete members
create policy "Project owners can delete members"
    on project_members for delete
    using (
        exists (
            select 1 from projects
            where projects.id = project_members.project_id
            and projects.user_id = auth.uid()
        )
    );

-- 5. Members can view themselves and other members of the same project
create policy "Members can view team"
    on project_members for select
    using (
        user_id = auth.uid() -- View self
        or
        exists ( -- View others if I am a member of the project
            select 1 from project_members as pm
            where pm.project_id = project_members.project_id
            and pm.user_id = auth.uid()
            and pm.status = 'accepted'
        )
    );

-- Update Projects Table Policies (Assuming 'projects' exists)

-- Allow members to view projects they belong to
create policy "Members can view projects"
    on projects for select
    using (
        exists (
            select 1 from project_members
            where project_members.project_id = projects.id
            and project_members.user_id = auth.uid()
            and project_members.status = 'accepted'
        )
    );

-- Allow Editors to update projects (but not delete)
create policy "Editors can update projects"
    on projects for update
    using (
        exists (
            select 1 from project_members
            where project_members.project_id = projects.id
            and project_members.user_id = auth.uid()
            and project_members.role = 'editor'
            and project_members.status = 'accepted'
        )
    );
