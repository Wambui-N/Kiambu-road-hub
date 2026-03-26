-- =============================================================================
-- Kiambu Road Explorer — Migration 006
-- New 16-category structure, business field additions, and new platform tables
-- Run AFTER 005_add_source_note_to_businesses.sql
-- =============================================================================

-- ─── 1. Add new columns to businesses ────────────────────────────────────────

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS building_name text;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS door_number   text;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS contact_name  text;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS road_street   text;

-- ─── 2. Insert / upsert the 16 categories with correct sort_order ─────────────

INSERT INTO categories (name, slug, icon, color, description, sort_order, status)
VALUES
  ('Eat, Drink & Stay',        'eat-drink-stay',        'UtensilsCrossed', '#E8A020', 'Restaurants, hotels, cafes, bars and furnished apartments', 1,  'published'),
  ('Real Estate & Property',   'real-estate-property',  'Building2',       '#8B5CF6', 'Home, land and property agents',                              2,  'published'),
  ('Health & Wellness',        'health-wellness',       'Heart',           '#10B981', 'Hospitals, clinics, gyms, pharmacies and wellness',            3,  'published'),
  ('Car & Motor Dealers',      'car-motor-dealers',     'Car',             '#6366F1', 'Car dealers, motorcycles and bikes',                          4,  'published'),
  ('Auto Services',            'auto-services',         'Wrench',          '#7C3AED', 'Car wash, auto-care and tyre centres',                        5,  'published'),
  ('Education & Childcare',    'education-childcare',   'GraduationCap',   '#0EA5E9', 'Schools, colleges, daycare and music classes',                 6,  'published'),
  ('Home & Garden',            'home-garden',           'Home',            '#84CC16', 'Movers, cleaning, plumbers, electricians and home services',   7,  'published'),
  ('Building & Construction',  'building-construction', 'HardHat',         '#D97706', 'Building contractors and building materials suppliers',        8,  'published'),
  ('Professional Services',    'professional-services', 'Briefcase',       '#3B82F6', 'Legal, IT, marketing, and professional expertise',             9,  'published'),
  ('Retail & Shopping',        'retail-shopping',       'ShoppingBag',     '#EC4899', 'Malls, supermarkets, boutiques and specialty stores',          10, 'published'),
  ('Leisure & Outdoors',       'leisure-outdoors',      'Trees',           '#22C55E', 'Recreation, farm tours, events, sports and adventure',         11, 'published'),
  ('Transport & Logistics',    'transport-logistics',   'Truck',           '#F59E0B', 'Car hire, courier, taxi, and freight services',                12, 'published'),
  ('Security & Emergency',     'security-emergency',    'Shield',          '#EF4444', 'Security companies and emergency response',                    13, 'published'),
  ('Faith & Community',        'faith-community',       'Church',          '#A78BFA', 'Churches, mosques, NGOs and community groups',                 14, 'published'),
  ('Finance',                  'finance',               'Wallet',          '#F97316', 'Banks, SACCOs and insurance',                                  15, 'published'),
  ('Membership Clubs',         'membership-clubs',      'Users',           '#64748B', 'Exclusive clubs and membership organisations',                 16, 'published')
ON CONFLICT (slug) DO UPDATE
  SET name       = EXCLUDED.name,
      icon       = EXCLUDED.icon,
      color      = EXCLUDED.color,
      description = EXCLUDED.description,
      sort_order  = EXCLUDED.sort_order,
      status      = EXCLUDED.status;

-- Archive the old merged categories (businesses will be remapped below)
UPDATE categories SET status = 'archived' WHERE slug IN ('property-construction', 'automotive');

-- ─── 3. Upsert subcategories for new categories ───────────────────────────────

