-- =============================================================================
-- Kiambu Road Explorer — Migration 033
-- Adds the columns needed to reconcile real Paystack (card + M-Pesa) payments
-- against store orders and donation pledges. Purely additive — no existing
-- column, enum, or RLS policy changes. store_orders.status already has a
-- 'paid' value in its enum; donation_pledges.status already has 'received'
-- as its paid-equivalent — both are reused as-is.
-- Run AFTER 032_people_profiles.sql
-- =============================================================================

ALTER TABLE store_orders
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

ALTER TABLE donation_pledges
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_store_orders_payment_reference ON store_orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_donation_pledges_payment_reference ON donation_pledges(payment_reference);
