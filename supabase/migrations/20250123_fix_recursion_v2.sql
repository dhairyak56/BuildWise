-- Fix Infinite Recursion v2

-- 1. Create security definer function to check membership
-- This bypasses RLS on 'project_members' to avoid self-referencing loops
create or replace function is_project_member(_project_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from project_members
    where project_id = _project_id
    and user_id = auth.uid()
    and status = 'accepted'
  );
end;
$$;

-- 2. Update 'projects' policies to use the safe function
drop policy if exists "Members can view projects" on projects;

create policy "Members can view projects"
    on projects for select
    using ( is_project_member(id) );

drop policy if exists "Editors can update projects" on projects;

create policy "Editors can update projects"
    on projects for update
    using (
        exists (
            select 1 from project_members
            where project_id = id
            and user_id = auth.uid()
            and role = 'editor'
            and status = 'accepted'
        )
    );
-- Note: The editor update policy might still be risky if not careful, 
-- but let's fix the viewing recursion first. Ideally, we'd have an is_project_editor function too.

-- 3. Update 'project_members' policies to use the safe function
drop policy if exists "Members can view team" on project_members;

create policy "Members can view team"
    on project_members for select
    using (
        user_id = auth.uid() -- View self
        or
        is_project_member(project_id) -- View others if I am a member
    );
