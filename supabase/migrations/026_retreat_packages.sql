-- =============================================================================
-- Kiambu Road Explorer — Migration 026
-- Kiambu Retreats (journal_sections.slug='kiambu-here-n-there') becomes
-- bookable retreat packages with a public booking-inquiry form.
-- Run AFTER 025_agency_services.sql
-- =============================================================================

CREATE TABLE retreat_packages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  price         numeric(10, 2),
  currency      text not null default 'KES',
  duration_note text,
  image_path    text,
  status        content_status not null default 'draft',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

CREATE TABLE retreat_inquiries (
  id              uuid primary key default gen_random_uuid(),
  package_id      uuid references retreat_packages(id) on delete set null,
  name            text not null,
  email           text not null,
  phone           text not null,
  preferred_dates text,
  people_count    integer,
  message         text,
  status          text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at      timestamptz not null default now()
);

CREATE INDEX idx_retreat_packages_status ON retreat_packages(status, sort_order);
CREATE INDEX idx_retreat_inquiries_created ON retreat_inquiries(created_at desc);

ALTER TABLE retreat_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE retreat_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read retreat_packages" ON retreat_packages FOR SELECT USING (status = 'published');
CREATE POLICY "Admin all retreat_packages" ON retreat_packages FOR ALL USING (is_admin());

CREATE POLICY "Public submit retreat_inquiries" ON retreat_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all retreat_inquiries" ON retreat_inquiries FOR ALL USING (is_admin());
