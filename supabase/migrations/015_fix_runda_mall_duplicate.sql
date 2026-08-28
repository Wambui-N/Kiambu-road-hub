-- =============================================================================
-- Kiambu Road Explorer — Migration 015
-- Fix: 014's "Runda Mall" INSERT hit ON CONFLICT (slug) DO NOTHING because a
-- pre-existing business row (imported earlier via the Apify scrape) already
-- has slug 'runda-mall' — same phone number, confirming it's the same place.
-- The tenant INSERT in 014 still attached correctly via that slug; only the
-- richer profile fields were silently dropped. Backfill them here, touching
-- only currently-empty fields so we don't clobber the existing Google
-- Places-sourced phone/website/maps/hours data.
-- Run AFTER 014_seed_malls.sql
-- =============================================================================

UPDATE businesses
SET
  road_street = COALESCE(road_street, 'Kiambu Road'),
  short_description = COALESCE(short_description, 'Modern shopping mall on Kiambu Road in Runda with a Carrefour anchor, retail stores, restaurants and an artisan market area.'),
  description = COALESCE(description, 'Modern shopping mall on Kiambu Road in Runda with a Carrefour anchor, retail stores, restaurants, a kids'' zone, and a VR/gaming attraction.'),
  mall_quick_facts = COALESCE(mall_quick_facts, jsonb_build_object('parking', 'Yes — ample parking with highway access', 'supermarket', 'Carrefour', 'play_area', 'Yes — kids zone', 'restaurants', '8+'))
WHERE slug = 'runda-mall';
