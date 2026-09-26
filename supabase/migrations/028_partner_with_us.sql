-- =============================================================================
-- Kiambu Road Explorer — Migration 028
-- "Partner With Us" page: a general partnership enquiry form, plus a donation
-- pledge form. No payment gateway is wired up (same approach as store_orders
-- in migration 024) — a pledge just records the donor's intent as
-- 'pending_payment' and is followed up manually by an admin.
-- Run AFTER 027_community_programmes.sql
-- =============================================================================

CREATE TABLE partner_inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text,
  status     text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

CREATE TABLE donation_pledges (
  id                     uuid primary key default gen_random_uuid(),
  donor_name             text not null,
  email                  text not null,
  phone                  text,
  amount                 numeric(10, 2) not null,
  currency               text not null default 'KES',
  frequency              text not null check (frequency in ('one_time', 'weekly', 'monthly', 'annual')),
  project                text,
  additional_instructions text,
  status                 text not null default 'pending_payment' check (status in ('pending_payment', 'received', 'cancelled')),
  created_at             timestamptz not null default now()
);

CREATE INDEX idx_partner_inquiries_created ON partner_inquiries(created_at desc);
CREATE INDEX idx_donation_pledges_created ON donation_pledges(created_at desc);

ALTER TABLE partner_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_pledges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public submit partner_inquiries" ON partner_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all partner_inquiries" ON partner_inquiries FOR ALL USING (is_admin());

CREATE POLICY "Public submit donation_pledges" ON donation_pledges FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all donation_pledges" ON donation_pledges FOR ALL USING (is_admin());
