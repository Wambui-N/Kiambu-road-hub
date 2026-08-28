-- =============================================================================
-- Kiambu Road Explorer — Migration 013
-- Mall "hub profile" data model: richer Quick Facts (key/value, not just
-- boolean tags) and an "Inside the Mall" tenant directory grouped by
-- eat / shop / services / entertainment.
-- Run AFTER 012_aspect_ratings.sql
-- =============================================================================

-- ─── 1. Richer quick facts for malls (and any other business, if useful later)
-- jsonb key/value so values like "Multiple" or "3 (KCB, Equity, NCBA)" work,
-- not just the boolean tag checklist used elsewhere.

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS mall_quick_facts jsonb;

-- ─── 2. Tenant directory ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mall_tenants (
  id                 uuid primary key default gen_random_uuid(),
  mall_id            uuid not null references businesses(id) on delete cascade,
  name               text not null,
  category           text not null check (category in ('eat', 'shop', 'services', 'entertainment')),
  linked_business_id uuid references businesses(id) on delete set null,
  sort_order         integer not null default 0
);

CREATE INDEX IF NOT EXISTS idx_mall_tenants_mall ON mall_tenants(mall_id, category, sort_order);

ALTER TABLE mall_tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read mall_tenants" ON mall_tenants FOR SELECT USING (true);
CREATE POLICY "Admin all mall_tenants"   ON mall_tenants FOR ALL    USING (is_admin());

-- ─── 3. New areas needed by the mall batch (Gigiri, Muthaiga North, Edenville)
-- — legitimate distinct locations along the corridor, already referenced
-- elsewhere in site content (e.g. the Emergency Contacts page).

INSERT INTO areas (name, slug, sort_order)
VALUES
  ('Gigiri',        'gigiri',         11),
  ('Muthaiga North', 'muthaiga-north', 12),
  ('Edenville',      'edenville',      13)
ON CONFLICT (slug) DO NOTHING;
