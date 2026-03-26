-- =============================================================================
-- Kiambu Road Explorer — Reference Data Seed
-- =============================================================================
-- Run this AFTER 001_initial_schema.sql and 002_storage.sql.
-- Seeds: areas, categories, subcategories, journal sections.
-- Business listings should be added via the admin panel, not via SQL directly.
-- =============================================================================

-- =============================================================================
-- AREAS
-- =============================================================================

insert into areas (name, slug, sort_order) values
  ('Ridgeways',    'ridgeways',    1),
  ('Thindigua',    'thindigua',    2),
  ('Runda',        'runda',        3),
  ('Ruaka',        'ruaka',        4),
  ('Ndenderu',     'ndenderu',     5),
  ('Kasarini',     'kasarini',     6),
  ('Kitisuru',     'kitisuru',     7),
  ('Kiambu Town',  'kiambu-town',  8),
  ('Two Rivers',   'two-rivers',   9),
  ('Karura',       'karura',       10)
on conflict (slug) do nothing;

-- =============================================================================
-- CATEGORIES + SUBCATEGORIES
-- =============================================================================

-- Eat, Drink & Stay
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Eat, Drink & Stay', 'eat-drink-stay', 'UtensilsCrossed', '#E8A020',
    'Restaurants, hotels, cafes, bars and furnished apartments', 1, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Hotels & Conference',             'hotels-conference',          1),
  ('Restaurants',                     'restaurants',                2),
  ('Fast Food & Cafes',               'fast-food-cafes',            3),
  ('Bars & Clubs',                    'bars-clubs',                 4),
  ('Airbnb & Furnished Apartments',   'airbnb-furnished-apartments', 5)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Property & Construction
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Property & Construction', 'property-construction', 'Building2', '#8B5CF6',
    'Real estate agents, contractors, and building materials', 2, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Home & Office Agents',      'home-office-agents',       1),
  ('Land & Property Agents',    'land-property-agents',     2),
  ('Building & Road Contractors','building-road-contractors',3),
  ('Timber & Building Materials','timber-building-materials',4)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Professional Services
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Professional Services', 'professional-services', 'Briefcase', '#3B82F6',
    'Legal, IT, marketing, and professional expertise', 3, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Legal Services',            'legal-services',           1),
  ('Valuation & Engineering',   'valuation-survey-engineering',2),
  ('Tax & Auditing',            'tax-auditing',             3),
  ('Event Organizers',          'event-organizers',         4),
  ('IT & Graphic Design',       'it-graphic-design',        5),
  ('Media & Marketing',         'media-marketing',          6),
  ('Travel Agents',             'travel-agents',            7),
  ('Vet & Agronomy',            'vet-agronomy',             8),
  ('Environment',               'environment',              9),
  ('Borehole Drillers',         'borehole-drillers',        10),
  ('Counselling & Mentorship',  'counselling-mentorship',   11),
  ('Modelling & Casting',       'modelling-casting',        12)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Retail & Shopping
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Retail & Shopping', 'retail-shopping', 'ShoppingBag', '#EC4899',
    'Malls, supermarkets, boutiques and specialty stores', 4, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Malls & Stores',        'malls-stores',       1),
  ('Groceries & Fresh Foods','groceries-fresh-foods',2),
  ('Hardware',              'hardware',           3),
  ('Boutiques',             'boutiques',          4),
  ('Furniture & Decor',     'furniture-decor',    5),
  ('Beauty & Spas',         'beauty-spas',        6),
  ('Art Gallery & Curios',  'art-gallery-curios', 7),
  ('Wines & Spirits',       'wines-spirits',      8),
  ('Meat Supply',           'meat-supply',        9),
  ('Water Supply',          'water-supply',       10),
  ('Sports Equipment',      'sports-equipment',   11),
  ('Computers & Phones',    'computers-phones',   12)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Transport & Logistics
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Transport & Logistics', 'transport-logistics', 'Truck', '#F59E0B',
    'Car hire, courier, taxi, and freight services', 5, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Car Hire & PSV',        'car-hire-psv',       1),
  ('Courier Services',      'courier-services',   2),
  ('Taxi & Boda',           'taxi-boda',          3),
  ('Clearing & Forwarding', 'clearing-forwarding',4),
  ('Lorries & Pickups',     'lorries-pickups',    5)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Security & Emergency
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Security & Emergency', 'security-emergency', 'Shield', '#EF4444',
    'Security companies and emergency response', 6, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Security Companies', 'security-companies', 1),
  ('Ambulance Services', 'ambulance-services', 2)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Health & Wellness
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Health & Wellness', 'health-wellness', 'Heart', '#10B981',
    'Hospitals, clinics, gyms, pharmacies and wellness', 7, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Hospitals & Clinics', 'hospitals-clinics', 1),
  ('Dentists',            'dentists',          2),
  ('Gyms & Fitness',      'gyms-fitness',      3),
  ('Pharmacies',          'pharmacies',        4),
  ('Lab & X-Ray',         'lab-xray',          5),
  ('Physiotherapy',       'physiotherapy',     6),
  ('Nursing & Homecare',  'nursing-homecare',  7),
  ('Nutrition',           'nutrition',         8)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Home & Garden
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Home & Garden', 'home-garden', 'Home', '#84CC16',
    'Movers, pest control, plumbers, and home services', 8, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('House Movers',      'house-movers',   1),
  ('Pest Control',      'pest-control',   2),
  ('Plumbers',          'plumbers',       3),
  ('Electricians',      'electricians',   4),
  ('TV & Internet',     'tv-internet',    5),
  ('Pets',              'pets',           6),
  ('Paint & Decor',     'paint-decor',    7),
  ('Flowers & Seedlings','flowers-seedlings',8),
  ('Landscaping',       'landscaping',    9),
  ('Gas Supply',        'gas-supply',     10)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Automotive
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Automotive', 'automotive', 'Car', '#6366F1',
    'Car dealers, car wash, garages and motorcycles', 9, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Car Dealers',           'car-dealers',    1),
  ('Car Wash',              'car-wash',       2),
  ('Auto-Care & Tyre Centre','auto-care-tyre',3),
  ('Motorcycles & Bikes',   'motorcycles-bikes',4)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Education & Childcare
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Education & Childcare', 'education-childcare', 'GraduationCap', '#0EA5E9',
    'Schools, colleges, daycare and music classes', 10, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Schools',               'schools',             1),
  ('International Schools', 'international-schools',2),
  ('Colleges & Tuition',    'colleges-tuition',    3),
  ('Kindergarten & Day Care','kindergarten-daycare',4),
  ('Music Classes',         'music-classes',       5)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Faith & Community
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Faith & Community', 'faith-community', 'Church', '#A78BFA',
    'Churches, mosques, NGOs and community groups', 11, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('NGOs & CBOs',         'ngos-cbos',         1),
  ('Churches',            'churches',          2),
  ('Mosques',             'mosques',           3),
  ('Women & Youth Groups','women-youth-groups', 4),
  ('Political Parties',   'political-parties', 5)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Leisure & Outdoors
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Leisure & Outdoors', 'leisure-outdoors', 'Trees', '#22C55E',
    'Recreation, farm tours, events, sports and adventure', 12, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Recreation & Nature',   'recreation-nature',  1),
  ('Farm Tours',            'farm-tours',         2),
  ('Event Grounds',         'event-grounds',      3),
  ('Swimming & Tennis',     'swimming-tennis',    4),
  ('Children''s Parks',     'childrens-parks',    5),
  ('Horse Riding',          'horse-riding',       6),
  ('Cycling',               'cycling',            7),
  ('Nyama Choma',           'nyama-choma',        8),
  ('Go-Karting',            'go-karting',         9),
  ('Zip Lining',            'zip-lining',         10),
  ('Boat & Water Sports',   'boat-water-sports',  11)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Finance
