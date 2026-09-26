-- =============================================================================
-- Kiambu Road Explorer — Migration 025
-- Business Agency (journal_sections.slug='business-notes') becomes a mini
-- directory of the Explorer's own services, with a public enquiry form.
-- Run AFTER 024_store_products.sql
-- =============================================================================

CREATE TABLE agency_services (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  price_note  text,
  image_path  text,
  status      content_status not null default 'draft',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

CREATE TABLE agency_service_inquiries (
  id         uuid primary key default gen_random_uuid(),
  service_id uuid references agency_services(id) on delete set null,
  name       text not null,
  email      text not null,
  phone      text not null,
  message    text,
  status     text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

CREATE INDEX idx_agency_services_status ON agency_services(status, sort_order);
CREATE INDEX idx_agency_service_inquiries_created ON agency_service_inquiries(created_at desc);

ALTER TABLE agency_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_service_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read agency_services" ON agency_services FOR SELECT USING (status = 'published');
CREATE POLICY "Admin all agency_services" ON agency_services FOR ALL USING (is_admin());

CREATE POLICY "Public submit agency_service_inquiries" ON agency_service_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all agency_service_inquiries" ON agency_service_inquiries FOR ALL USING (is_admin());
