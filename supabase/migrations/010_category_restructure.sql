-- =============================================================================
-- Kiambu Road Explorer — Migration 010
-- Category restructure:
--   health-wellness  -> renamed to "Medical Services" (medical-services), medical-only
--   lifestyle-wellness (new) <- gyms-fitness, nutrition (from health-wellness)
--                             + beauty-spas, boutiques (from retail-shopping)
--   malls (new)              <- malls-stores (from retail-shopping)
-- Run AFTER 009_review_helpful_votes.sql
-- =============================================================================

-- ─── 1. Rename health-wellness -> Medical Services ────────────────────────────

UPDATE categories
SET name = 'Medical Services',
    slug = 'medical-services',
    description = 'Hospitals, clinics, dentists, pharmacies and diagnostic services'
WHERE slug = 'health-wellness';

-- ─── 2. Insert the two new categories ─────────────────────────────────────────

INSERT INTO categories (name, slug, icon, color, description, sort_order, status)
VALUES
  ('Lifestyle & Wellness', 'lifestyle-wellness', 'Sparkles', '#14B8A6',
   'Gyms, nutrition, beauty, spas and boutiques', 17, 'published'),
  ('Malls', 'malls', 'ShoppingBag', '#F472B6',
   'Shopping malls and large retail stores', 18, 'published')
ON CONFLICT (slug) DO UPDATE
  SET name        = EXCLUDED.name,
      icon        = EXCLUDED.icon,
      color       = EXCLUDED.color,
      description = EXCLUDED.description,
      sort_order  = EXCLUDED.sort_order,
      status      = EXCLUDED.status;

-- ─── 3. Move subcategories to their new parent category ──────────────────────

-- gyms-fitness, nutrition: medical-services -> lifestyle-wellness
UPDATE subcategories
SET category_id = (SELECT id FROM categories WHERE slug = 'lifestyle-wellness')
WHERE slug IN ('gyms-fitness', 'nutrition')
  AND category_id = (SELECT id FROM categories WHERE slug = 'medical-services');

-- beauty-spas, boutiques: retail-shopping -> lifestyle-wellness
UPDATE subcategories
SET category_id = (SELECT id FROM categories WHERE slug = 'lifestyle-wellness')
WHERE slug IN ('beauty-spas', 'boutiques')
  AND category_id = (SELECT id FROM categories WHERE slug = 'retail-shopping');

-- malls-stores: retail-shopping -> malls
UPDATE subcategories
SET category_id = (SELECT id FROM categories WHERE slug = 'malls')
WHERE slug = 'malls-stores'
  AND category_id = (SELECT id FROM categories WHERE slug = 'retail-shopping');

-- ─── 4. Follow businesses to their subcategory's new parent ──────────────────
-- businesses.category_id is stored independently of subcategory_id, so moved
-- subcategories don't automatically carry their businesses along.

UPDATE businesses b
SET category_id = s.category_id
FROM subcategories s
WHERE b.subcategory_id = s.id
  AND s.slug IN ('gyms-fitness', 'nutrition', 'beauty-spas', 'boutiques', 'malls-stores')
  AND b.category_id <> s.category_id;

-- ─── 5. Manual-review flag: businesses left directly under Medical Services  ──
-- with no subcategory are ambiguous (could belong under Lifestyle & Wellness)
-- and were NOT auto-moved. Run this after applying the migration and review
-- each result by hand via /admin/businesses.
--
-- SELECT id, name, slug FROM businesses
-- WHERE category_id = (SELECT id FROM categories WHERE slug = 'medical-services')
--   AND subcategory_id IS NULL;
