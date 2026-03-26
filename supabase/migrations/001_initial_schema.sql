-- =============================================================================
-- Kiambu Road Explorer — Initial Schema
-- =============================================================================
-- Run this in your Supabase SQL editor to set up the full database schema.
-- Always run in a new project before adding any data.
-- =============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =============================================================================
-- ENUMS
-- =============================================================================

create type content_status as enum ('draft', 'review', 'published', 'archived');
create type verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type job_type as enum ('full_time', 'part_time', 'contract', 'internship');
create type price_category as enum ('groceries', 'fuel', 'medical', 'dining');
create type submission_status as enum ('new', 'in_review', 'approved', 'rejected');
create type admin_role as enum ('super_admin', 'editor', 'data_entry', 'support');
create type price_range as enum ('$', '$$', '$$$', '$$$$');
create type subscriber_status as enum ('active', 'unsubscribed');
create type message_status as enum ('new', 'read', 'replied', 'responded', 'closed');

-- =============================================================================
-- REFERENCE TABLES
-- =============================================================================

create table areas (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  integer not null default 0
);

create table categories (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  icon             text,
  color            text,
  description      text,
  cover_image_path text,
  sort_order       integer not null default 0,
  status           content_status not null default 'published'
);

create table subcategories (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name        text not null,
  slug        text not null,
  icon        text,
  description text,
  sort_order  integer not null default 0,
  status      content_status not null default 'published',
  unique (category_id, slug)
);

create table tags (
  id       uuid primary key default gen_random_uuid(),
  name     text not null unique,
  slug     text not null unique,
  tag_type text
);

create table journal_sections (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  tagline     text,
  description text,
  sort_order  integer not null default 0,
  status      content_status not null default 'published'
);

-- =============================================================================
-- DIRECTORY TABLES
-- =============================================================================

create table businesses (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  slug                text not null unique,
  category_id         uuid references categories(id) on delete set null,
  subcategory_id      uuid references subcategories(id) on delete set null,
  area_id             uuid references areas(id) on delete set null,
  address_line        text,
  short_description   text,
  description         text,
  phone               text,
  whatsapp            text,
  email               text,
  website             text,
  google_maps_url     text,
  latitude            numeric(10, 7),
  longitude           numeric(10, 7),
  opening_hours_text  text,
  price_range         price_range,
  google_rating       numeric(3, 1) check (google_rating >= 0 and google_rating <= 5),
  google_review_count integer,
  featured            boolean not null default false,
  verified            boolean not null default false,
  is_sponsor          boolean not null default false,
  status              content_status not null default 'draft',
  verification_status verification_status not null default 'unverified',
  source_url          text,
  last_verified_at    timestamptz,
  published_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid references auth.users(id) on delete set null,
  updated_by          uuid references auth.users(id) on delete set null
);

create table business_images (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  image_path  text not null,
  alt_text    text,
  caption     text,
  is_cover    boolean not null default false,
  sort_order  integer not null default 0
);

create table business_hours (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  day_of_week smallint not null check (day_of_week >= 0 and day_of_week <= 6),
  opens_at    time,
  closes_at   time,
  is_closed   boolean not null default false,
  unique (business_id, day_of_week)
);

create table business_tags (
  business_id uuid not null references businesses(id) on delete cascade,
  tag_id      uuid not null references tags(id) on delete cascade,
  primary key (business_id, tag_id)
);

-- =============================================================================
-- EDITORIAL TABLES
-- =============================================================================

create table articles (
  id               uuid primary key default gen_random_uuid(),
  section_id       uuid references journal_sections(id) on delete set null,
  title            text not null,
  slug             text not null unique,
  excerpt          text,
  body_json        jsonb,
  cover_image_path text,
  author_name      text,
  read_time_minutes integer,
  featured         boolean not null default false,
  status           content_status not null default 'draft',
  published_at     timestamptz,
  seo_title        text,
  seo_description  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid references auth.users(id) on delete set null,
  updated_by       uuid references auth.users(id) on delete set null
);

