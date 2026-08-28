-- =============================================================================
-- Kiambu Road Explorer — Migration 011
-- Tag catalog for "Quick Facts" (hospitals, malls), Medical Service filters,
-- and the editorial "emergency-qualified" hospital flag.
-- Run AFTER 010_category_restructure.sql
--
-- These reuse the existing tags/business_tags tables (already have public
-- read + admin write RLS from 001_initial_schema.sql) — no new tables needed.
-- tag_type values used: 'medical_service', 'quick_fact', 'emergency_criteria'.
-- =============================================================================

-- ─── 1. Medical service tags ──────────────────────────────────────────────────
-- Doubles as both the hospital "Quick Facts" checklist and the Medical
-- Services category filter pills, so one tag per concept instead of two.

INSERT INTO tags (name, slug, tag_type)
VALUES
  ('24-Hour',           '24-hour',           'medical_service'),
  ('Emergency',         'emergency',         'medical_service'),
  ('Maternity',         'maternity',         'medical_service'),
  ('Paediatrics',       'paediatrics',       'medical_service'),
  ('Dental',            'dental',            'medical_service'),
  ('Laboratory',        'laboratory',        'medical_service'),
  ('X-Ray / Imaging',   'x-ray-imaging',     'medical_service'),
  ('Pharmacy',          'pharmacy',          'medical_service'),
  ('Physiotherapy',     'physiotherapy',     'medical_service'),
  ('Vaccination',       'vaccination',       'medical_service'),
  ('Specialist Clinics','specialist-clinics','medical_service')
ON CONFLICT (slug) DO UPDATE SET tag_type = EXCLUDED.tag_type;

-- ─── 2. Mall quick-fact tags ───────────────────────────────────────────────────

INSERT INTO tags (name, slug, tag_type)
VALUES
  ('Parking',            'parking',            'quick_fact'),
  ('Food Court',         'food-court',         'quick_fact'),
  ('Supermarket Anchor', 'supermarket-anchor', 'quick_fact'),
  ('ATM',                'atm',                'quick_fact'),
  ('Cinema',              'cinema',            'quick_fact'),
  ('Kids'' Play Area',   'kids-play-area',     'quick_fact')
ON CONFLICT (slug) DO UPDATE SET tag_type = EXCLUDED.tag_type;

-- ─── 3. Editorial "emergency-qualified" flag ──────────────────────────────────
-- Manually assigned by an admin/editor to hospitals that meet the emergency
-- inclusion criteria (24hr operation, has ER, public contact, corridor-
-- accessible, licensed) — never automated, to avoid appearing to endorse one
-- private hospital over another.

INSERT INTO tags (name, slug, tag_type)
VALUES
  ('Emergency-Qualified Hospital', 'emergency-qualified', 'emergency_criteria')
ON CONFLICT (slug) DO UPDATE SET tag_type = EXCLUDED.tag_type;
