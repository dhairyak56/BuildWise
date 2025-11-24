-- Storage bucket 'documents' already exists
-- Just set up RLS policies for documents bucket

-- Drop existing policies if they exist
drop policy if exists "Users can upload documents" on storage.objects;
drop policy if exists "Users can view their own documents" on storage.objects;
drop policy if exists "Users can update their own documents" on storage.objects;
drop policy if exists "Users can delete their own documents" on storage.objects;

-- Create policies
create policy "Users can upload documents"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'documents' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can view their own documents"
on storage.objects for select
to authenticated
using (
  bucket_id = 'documents' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own documents"
on storage.objects for update
to authenticated
using (
  bucket_id = 'documents' and
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own documents"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'documents' and
  auth.uid()::text = (storage.foldername(name))[1]
);
