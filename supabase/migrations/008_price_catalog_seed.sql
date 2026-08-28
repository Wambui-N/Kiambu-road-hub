-- =============================================================================
-- Kiambu Road Explorer — Migration 008
-- Seed core price_items catalog + supporting index for the price comparison redesign
-- Run AFTER 007_outbound_clicks.sql
-- =============================================================================

-- ─── 1. Seed ~24 core price items across the 4 price categories ──────────────

INSERT INTO price_items (name, slug, category, unit, status)
VALUES
  -- Groceries
  ('Milk 500ml',           'milk-500ml',            'groceries', '500ml',  'published'),
  ('Bread 400g',           'bread-400g',             'groceries', 'loaf',   'published'),
  ('Eggs (tray of 30)',    'eggs-tray-30',           'groceries', 'tray',   'published'),
  ('Cooking Oil 2L',       'cooking-oil-2l',         'groceries', '2L',     'published'),
  ('Sugar 2kg',            'sugar-2kg',              'groceries', '2kg',    'published'),
  ('Rice 2kg',             'rice-2kg',               'groceries', '2kg',    'published'),
  ('Maize Flour (Unga) 2kg','unga-2kg',              'groceries', '2kg',    'published'),
  ('Tomatoes 1kg',         'tomatoes-1kg',           'groceries', '1kg',    'published'),
  ('Onions 1kg',           'onions-1kg',             'groceries', '1kg',    'published'),
  -- Fuel
  ('Petrol',               'petrol-per-litre',       'fuel',      'litre',  'published'),
  ('Diesel',                'diesel-per-litre',       'fuel',      'litre',  'published'),
  ('Kerosene',              'kerosene-per-litre',     'fuel',      'litre',  'published'),
  ('LPG Gas Refill 6kg',    'lpg-refill-6kg',         'fuel',      '6kg',    'published'),
  ('LPG Gas Refill 13kg',   'lpg-refill-13kg',        'fuel',      '13kg',   'published'),
  -- Medical
  ('Paracetamol (16 tabs)', 'paracetamol-16-tabs',    'medical',   'pack',   'published'),
  ('Malaria Test (MRDT)',   'malaria-test-mrdt',      'medical',   'test',   'published'),
  ('GP Consultation',       'gp-consultation',        'medical',   'visit',  'published'),
  -- Dining
  ('Soda 500ml',            'soda-500ml',             'dining',    '500ml',  'published'),
  ('Bottled Water 500ml',   'bottled-water-500ml',    'dining',    '500ml',  'published'),
  ('Tea/Coffee',            'tea-coffee',             'dining',    'cup',    'published'),
  ('Plate of Ugali & Veg',  'ugali-veg-plate',        'dining',    'plate',  'published')
ON CONFLICT (slug) DO UPDATE
  SET name     = EXCLUDED.name,
      category = EXCLUDED.category,
      unit     = EXCLUDED.unit,
      status   = EXCLUDED.status;

-- ─── 2. Index to support outlet-linked lookups/joins ──────────────────────────

CREATE INDEX IF NOT EXISTS idx_price_entries_business ON price_entries(business_id);
