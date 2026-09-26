-- =============================================================================
-- Kiambu Road Explorer — Migration 027
-- Community Programmes (journal_sections.slug='business-opportunities')
-- becomes a programme directory with a public sign-up form.
-- Run AFTER 026_retreat_packages.sql
-- =============================================================================

CREATE TABLE community_programmes (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  schedule_note text,
  image_path    text,
  status        content_status not null default 'draft',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

CREATE TABLE programme_signups (
  id            uuid primary key default gen_random_uuid(),
  programme_id  uuid references community_programmes(id) on delete set null,
  name          text not null,
  email         text not null,
  phone         text not null,
  message       text,
  status        text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at    timestamptz not null default now()
);

CREATE INDEX idx_community_programmes_status ON community_programmes(status, sort_order);
CREATE INDEX idx_programme_signups_created ON programme_signups(created_at desc);

ALTER TABLE community_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE programme_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read community_programmes" ON community_programmes FOR SELECT USING (status = 'published');
CREATE POLICY "Admin all community_programmes" ON community_programmes FOR ALL USING (is_admin());

CREATE POLICY "Public submit programme_signups" ON programme_signups FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all programme_signups" ON programme_signups FOR ALL USING (is_admin());
