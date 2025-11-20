-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  primary key (id)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  client_name text,
  address text,
  job_type text,
  status text default 'Active', -- Active, Completed, On Hold
  progress integer default 0,
  contract_value numeric,
  start_date date,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;

create policy "Users can view their own projects."
  on projects for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own projects."
  on projects for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own projects."
  on projects for update
  using ( auth.uid() = user_id );

-- Create contracts table
create table public.contracts (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  content jsonb, -- Stores the contract data structure
  status text default 'Draft', -- Draft, Generated, Sent, Signed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contracts enable row level security;

create policy "Users can view contracts for their projects."
  on contracts for select
  using ( exists (
    select 1 from projects
    where projects.id = contracts.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can insert contracts for their projects."
  on contracts for insert
  with check ( exists (
    select 1 from projects
    where projects.id = contracts.project_id
    and projects.user_id = auth.uid()
  ));

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
