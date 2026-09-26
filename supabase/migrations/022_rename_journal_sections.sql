-- =============================================================================
-- Kiambu Road Explorer — Migration 022
-- Reposition several journal sections with magazine-style names. Slugs are
-- left unchanged (they're canonical URLs referenced by sitemap.ts and each
-- section page's alternates.canonical) — only the display `name` changes.
-- The admin article editor (app/admin/articles/*) reads journal_sections.name
-- live from the DB for its section picker, so this must run to stay in sync
-- with the renamed labels in data/seed/categories.ts and
-- components/layout/sectors-sidebar.tsx.
-- Run AFTER 021_archive_property_construction.sql
-- =============================================================================

UPDATE journal_sections SET name = 'Business Agency'       WHERE slug = 'business-notes';
UPDATE journal_sections SET name = 'Sponsored Features'    WHERE slug = 'nature-trivia';
UPDATE journal_sections SET name = 'Lifestyle Blog'        WHERE slug = 'this-n-that';
UPDATE journal_sections SET name = 'Explorer Merchandise'  WHERE slug = 'opinion';
UPDATE journal_sections SET name = 'Kiambu Retreats'       WHERE slug = 'kiambu-here-n-there';
UPDATE journal_sections SET name = 'Community Programmes' WHERE slug = 'business-opportunities';
