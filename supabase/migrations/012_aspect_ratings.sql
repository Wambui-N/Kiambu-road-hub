-- =============================================================================
-- Kiambu Road Explorer — Migration 012
-- Aspect-based ratings: reviews can rate several category-specific aspects
-- (e.g. cleanliness, value, parking) which are averaged into the overall
-- rating. aspect_ratings is nullable — categories with no defined aspect set
-- keep using a plain overall star rating with no behaviour change.
-- Run AFTER 011_quick_fact_and_medical_tags.sql
-- =============================================================================

-- rating was `int check (rating between 1 and 5)` — widen to hold averages
-- like 4.2 while keeping the same 1-5 bounds.
ALTER TABLE reviews ALTER COLUMN rating TYPE numeric(2,1) USING rating::numeric(2,1);
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_rating_check;
ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS aspect_ratings jsonb;
