-- =============================================================================
-- Kiambu Road Explorer — Outbound Click Tracking
-- =============================================================================

CREATE TABLE IF NOT EXISTS outbound_clicks (
  id              uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     uuid         REFERENCES businesses(id) ON DELETE SET NULL,
  ad_slot_id      uuid         REFERENCES ad_slots(id)   ON DELETE SET NULL,
  destination_url text         NOT NULL,
  link_type       text         NOT NULL CHECK (link_type IN ('website', 'whatsapp', 'phone', 'email', 'maps', 'ad')),
  surface         text         NOT NULL,
  page_path       text,
  category_slug   text,
  business_slug   text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_content     text,
  referrer        text,
  user_agent      text,
  ip_hash         text,
  created_at      timestamptz  NOT NULL DEFAULT now()
);

-- Indexes for admin reporting queries
CREATE INDEX IF NOT EXISTS idx_oc_business_slug ON outbound_clicks(business_slug);
CREATE INDEX IF NOT EXISTS idx_oc_created_at    ON outbound_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_oc_surface       ON outbound_clicks(surface);
CREATE INDEX IF NOT EXISTS idx_oc_link_type     ON outbound_clicks(link_type);

-- Enable RLS
ALTER TABLE outbound_clicks ENABLE ROW LEVEL SECURITY;

-- Only admins can read
CREATE POLICY "Admin read outbound clicks"
  ON outbound_clicks FOR SELECT
  USING ((SELECT is_admin()));

-- Public (anon / service role from API route) can insert
CREATE POLICY "Allow click logging"
  ON outbound_clicks FOR INSERT
  WITH CHECK (true);
