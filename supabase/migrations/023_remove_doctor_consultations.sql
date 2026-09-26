-- =============================================================================
-- Kiambu Road Explorer — Migration 023
-- Full removal of the Dear Doctor feature (paid online consultation/
-- counselling service). The feature's pages, API route and form component
-- have been deleted from the codebase; this removes its DB footprint too.
-- Run AFTER 022_rename_journal_sections.sql
-- =============================================================================

DROP TABLE IF EXISTS doctor_consultations;

-- Already archived by 018_dear_doctor.sql and filtered out of every section
-- list in code — deleting the leftover row outright per "remove it all
-- together" rather than leaving a harmless-but-orphaned archived row.
DELETE FROM journal_sections WHERE slug = 'dear-doctor';