-- Real Estate & Property
WITH cat AS (SELECT id FROM categories WHERE slug = 'real-estate-property')
INSERT INTO subcategories (category_id, name, slug, sort_order, status)
SELECT cat.id, sub.name, sub.slug, sub.sort_order, 'published'
FROM cat, (VALUES
  ('Home, Land & Property Agents', 'home-land-property-agents', 1)
) AS sub(name, slug, sort_order)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Car & Motor Dealers
WITH cat AS (SELECT id FROM categories WHERE slug = 'car-motor-dealers')
INSERT INTO subcategories (category_id, name, slug, sort_order, status)
SELECT cat.id, sub.name, sub.slug, sub.sort_order, 'published'
FROM cat, (VALUES
  ('Car Dealers',       'car-dealers',       1),
  ('Motorcycles & Bikes','motorcycles-bikes', 2)
) AS sub(name, slug, sort_order)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Auto Services
WITH cat AS (SELECT id FROM categories WHERE slug = 'auto-services')
INSERT INTO subcategories (category_id, name, slug, sort_order, status)
SELECT cat.id, sub.name, sub.slug, sub.sort_order, 'published'
FROM cat, (VALUES
  ('Car Wash',                'car-wash',       1),
  ('Auto-Care & Tyre Centre', 'auto-care-tyre', 2)
) AS sub(name, slug, sort_order)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Building & Construction
WITH cat AS (SELECT id FROM categories WHERE slug = 'building-construction')
INSERT INTO subcategories (category_id, name, slug, sort_order, status)
SELECT cat.id, sub.name, sub.slug, sub.sort_order, 'published'
FROM cat, (VALUES
  ('Building & Road Contractors',           'building-road-contractors', 1),
  ('Timber & Building Materials Suppliers', 'timber-building-materials', 2)
) AS sub(name, slug, sort_order)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Home & Garden: add missing subcategories
WITH cat AS (SELECT id FROM categories WHERE slug = 'home-garden')
INSERT INTO subcategories (category_id, name, slug, sort_order, status)
SELECT cat.id, sub.name, sub.slug, sub.sort_order, 'published'
FROM cat, (VALUES
  ('Interior Design',   'interior-design',   11),
  ('Cleaning Services', 'cleaning-services', 12)
) AS sub(name, slug, sort_order)
ON CONFLICT (category_id, slug) DO NOTHING;

-- ─── 4. Migrate subcategories from old → new parent categories ───────────────

-- property-construction → real-estate-property
UPDATE subcategories
SET category_id = (SELECT id FROM categories WHERE slug = 'real-estate-property')
WHERE slug IN ('home-office-agents', 'land-property-agents')
  AND category_id = (SELECT id FROM categories WHERE slug = 'property-construction');

-- property-construction → building-construction
-- (subcategory rows already exist in building-construction from step 3 above,
--  so the property-construction ones become duplicates; archive them instead)
UPDATE subcategories
SET status = 'archived'
WHERE slug IN ('building-road-contractors', 'timber-building-materials')
  AND category_id = (SELECT id FROM categories WHERE slug = 'property-construction');

-- automotive → car-motor-dealers
-- (already inserted fresh rows above; archive old ones)
UPDATE subcategories
SET status = 'archived'
WHERE slug IN ('car-dealers', 'motorcycles-bikes')
  AND category_id = (SELECT id FROM categories WHERE slug = 'automotive');

-- automotive → auto-services
UPDATE subcategories
SET status = 'archived'
WHERE slug IN ('car-wash', 'auto-care-tyre')
  AND category_id = (SELECT id FROM categories WHERE slug = 'automotive');

-- Education & Childcare: rename 'Schools' → 'Private Schools'
UPDATE subcategories
SET name = 'Private Schools', slug = 'private-schools'
WHERE slug = 'schools'
  AND category_id = (SELECT id FROM categories WHERE slug = 'education-childcare');

-- Professional Services: expand Event Organizers name
UPDATE subcategories
SET name = 'Event Organizers & Equipment Hire'
WHERE slug = 'event-organizers'
  AND category_id = (SELECT id FROM categories WHERE slug = 'professional-services');

-- ─── 5. Remap businesses from archived categories ─────────────────────────────

-- Businesses in property-construction: follow their subcategory to new parent
UPDATE businesses b
SET category_id = s.category_id
FROM subcategories s
WHERE b.subcategory_id = s.id
  AND b.category_id = (SELECT id FROM categories WHERE slug = 'property-construction');

-- Businesses in property-construction with no subcategory → real-estate-property
UPDATE businesses
SET category_id = (SELECT id FROM categories WHERE slug = 'real-estate-property')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'property-construction')
  AND subcategory_id IS NULL;

