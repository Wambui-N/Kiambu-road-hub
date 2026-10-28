-- =============================================================================
-- Kiambu Road Explorer — Migration 030
-- Extracts the merchandise half of the former "Explorer Merchandise" journal
-- section into a standalone /shop route (the journal_sections row for slug
-- 'opinion' is archived — it's no longer a journal section at all). Adds a
-- `coming_soon` flag to store_products so a not-yet-purchasable item can be
-- listed next to real products without claiming the whole section is
-- unavailable. Seeds the two Explorer Publications titles from the client's
-- copy. Also updates the Kiambu Retreats and Newswatch journal_sections rows
-- with their real intro copy now that they have real content to introduce.
-- Run AFTER 029_community_projects_rich_content.sql
-- =============================================================================

UPDATE journal_sections SET status = 'archived' WHERE slug = 'opinion';

UPDATE journal_sections
  SET tagline = 'You don''t always have to travel far to feel far away'
  WHERE slug = 'kiambu-here-n-there';

UPDATE journal_sections
  SET name = 'News', tagline = 'For the latest news, stories, events and statements'
  WHERE slug = 'newswatch';

ALTER TABLE store_products
  ADD COLUMN IF NOT EXISTS coming_soon boolean NOT NULL DEFAULT false;

INSERT INTO store_products (product_type, name, slug, description, price, currency, status, coming_soon, sort_order)
VALUES
(
  'ebook',
  'The Small Business Manifesto',
  'the-small-business-manifesto',
  E'20 Hard-Earned Principles for a Business That Lasts\n\nThis book is a simple and practical north star for navigating the treacherous world of small businesses. These are not textbook ideas. It is not an academic training on generic theories. They are honest reflections on the challenges confronting small business owners every day.\n\nIf you run a small business or are contemplating opening one, you will find the principles listed in this book a useful foundation.\n\nThe principles listed here assist you in developing a business manifesto that suits your circumstances, market and products. Your manifesto will then guide the management and growth of your business into a stable institution.\n\nAnd don''t forget to share a copy with someone who needs it.',
  800,
  'KES',
  'published',
  false,
  1
),
(
  'ebook',
  'Become a Customer Service Star',
  'become-a-customer-service-star',
  'Simple principles for winning and keeping customers.',
  0,
  'KES',
  'published',
  true,
  2
)
ON CONFLICT (slug) DO NOTHING;
