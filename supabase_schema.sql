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

-- Create documents table
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade, -- Optional: link to a project
  user_id uuid references auth.users not null,
  name text not null,
  file_path text not null, -- Path in Supabase Storage
  file_type text,
  size integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.documents enable row level security;

create policy "Users can view their own documents."
  on documents for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own documents."
  on documents for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own documents."
  on documents for delete
  using ( auth.uid() = user_id );

-- Create storage bucket for documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Storage policies
create policy "Authenticated users can upload documents"
  on storage.objects for insert
  with check ( bucket_id = 'documents' and auth.role() = 'authenticated' );

create policy "Users can view their own documents"
  on storage.objects for select
  using ( bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can delete their own documents"
  on storage.objects for delete
  using ( bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1] );

-- Create payments table
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  amount numeric not null,
  payment_date date not null,
  status text default 'Scheduled', -- Scheduled, Paid, Overdue
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments enable row level security;

create policy "Users can view payments for their projects."
  on payments for select
  using ( exists (
    select 1 from projects
    where projects.id = payments.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can insert payments for their projects."
  on payments for insert
  with check ( exists (
    select 1 from projects
    where projects.id = payments.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can update payments for their projects."
  on payments for update
  using ( exists (
    select 1 from projects
    where projects.id = payments.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can delete payments for their projects."
  on payments for delete
  using ( exists (
    select 1 from projects
    where projects.id = payments.project_id
    and projects.user_id = auth.uid()
  ));
-- Create contract_templates table
create table public.contract_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text, -- 'Residential', 'Commercial', 'Renovation', 'Subcontractor', etc.
  template_content text not null,
  is_default boolean default false,
  user_id uuid references auth.users, -- NULL for system templates
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contract_templates enable row level security;

create policy "Users can view all templates (system + their own)."
  on contract_templates for select
  using ( is_default = true OR auth.uid() = user_id );

create policy "Users can insert their own templates."
  on contract_templates for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own templates."
  on contract_templates for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own templates."
  on contract_templates for delete
  using ( auth.uid() = user_id );