-- Businesses in automotive: remap subcategory_id to new category's version
-- For car-dealers & motorcycles-bikes → car-motor-dealers
UPDATE businesses b
SET category_id    = (SELECT id FROM categories WHERE slug = 'car-motor-dealers'),
    subcategory_id = (
      SELECT s2.id FROM subcategories s2
      JOIN subcategories s1 ON s1.slug = s2.slug
      WHERE s1.id = b.subcategory_id
        AND s2.category_id = (SELECT id FROM categories WHERE slug = 'car-motor-dealers')
      LIMIT 1
    )
WHERE b.category_id = (SELECT id FROM categories WHERE slug = 'automotive')
  AND b.subcategory_id IN (
    SELECT id FROM subcategories
    WHERE slug IN ('car-dealers', 'motorcycles-bikes')
      AND category_id = (SELECT id FROM categories WHERE slug = 'automotive')
  );

-- For car-wash & auto-care-tyre → auto-services
UPDATE businesses b
SET category_id    = (SELECT id FROM categories WHERE slug = 'auto-services'),
    subcategory_id = (
      SELECT s2.id FROM subcategories s2
      JOIN subcategories s1 ON s1.slug = s2.slug
      WHERE s1.id = b.subcategory_id
        AND s2.category_id = (SELECT id FROM categories WHERE slug = 'auto-services')
      LIMIT 1
    )
WHERE b.category_id = (SELECT id FROM categories WHERE slug = 'automotive')
  AND b.subcategory_id IN (
    SELECT id FROM subcategories
    WHERE slug IN ('car-wash', 'auto-care-tyre')
      AND category_id = (SELECT id FROM categories WHERE slug = 'automotive')
  );

-- Remaining automotive businesses (no subcategory) → car-motor-dealers
UPDATE businesses
SET category_id = (SELECT id FROM categories WHERE slug = 'car-motor-dealers')
WHERE category_id = (SELECT id FROM categories WHERE slug = 'automotive');

-- ─── 6. Add missing journal sections ─────────────────────────────────────────

INSERT INTO journal_sections (name, slug, tagline, sort_order, status) VALUES
  ('Inspiration',            'inspiration',             'The hidden voice',                           5,  'published'),
  ('E-Books',                'e-books',                 'Read your way to a good life',               6,  'published'),
  ('Business Opportunities', 'business-opportunities',  'Properties, business and investment',        14, 'published')
ON CONFLICT (slug) DO NOTHING;

-- Reorder existing sections to match spec
UPDATE journal_sections SET sort_order = 1  WHERE slug = 'health-digest';
UPDATE journal_sections SET sort_order = 2  WHERE slug = 'dear-doctor';
UPDATE journal_sections SET sort_order = 3  WHERE slug = 'this-n-that';
UPDATE journal_sections SET sort_order = 4  WHERE slug = 'prayer-verse';
UPDATE journal_sections SET sort_order = 5  WHERE slug = 'inspiration';
UPDATE journal_sections SET sort_order = 6  WHERE slug = 'e-books';
UPDATE journal_sections SET sort_order = 7  WHERE slug = 'kiambu-here-n-there';
UPDATE journal_sections SET sort_order = 8  WHERE slug = 'destination-review';
UPDATE journal_sections SET sort_order = 9  WHERE slug = 'nature-trivia';
UPDATE journal_sections SET sort_order = 10 WHERE slug = 'business-notes';
UPDATE journal_sections SET sort_order = 11 WHERE slug = 'business-opportunities';
UPDATE journal_sections SET sort_order = 12 WHERE slug = 'opinion';
UPDATE journal_sections SET sort_order = 13 WHERE slug = 'newswatch';

-- ─── 7. New platform tables ───────────────────────────────────────────────────

