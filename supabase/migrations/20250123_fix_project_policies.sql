-- Ensure RLS is enabled
alter table projects enable row level security;

-- Policy: Users can create their own projects
create policy "Users can create projects"
    on projects for insert
    with check (auth.uid() = user_id);

-- Policy: Users can view their own projects
create policy "Users can view own projects"
    on projects for select
    using (auth.uid() = user_id);

-- Policy: Users can update their own projects
create policy "Users can update own projects"
    on projects for update
    using (auth.uid() = user_id);

-- Policy: Users can delete their own projects
create policy "Users can delete own projects"
    on projects for delete
    using (auth.uid() = user_id);
