-- =============================================================================
-- Kiambu Road Explorer — Migration 023
-- Full removal of the Dear Doctor feature (paid online consultation/
-- counselling service). The feature's pages, API route and form component
-- have been deleted from the codebase; this removes its DB footprint too.
-- Run AFTER 022_rename_journal_sections.sql
-- =============================================================================

-- Scope revised: Dear Doctor returns as a plain "Coming Soon" journal section
-- (republished in 022) — only the paid consultation feature itself is removed.
DROP TABLE IF EXISTS doctor_consultations;