-- Business reviews (moderated)
CREATE TABLE IF NOT EXISTS reviews (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid references businesses(id) on delete cascade,
  reviewer_name text not null,
  rating        int not null check (rating between 1 and 5),
  comment       text,
  status        text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected')),
  created_at    timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_business   ON reviews(business_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_status     ON reviews(status, created_at desc);

-- Article comments (moderated)
CREATE TABLE IF NOT EXISTS article_comments (
  id             uuid primary key default gen_random_uuid(),
  article_id     uuid references articles(id) on delete cascade,
  commenter_name text not null,
  comment        text not null,
  status         text not null default 'pending'
                   check (status in ('pending', 'approved', 'rejected')),
  created_at     timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_article_comments_article ON article_comments(article_id, status);

-- Ad slots (per category page or journal page)
CREATE TABLE IF NOT EXISTS ad_slots (
  id            uuid primary key default gen_random_uuid(),
  page          text not null,        -- e.g. 'directory/eat-drink-stay' | 'journal/health-digest' | 'global'
  tier          text not null         -- 'primary' | 'secondary' | 'tertiary'
                  check (tier in ('primary', 'secondary', 'tertiary')),
  position      integer not null default 1,
  advertiser_id uuid references businesses(id) on delete set null,
  ad_title      text,
  ad_image_path text,
  ad_link_url   text,
  active        boolean not null default false,
  created_at    timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_ad_slots_page ON ad_slots(page, tier, active);

-- Advertising inquiries
CREATE TABLE IF NOT EXISTS ad_inquiries (
  id             uuid primary key default gen_random_uuid(),
  business_name  text not null,
  contact_person text not null,
  phone          text not null,
  email          text not null,
  message        text,
  status         text not null default 'new'
                   check (status in ('new', 'read', 'replied', 'closed')),
  created_at     timestamptz not null default now()
);

-- Site feedback
CREATE TABLE IF NOT EXISTS feedback (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  message    text not null,
  status     text not null default 'new'
               check (status in ('new', 'read', 'noted')),
  created_at timestamptz not null default now()
);

-- Talent search inquiries
CREATE TABLE IF NOT EXISTS talent_inquiries (
  id           uuid primary key default gen_random_uuid(),
  company_name text not null,
  role_needed  text not null,
  description  text,
  contact_name text not null,
  phone        text not null,
  email        text not null,
  status       text not null default 'new'
                 check (status in ('new', 'read', 'replied', 'closed')),
  created_at   timestamptz not null default now()
);

-- Community price submissions (pending admin approval)
CREATE TABLE IF NOT EXISTS price_submissions (
  id         uuid primary key default gen_random_uuid(),
  store_name text not null,
  item_name  text not null,
  price      numeric(10, 2) not null,
  unit       text,
  category   text,
  observed_at date not null default current_date,
  submitted_by_email text,
  status     text not null default 'pending'
               check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- ─── 8. RLS for new tables ────────────────────────────────────────────────────

ALTER TABLE reviews              ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_comments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_slots             ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_inquiries         ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback             ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_inquiries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_submissions    ENABLE ROW LEVEL SECURITY;

-- Public: read approved reviews/comments
CREATE POLICY "Public read approved reviews"
  ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read approved comments"
  ON article_comments FOR SELECT USING (status = 'approved');

-- Public: read active ad slots
CREATE POLICY "Public read active ad_slots"
  ON ad_slots FOR SELECT USING (active = true);

-- Public: insert new submissions
CREATE POLICY "Public submit review"
  ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit comment"
  ON article_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit ad_inquiry"
  ON ad_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit feedback"
  ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit talent_inquiry"
  ON talent_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit price_submission"
  ON price_submissions FOR INSERT WITH CHECK (true);

-- Admin: full access
CREATE POLICY "Admin all reviews"          ON reviews           FOR ALL USING (is_admin());
CREATE POLICY "Admin all article_comments" ON article_comments  FOR ALL USING (is_admin());
CREATE POLICY "Admin all ad_slots"         ON ad_slots          FOR ALL USING (is_admin());
CREATE POLICY "Admin all ad_inquiries"     ON ad_inquiries      FOR ALL USING (is_admin());
CREATE POLICY "Admin all feedback"         ON feedback          FOR ALL USING (is_admin());
CREATE POLICY "Admin all talent_inquiries" ON talent_inquiries  FOR ALL USING (is_admin());
CREATE POLICY "Admin all price_submissions"ON price_submissions FOR ALL USING (is_admin());
