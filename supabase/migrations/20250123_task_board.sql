-- Create task_boards table
create table if not exists task_boards (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references projects(id) on delete cascade not null unique,
    name text not null default 'Task Board',
    created_at timestamp with time zone default now()
);

-- Create task_lists table
create table if not exists task_lists (
    id uuid default gen_random_uuid() primary key,
    board_id uuid references task_boards(id) on delete cascade not null,
    name text not null,
    position integer not null,
    created_at timestamp with time zone default now()
);

-- Create tasks table
create table if not exists tasks (
    id uuid default gen_random_uuid() primary key,
    list_id uuid references task_lists(id) on delete cascade not null,
    title text not null,
    description text,
    position integer not null,
    assigned_to uuid references auth.users(id) on delete set null,
    due_date date,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table task_boards enable row level security;
alter table task_lists enable row level security;
alter table tasks enable row level security;

-- RLS Policies for task_boards
create policy "Project members can view task boards"
    on task_boards for select
    using (
        exists (
            select 1 from projects
            where projects.id = task_boards.project_id
            and (
                projects.user_id = auth.uid()
                or exists (
                    select 1 from project_members
                    where project_members.project_id = projects.id
                    and project_members.user_id = auth.uid()
                    and project_members.status = 'accepted'
                )
            )
        )
    );

create policy "Project owners can insert task boards"
    on task_boards for insert
    with check (
        exists (
            select 1 from projects
            where projects.id = task_boards.project_id
            and projects.user_id = auth.uid()
        )
    );

-- RLS Policies for task_lists
create policy "Project members can view task lists"
    on task_lists for select
    using (
        exists (
            select 1 from task_boards
            join projects on projects.id = task_boards.project_id
            where task_boards.id = task_lists.board_id
            and (
                projects.user_id = auth.uid()
                or exists (
                    select 1 from project_members
                    where project_members.project_id = projects.id
                    and project_members.user_id = auth.uid()
                    and project_members.status = 'accepted'
                )
            )
        )
    );

create policy "Project members can insert task lists"
    on task_lists for insert
    with check (
        exists (
            select 1 from task_boards
            join projects on projects.id = task_boards.project_id
            where task_boards.id = task_lists.board_id
            and (
                projects.user_id = auth.uid()
                or exists (
                    select 1 from project_members
                    where project_members.project_id = projects.id
                    and project_members.user_id = auth.uid()
                    and project_members.status = 'accepted'
                )
            )
        )
    );

create policy "Project members can update task lists"
    on task_lists for update
    using (
        exists (
            select 1 from task_boards
            join projects on projects.id = task_boards.project_id
            where task_boards.id = task_lists.board_id
            and (
                projects.user_id = auth.uid()
                or exists (
                    select 1 from project_members
                    where project_members.project_id = projects.id
                    and project_members.user_id = auth.uid()
                    and project_members.status = 'accepted'
                )
            )
        )
    );

create policy "Project members can delete task lists"
    on task_lists for delete
    using (
        exists (
            select 1 from task_boards
            join projects on projects.id = task_boards.project_id
            where task_boards.id = task_lists.board_id
            and (
                projects.user_id = auth.uid()
                or exists (
                    select 1 from project_members
                    where project_members.project_id = projects.id
                    and project_members.user_id = auth.uid()
                    and project_members.status = 'accepted'
                )
            )
        )
    );

-- RLS Policies for tasks
create policy "Project members can view tasks"
    on tasks for select
    using (
        exists (
            select 1 from task_lists
            join task_boards on task_boards.id = task_lists.board_id
            join projects on projects.id = task_boards.project_id
            where task_lists.id = tasks.list_id
            and (
                projects.user_id = auth.uid()
                or exists (
                    select 1 from project_members
                    where project_members.project_id = projects.id
                    and project_members.user_id = auth.uid()
                    and project_members.status = 'accepted'
                )
            )
        )
    );

create policy "Project members can insert tasks"
    on tasks for insert
    with check (
        exists (
            select 1 from task_lists
            join task_boards on task_boards.id = task_lists.board_id
            join projects on projects.id = task_boards.project_id
            where task_lists.id = tasks.list_id
            and (
                projects.user_id = auth.uid()
                or exists (
                    select 1 from project_members
                    where project_members.project_id = projects.id
                    and project_members.user_id = auth.uid()
                    and project_members.status = 'accepted'
                )
            )
        )
    );

create policy "Project members can update tasks"
    on tasks for update
    using (
        exists (
            select 1 from task_lists
            join task_boards on task_boards.id = task_lists.board_id
            join projects on projects.id = task_boards.project_id
            where task_lists.id = tasks.list_id
            and (
                projects.user_id = auth.uid()
                or exists (
                    select 1 from project_members
                    where project_members.project_id = projects.id
                    and project_members.user_id = auth.uid()
                    and project_members.status = 'accepted'
                )
            )
        )
    );

create policy "Project members can delete tasks"
    on tasks for delete
    using (
        exists (
            select 1 from task_lists
            join task_boards on task_boards.id = task_lists.board_id
            join projects on projects.id = task_boards.project_id
            where task_lists.id = tasks.list_id
            and (
                projects.user_id = auth.uid()
                or exists (
                    select 1 from project_members
                    where project_members.project_id = projects.id
                    and project_members.user_id = auth.uid()
                    and project_members.status = 'accepted'
                )
            )
        )
    );

-- Indexes for performance
create index idx_task_boards_project_id on task_boards(project_id);
create index idx_task_lists_board_id on task_lists(board_id);
create index idx_tasks_list_id on tasks(list_id);
create index idx_tasks_assigned_to on tasks(assigned_to);

-- Trigger for updated_at
create trigger set_tasks_updated_at
    before update on tasks
    for each row
    execute function handle_updated_at();
