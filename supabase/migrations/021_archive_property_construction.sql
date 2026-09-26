-- =============================================================================
-- Kiambu Road Explorer — Migration 021
-- Finishes what migration 006 started: 006 archived property-construction's
-- own "Building & Road Contractors" / "Timber & Building Materials"
-- subcategory rows and created fresh equivalents under Building &
-- Construction, but never actually moved the 13 businesses still pointing at
-- the old archived subcategory rows, and never archived the
-- property-construction category itself — so it kept showing on the live
-- site as a duplicate of Building & Construction / Real Estate & Property.
-- Run AFTER 020_import_researched_businesses_batch2_verified.sql
-- =============================================================================

-- Move "Building & Road Contractors" businesses to the live Building & Construction subcategory
UPDATE businesses b
SET category_id = (SELECT id FROM categories WHERE slug = 'building-construction'),
    subcategory_id = (
      SELECT id FROM subcategories
      WHERE slug = 'building-road-contractors'
        AND category_id = (SELECT id FROM categories WHERE slug = 'building-construction')
    )
WHERE b.subcategory_id = (
  SELECT id FROM subcategories
  WHERE slug = 'building-road-contractors'
    AND category_id = (SELECT id FROM categories WHERE slug = 'property-construction')
);

-- Move "Timber & Building Materials" businesses to the live Building & Construction subcategory
UPDATE businesses b
SET category_id = (SELECT id FROM categories WHERE slug = 'building-construction'),
    subcategory_id = (
      SELECT id FROM subcategories
      WHERE slug = 'timber-building-materials'
        AND category_id = (SELECT id FROM categories WHERE slug = 'building-construction')
    )
WHERE b.subcategory_id = (
  SELECT id FROM subcategories
  WHERE slug = 'timber-building-materials'
    AND category_id = (SELECT id FROM categories WHERE slug = 'property-construction')
);

-- Now safe to archive — no businesses reference it any more
UPDATE categories SET status = 'archived' WHERE slug = 'property-construction';
