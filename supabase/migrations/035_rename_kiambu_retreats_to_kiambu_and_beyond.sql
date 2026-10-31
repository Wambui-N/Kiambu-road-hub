-- =============================================================================
-- Kiambu Road Explorer — Migration 035
-- Renames "Kiambu Retreats" to "Kiambu & Beyond" now that it has absorbed
-- the former "Destination Beyond" section (migration 034) and covers travel
-- in Kiambu and further afield, not just local retreats.
-- Run AFTER 034_merge_destination_beyond_into_retreats.sql
-- =============================================================================

UPDATE journal_sections SET name = 'Kiambu & Beyond' WHERE slug = 'kiambu-here-n-there';
