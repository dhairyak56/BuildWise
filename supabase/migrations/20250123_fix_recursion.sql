-- Fix Infinite Recursion in RLS Policies

-- 1. Create a security definer function to check project ownership
-- This bypasses RLS on the 'projects' table to avoid the recursion loop
create or replace function is_project_owner(_project_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from projects
    where id = _project_id
    and user_id = auth.uid()
  );
end;
$$;

-- 2. Drop existing policies on project_members that cause recursion
drop policy if exists "Project owners can view members" on project_members;
drop policy if exists "Project owners can invite members" on project_members;
drop policy if exists "Project owners can update members" on project_members;
drop policy if exists "Project owners can delete members" on project_members;

-- 3. Re-create policies using the helper function

-- Project owners can view all members
create policy "Project owners can view members"
    on project_members for select
    using ( is_project_owner(project_id) );

-- Project owners can insert members
create policy "Project owners can invite members"
    on project_members for insert
    with check ( is_project_owner(project_id) );

-- Project owners can update members
create policy "Project owners can update members"
    on project_members for update
    using ( is_project_owner(project_id) );

-- Project owners can delete members
create policy "Project owners can delete members"
    on project_members for delete
    using ( is_project_owner(project_id) );