create table article_tags (
  article_id uuid not null references articles(id) on delete cascade,
  tag_id     uuid not null references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- =============================================================================
-- UTILITY TABLES
-- =============================================================================

create table job_listings (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  company       text,
  area_id       uuid references areas(id) on delete set null,
  location_text text,
  job_type      job_type,
  description   text,
  salary_text   text,
  deadline      date,
  contact_email text,
  contact_phone text,
  status        content_status not null default 'draft',
  published_at  timestamptz,
  created_at    timestamptz not null default now()
);

create table price_items (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  slug     text not null unique,
  category price_category,
  unit     text,
  status   content_status not null default 'published'
);

create table price_entries (
  id                  uuid primary key default gen_random_uuid(),
  price_item_id       uuid not null references price_items(id) on delete cascade,
  business_id         uuid references businesses(id) on delete set null,
  store_name_snapshot text not null,
  amount              numeric(10, 2) not null,
  currency            text not null default 'KES',
  observed_at         date not null,
  source_note         text,
  status              content_status not null default 'published'
);

create table newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  status        subscriber_status not null default 'active',
  subscribed_at timestamptz not null default now()
);

create table business_submissions (
  id                 uuid primary key default gen_random_uuid(),
  business_name      text not null,
  category_name      text,
  subcategory_name   text,
  location_text      text,
  phone              text,
  whatsapp           text,
  email              text,
  website            text,
  description        text,
  opening_hours_text text,
  price_range        text,
  source_note        text,
  status             submission_status not null default 'new',
  submitted_at       timestamptz not null default now(),
  reviewed_at        timestamptz,
  reviewed_by        uuid references auth.users(id) on delete set null
);

create table travel_inquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text,
  travel_type  text,
  travel_dates text,
  people_count integer,
  budget_range text,
  message      text,
  status       message_status not null default 'new',
  created_at   timestamptz not null default now()
);

create table contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text not null,
  status     message_status not null default 'new',
  created_at timestamptz not null default now()
);

-- =============================================================================
-- PLATFORM / ADMIN TABLES
-- =============================================================================

create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_path text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table admin_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role    admin_role not null default 'editor',
  primary key (user_id)
);

create table audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action        text not null,
  entity_type   text not null,
  entity_id     uuid,
  summary       text,
  created_at    timestamptz not null default now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

create index idx_businesses_category on businesses(category_id, status);
create index idx_businesses_subcategory on businesses(subcategory_id, status);
create index idx_businesses_area on businesses(area_id, status);
create index idx_businesses_status on businesses(status);
create index idx_businesses_featured on businesses(featured, verified, is_sponsor) where status = 'published';
create index idx_businesses_slug on businesses(slug);
create index idx_articles_section on articles(section_id, status, published_at desc);
create index idx_articles_slug on articles(slug);
create index idx_job_listings_status on job_listings(status, deadline);
create index idx_price_entries_item on price_entries(price_item_id, observed_at desc);
create index idx_business_submissions_status on business_submissions(status, submitted_at desc);

-- Full-text search index on businesses
create index idx_businesses_fts on businesses
  using gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(short_description, '') || ' ' || coalesce(description, '')));

-- =============================================================================
-- TRIGGERS — auto-update updated_at
-- =============================================================================

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_businesses_updated_at
  before update on businesses
  for each row execute function update_updated_at();

create trigger trg_articles_updated_at
  before update on articles
  for each row execute function update_updated_at();

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- Auto-create profile on sign-up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
alter table areas enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table tags enable row level security;
alter table journal_sections enable row level security;
alter table businesses enable row level security;
alter table business_images enable row level security;
alter table business_hours enable row level security;
alter table business_tags enable row level security;
alter table articles enable row level security;
alter table article_tags enable row level security;
alter table job_listings enable row level security;
alter table price_items enable row level security;
alter table price_entries enable row level security;
alter table newsletter_subscribers enable row level security;
alter table business_submissions enable row level security;
alter table travel_inquiries enable row level security;
alter table contact_messages enable row level security;
alter table profiles enable row level security;
alter table admin_roles enable row level security;
alter table audit_logs enable row level security;

