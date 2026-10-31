-- =============================================================================
-- Kiambu Road Explorer — Migration 034
-- Combines "Destination Beyond" into "Kiambu Retreats" per the client's
-- request — both were travel/discovery-themed journal sections and
-- "Destination Beyond" had zero published articles, so there's nothing to
-- reassign. Archiving it removes it from the /journal index, nav and
-- sitemap; see next.config.ts for the accompanying redirect.
-- Run AFTER 033_payment_integration.sql
-- =============================================================================

UPDATE journal_sections SET status = 'archived' WHERE slug = 'destination-beyond';