with cat as (
  insert into categories (name, slug, icon, color, description, sort_order, status)
  values ('Finance', 'finance', 'Wallet', '#F97316',
    'Banks, SACCOs and insurance', 13, 'published')
  on conflict (slug) do update set sort_order = excluded.sort_order
  returning id
)
insert into subcategories (category_id, name, slug, sort_order, status)
select cat.id, sub.name, sub.slug, sub.sort_order, 'published'
from cat, (values
  ('Banks',     'banks',     1),
  ('SACCOs',    'saccos',    2),
  ('Insurance', 'insurance', 3)
) as sub(name, slug, sort_order)
on conflict (category_id, slug) do nothing;

-- Membership Clubs
insert into categories (name, slug, icon, color, description, sort_order, status)
values ('Membership Clubs', 'membership-clubs', 'Users', '#64748B',
  'Exclusive clubs and membership organisations', 14, 'published')
on conflict (slug) do nothing;

-- =============================================================================
-- JOURNAL SECTIONS
-- =============================================================================

insert into journal_sections (name, slug, tagline, sort_order, status) values
  ('Health Digest',           'health-digest',         'Health: the greatest wealth',               1, 'published'),
  ('Dear Doctor',             'dear-doctor',           'Ask the expert',                            2, 'published'),
  ('This N'' That',           'this-n-that',           'Enriching your lifestyle',                  3, 'published'),
  ('Prayer & Verse',          'prayer-verse',          'Beyond the scriptures',                     4, 'published'),
  ('Inspiration',             'inspiration',           'The hidden voice',                          5, 'published'),
  ('Kiambu Here N'' There',   'kiambu-here-n-there',   'Your Kiambu Travel Guide',                  6, 'published'),
  ('Destination Review',      'destination-review',    'Beyond the horizon',                        7, 'published'),
  ('Nature Trivia',           'nature-trivia',         'Bits and pieces on nature and wildlife',    8, 'published'),
  ('Business Notes',          'business-notes',        'Quotes that mean business',                 9, 'published'),
  ('Opinion',                 'opinion',               'Letter from the publisher',                10, 'published'),
  ('Newswatch',               'newswatch',             'This and that about Kiambu',               11, 'published')
on conflict (slug) do nothing;