-- Helper: check if current user has an admin role
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from admin_roles
    where user_id = auth.uid()
  );
$$;

-- Public read policies (published content only)
create policy "Public read areas" on areas for select using (true);
create policy "Public read categories" on categories for select using (status = 'published');
create policy "Public read subcategories" on subcategories for select using (status = 'published');
create policy "Public read tags" on tags for select using (true);
create policy "Public read journal_sections" on journal_sections for select using (status = 'published');
create policy "Public read businesses" on businesses for select using (status = 'published');
create policy "Public read business_images" on business_images for select using (
  exists (select 1 from businesses b where b.id = business_id and b.status = 'published')
);
create policy "Public read business_hours" on business_hours for select using (
  exists (select 1 from businesses b where b.id = business_id and b.status = 'published')
);
create policy "Public read business_tags" on business_tags for select using (true);
create policy "Public read articles" on articles for select using (status = 'published');
create policy "Public read article_tags" on article_tags for select using (true);
create policy "Public read job_listings" on job_listings for select using (status = 'published');
create policy "Public read price_items" on price_items for select using (status = 'published');
create policy "Public read price_entries" on price_entries for select using (status = 'published');

-- Public insert (submissions / forms)
create policy "Public subscribe newsletter" on newsletter_subscribers for insert with check (true);
create policy "Public submit business" on business_submissions for insert with check (true);
create policy "Public submit travel inquiry" on travel_inquiries for insert with check (true);
create policy "Public submit contact" on contact_messages for insert with check (true);

-- Admin full access
create policy "Admin all areas" on areas for all using (is_admin());
create policy "Admin all categories" on categories for all using (is_admin());
create policy "Admin all subcategories" on subcategories for all using (is_admin());
create policy "Admin all tags" on tags for all using (is_admin());
create policy "Admin all journal_sections" on journal_sections for all using (is_admin());
create policy "Admin all businesses" on businesses for all using (is_admin());
create policy "Admin all business_images" on business_images for all using (is_admin());
create policy "Admin all business_hours" on business_hours for all using (is_admin());
create policy "Admin all business_tags" on business_tags for all using (is_admin());
create policy "Admin all articles" on articles for all using (is_admin());
create policy "Admin all article_tags" on article_tags for all using (is_admin());
create policy "Admin all job_listings" on job_listings for all using (is_admin());
create policy "Admin all price_items" on price_items for all using (is_admin());
create policy "Admin all price_entries" on price_entries for all using (is_admin());
create policy "Admin all newsletter" on newsletter_subscribers for all using (is_admin());
create policy "Admin all submissions" on business_submissions for all using (is_admin());
create policy "Admin all travel" on travel_inquiries for all using (is_admin());
create policy "Admin all contact" on contact_messages for all using (is_admin());
create policy "Admin all audit_logs" on audit_logs for all using (is_admin());
create policy "Admin all admin_roles" on admin_roles for all using (is_admin());

-- Profiles: user owns their own profile
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Admin all profiles" on profiles for all using (is_admin());

-- =============================================================================
-- STORAGE BUCKETS
-- (Run these after the schema — or create them in the Supabase dashboard)
-- =============================================================================
-- insert into storage.buckets (id, name, public) values ('business-media', 'business-media', true);
-- insert into storage.buckets (id, name, public) values ('article-media', 'article-media', true);
-- insert into storage.buckets (id, name, public) values ('brand-assets', 'brand-assets', true);
-- insert into storage.buckets (id, name, public) values ('submission-uploads', 'submission-uploads', false);
