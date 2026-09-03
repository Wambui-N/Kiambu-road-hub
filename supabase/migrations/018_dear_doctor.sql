-- =============================================================================
-- Kiambu Road Explorer — Migration 018
-- "Dear Doctor" becomes its own top-level page (paid doctor consultation +
-- counselling intake forms) instead of a placeholder Lifestyle Journal
-- section. Archive the old journal_sections row (same pattern used for
-- retired categories in migration 006) and add a table to record submissions
-- so nothing is lost if the notification email fails to send.
-- Run AFTER 017_ask_kiambu_road_forum.sql
-- =============================================================================

UPDATE journal_sections SET status = 'archived' WHERE slug = 'dear-doctor';

CREATE TABLE IF NOT EXISTS doctor_consultations (
  id              uuid primary key default gen_random_uuid(),
  service_type    text not null check (service_type in ('consultation', 'counselling')),
  age             integer not null,
  gender          text not null check (gender in ('male', 'female')),
  county          text,
  marital_status  text check (marital_status in ('single', 'married')),
  message         text not null,
  email_sent      boolean not null default false,
  status          text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at      timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_doctor_consultations_created ON doctor_consultations(created_at desc);

ALTER TABLE doctor_consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public submit doctor_consultations" ON doctor_consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all doctor_consultations" ON doctor_consultations FOR ALL USING (is_admin());
