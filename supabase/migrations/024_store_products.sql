-- =============================================================================
-- Kiambu Road Explorer — Migration 024
-- Explorer Merchandise (journal_sections.slug='opinion') and Explorer
-- Publications (slug='e-books') become a real storefront: one shared catalog
-- table discriminated by product_type, plus a guest-checkout orders table.
-- No payment gateway is wired up — orders land as 'pending_payment' and are
-- fulfilled manually by an admin (see 024's storage policies for signed-URL
-- ebook delivery).
-- Run AFTER 023_remove_doctor_consultations.sql
-- =============================================================================

CREATE TYPE product_type AS ENUM ('merchandise', 'ebook');
CREATE TYPE store_order_status AS ENUM ('pending_payment', 'paid', 'fulfilled', 'cancelled');

CREATE TABLE store_products (
  id                 uuid primary key default gen_random_uuid(),
  product_type       product_type not null,
  name               text not null,
  slug               text not null unique,
  description        text,
  price              numeric(10, 2) not null,
  currency           text not null default 'KES',
  image_path         text,
  digital_file_path  text,
  status             content_status not null default 'draft',
  sort_order         integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

CREATE TABLE store_orders (
  id               uuid primary key default gen_random_uuid(),
  customer_name    text not null,
  email            text not null,
  phone            text not null,
  delivery_address text,
  items            jsonb not null,
  total_amount     numeric(10, 2) not null,
  currency         text not null default 'KES',
  status           store_order_status not null default 'pending_payment',
  admin_notes      text,
  created_at       timestamptz not null default now()
);

CREATE INDEX idx_store_products_type_status ON store_products(product_type, status, sort_order);
CREATE INDEX idx_store_orders_status ON store_orders(status, created_at desc);

ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read store_products" ON store_products FOR SELECT USING (status = 'published');
CREATE POLICY "Admin all store_products" ON store_products FOR ALL USING (is_admin());

CREATE POLICY "Public submit store_orders" ON store_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all store_orders" ON store_orders FOR ALL USING (is_admin());

-- =============================================================================
-- STORAGE — shared across Workstreams 2-5 (agency services, retreat packages,
-- community programmes all reuse store-media for their own cover images)
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('store-media', 'store-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('ebook-files', 'ebook-files', false, 52428800, array['application/pdf', 'application/epub+zip'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read store media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'store-media');

CREATE POLICY "Admin insert store media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'store-media' AND (SELECT is_admin()));

CREATE POLICY "Admin update store media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'store-media' AND (SELECT is_admin()));

CREATE POLICY "Admin delete store media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'store-media' AND (SELECT is_admin()));

-- ebook-files: private. Admins upload/manage; downloads are only ever handed
-- out as short-lived signed URLs generated server-side by an admin, so there
-- is no public or customer-facing read policy at all.
CREATE POLICY "Admin read ebook files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ebook-files' AND (SELECT is_admin()));

CREATE POLICY "Admin insert ebook files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ebook-files' AND (SELECT is_admin()));

CREATE POLICY "Admin delete ebook files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ebook-files' AND (SELECT is_admin()));
