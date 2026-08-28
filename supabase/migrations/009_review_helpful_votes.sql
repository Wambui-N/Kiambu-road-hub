-- =============================================================================
-- Kiambu Road Explorer — Migration 009
-- "Helpful" upvotes on reviews (anonymous, deduped by IP hash)
-- Run AFTER 008_price_catalog_seed.sql
-- =============================================================================

-- ─── 1. helpful_count on reviews ──────────────────────────────────────────────

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_count integer NOT NULL DEFAULT 0;

-- ─── 2. review_votes — one row per (review, voter) to prevent duplicate votes ─

CREATE TABLE IF NOT EXISTS review_votes (
  id         uuid primary key default gen_random_uuid(),
  review_id  uuid not null references reviews(id) on delete cascade,
  ip_hash    text not null,
  created_at timestamptz not null default now(),
  unique (review_id, ip_hash)
);

CREATE INDEX IF NOT EXISTS idx_review_votes_review ON review_votes(review_id);

ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public submit review_vote" ON review_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all review_votes"    ON review_votes FOR ALL    USING (is_admin());

-- ─── 3. Atomic increment function (avoids read-modify-write races) ───────────

CREATE OR REPLACE FUNCTION increment_review_helpful(p_review_id uuid)
RETURNS integer LANGUAGE sql AS $$
  UPDATE reviews SET helpful_count = helpful_count + 1
  WHERE id = p_review_id
  RETURNING helpful_count;
$$;
