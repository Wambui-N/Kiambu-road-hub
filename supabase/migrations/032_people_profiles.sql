-- =============================================================================
-- Kiambu Road Explorer — Migration 032
-- People of Kiambu Road becomes a real admin-manageable listing at /people,
-- replacing the static "Coming Soon" stub. No profiles are seeded yet (the
-- client has intro copy but no profiles drafted) — the public page shows the
-- real intro copy with a graceful "first story coming soon" empty state
-- instead of the generic placeholder.
-- Run AFTER 031_events.sql
-- =============================================================================

CREATE TABLE people_profiles (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  role_connection text,
  photo_path      text,
  story           text,
  featured_month  text,
  status          content_status not null default 'draft',
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

CREATE TABLE people_story_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text,
  status     text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

CREATE INDEX idx_people_profiles_status ON people_profiles(status, sort_order);
CREATE INDEX idx_people_story_submissions_created ON people_story_submissions(created_at desc);

ALTER TABLE people_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE people_story_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read people_profiles" ON people_profiles FOR SELECT USING (status = 'published');
CREATE POLICY "Admin all people_profiles" ON people_profiles FOR ALL USING (is_admin());

CREATE POLICY "Public submit people_story_submissions" ON people_story_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all people_story_submissions" ON people_story_submissions FOR ALL USING (is_admin());
