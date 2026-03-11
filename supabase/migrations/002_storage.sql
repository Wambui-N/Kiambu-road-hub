-- =============================================================================
-- Kiambu Road Hub — Storage Buckets & Policies
-- =============================================================================
-- Run this after 001_initial_schema.sql in your Supabase SQL editor.
-- =============================================================================

-- Create storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('business-media', 'business-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('article-media', 'article-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('brand-assets', 'brand-assets', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('submission-uploads', 'submission-uploads', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- =============================================================================
-- STORAGE POLICIES
-- =============================================================================

-- business-media: public read, admin write/delete
create policy "Public read business media"
  on storage.objects for select
  using (bucket_id = 'business-media');

create policy "Admin insert business media"
  on storage.objects for insert
  with check (
    bucket_id = 'business-media'
    and (select is_admin())
  );

create policy "Admin update business media"
  on storage.objects for update
  using (
    bucket_id = 'business-media'
    and (select is_admin())
  );

create policy "Admin delete business media"
  on storage.objects for delete
  using (
    bucket_id = 'business-media'
    and (select is_admin())
  );

-- article-media: public read, admin write/delete
create policy "Public read article media"
  on storage.objects for select
  using (bucket_id = 'article-media');

create policy "Admin insert article media"
  on storage.objects for insert
  with check (
    bucket_id = 'article-media'
    and (select is_admin())
  );

create policy "Admin update article media"
  on storage.objects for update
  using (
    bucket_id = 'article-media'
    and (select is_admin())
  );

create policy "Admin delete article media"
  on storage.objects for delete
  using (
    bucket_id = 'article-media'
    and (select is_admin())
  );

-- brand-assets: public read, admin write/delete
create policy "Public read brand assets"
  on storage.objects for select
  using (bucket_id = 'brand-assets');

create policy "Admin insert brand assets"
  on storage.objects for insert
  with check (
    bucket_id = 'brand-assets'
    and (select is_admin())
  );

create policy "Admin delete brand assets"
  on storage.objects for delete
  using (
    bucket_id = 'brand-assets'
    and (select is_admin())
  );

-- submission-uploads: private, only admin can read/write
create policy "Admin read submission uploads"
  on storage.objects for select
  using (
    bucket_id = 'submission-uploads'
    and (select is_admin())
  );

create policy "Public insert submission uploads"
  on storage.objects for insert
  with check (bucket_id = 'submission-uploads');

create policy "Admin delete submission uploads"
  on storage.objects for delete
  using (
    bucket_id = 'submission-uploads'
    and (select is_admin())
  );
