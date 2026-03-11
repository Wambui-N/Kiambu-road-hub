-- =============================================================================
-- Kiambu Road Hub — Migration 005: Add source_note to businesses
-- =============================================================================
-- Adds a nullable source_note column to the businesses table and tags all
-- existing demo rows (inserted by 004a–004f) with 'demo-seed-2025'.
-- This allows demo rows to be identified and managed independently from
-- fully verified production listings in a later phase.
-- Safe to re-run: ADD COLUMN IF NOT EXISTS.
-- =============================================================================

alter table businesses add column if not exists source_note text;

comment on column businesses.source_note is
  'Tracks how/where this record was created. Set to ''demo-seed-2025'' for all
   initial demo listings seeded from curated research. Use this to safely
   identify and manage demo rows during the verification phase.';

-- Tag all existing rows that were seeded as demo data
update businesses
set source_note = 'demo-seed-2025'
where source_note is null;
