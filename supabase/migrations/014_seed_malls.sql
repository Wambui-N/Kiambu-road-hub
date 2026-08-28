-- =============================================================================
-- Kiambu Road Explorer — Migration 014
-- Seed 12 of the 15 proposed Kiambu Road corridor malls (3 dropped after
-- research turned up no confirmed entity under the given name — see project
-- notes: "Nord Mall"/Ruaka, "Edenville Shopping Centre", "Thindigua Shopping
-- Centre" as a single mall).
--
-- Sourced via web research, not first-hand verification — status='review' on
-- the two thinnest-data entries (Evergreen Centre, Ruaka Square) pending an
-- admin glance; the rest are 'published' with reasonably solid tenant data
-- from official mall sites / review aggregators (see source_url per row).
-- Run AFTER 013_mall_hub_profiles.sql
-- =============================================================================

-- Note: source_note column doesn't exist on this project (migration 005 that
-- would have added it was never applied here) — source attribution lives in
-- source_url only; the per-row research-provenance notes are kept in this
-- migration's comments instead.
INSERT INTO businesses (
  name, slug, category_id, subcategory_id, area_id,
  road_street, building_name, short_description, description,
  phone, website, google_maps_url, opening_hours_text,
  status, verification_status, source_url,
  mall_quick_facts
) VALUES

('Garden City Mall', 'garden-city-mall',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 NULL,
 'Thika Road (Exit 7)', NULL,
 'Large mixed-use mall on Thika Road with a Carrefour supermarket, IMAX/Century Cinemax cinema, and dozens of retail and dining outlets.',
 'Large mixed-use mall on Thika Road with a Carrefour supermarket, IMAX/Century Cinemax cinema (East Africa''s only IMAX screen), and dozens of retail and dining outlets.',
 '0780 248 657', 'https://www.shopgardencitymall.com/', 'https://www.google.com/maps/search/Garden+City+Mall+Nairobi',
 'Mon–Sat 9:30am–8pm, Sun & Holidays 10am–8pm',
 'published', 'unverified', 'https://www.shopgardencitymall.com/garden-city-mall-stores',
 jsonb_build_object('parking', 'Yes — multi-storey, ~2,200 spaces', 'supermarket', 'Carrefour', 'banks', '6+ (ABSA, Co-op, Equity, KCB, NCBA, Stanbic)', 'restaurants', '15+', 'cinema', 'Yes — Century Cinemax (incl. IMAX)')),

('Village Market', 'village-market',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 (SELECT id FROM areas WHERE slug = 'gigiri'),
 'Limuru Road', NULL,
 'East Africa''s largest lifestyle mall in Gigiri, with a Carrefour supermarket, 150+ retail outlets, dining and family entertainment.',
 'East Africa''s largest lifestyle mall in Gigiri, with a Carrefour Market supermarket, 150+ retail outlets, dining, and family entertainment including a trampoline park.',
 '+254 777 880 877', 'https://villagemarket-kenya.com/', 'https://www.google.com/maps/search/Village+Market,+Kenya/',
 'Daily 7am–11pm (complex hours; individual stores vary)',
 'published', 'unverified', 'https://villagemarket-kenya.com/stores/',
 jsonb_build_object('parking', 'Yes — 700+ spaces', 'supermarket', 'Carrefour Market', 'play_area', 'Yes — "Under The Sea" kids play + Ozone Trampoline Park', 'cinema', 'No — former on-site cinema closed')),

('Ridgeways Mall', 'ridgeways-mall',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 (SELECT id FROM areas WHERE slug = 'ridgeways'),
 'Kiambu Road', NULL,
 'Neighbourhood shopping centre on Kiambu Road anchored by Chandarana Foodplus, with banks, a food court, and service outlets.',
 'Neighbourhood shopping centre on Kiambu Road anchored by Chandarana Foodplus, with three banks, a food court, and car-service and laundry outlets.',
 NULL, 'https://ridgewaysmall.co.ke/', 'https://www.google.com/maps/search/Ridgeways+Mall+Nairobi',
 'Daily 8am–8pm (stores); management office Mon–Fri 9:30am–5pm, Sat 9:30am–1pm',
 'published', 'unverified', 'https://ridgewaysmall.co.ke/about-us-2/',
 jsonb_build_object('parking', 'Yes — ample surface parking, 24-hour security', 'supermarket', 'Chandarana Foodplus', 'banks', '3 (SBM, Equity, Co-operative Bank) + ATMs', 'cinema', 'No')),

('Ciata City Mall', 'ciata-city-mall',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 NULL,
 'Kiambu Road', NULL,
 'Retail and office complex on Kiambu Road anchored by a large Naivas supermarket, with banks and eateries.',
 'Retail and office complex on Kiambu Road, near Ridgeways, anchored by a large Naivas "Food Market"-format supermarket, with banking and dining tenants.',
 '020 200 1028', 'https://ciatacity.co.ke/', 'https://www.google.com/maps/search/Ciata+City+Mall+Kiambu+Road',
 NULL,
 'published', 'unverified', 'https://kenya.tortoisepath.com/place/ciata-city-mall-ridgeways/',
 jsonb_build_object('supermarket', 'Naivas', 'banks', 'NCBA (exact total unconfirmed)')),

('Evergreen Centre', 'evergreen-centre',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 NULL,
 'Kiambu Road', NULL,
 'Small shopping centre on Kiambu Road near Ridgeways Mall; limited tenant information is publicly available.',
 'Small shopping centre (also known as Evergreen Square) on Kiambu Road near Ridgeways Mall. Public information on this centre is limited — details here are minimal and pending verification.',
 NULL, NULL, NULL,
 NULL,
 'review', 'unverified', 'https://mapcarta.com/W226609160',
 NULL),

('Mountain Mall', 'mountain-mall',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 NULL,
 'Thika Road (Exit 7 / Rosters junction)', NULL,
 'Mid-sized shopping complex at the Rosters junction on Thika Road, anchored by a Naivas supermarket.',
 'Mid-sized shopping complex at the Rosters/Exit 7 junction on Thika Road, anchored by a Naivas supermarket, with a National Bank of Kenya branch and a medical clinic.',
 '+254 717 888 822', NULL, 'https://www.google.com/maps/search/Mountain+Mall+Thika+Road',
 NULL,
 'published', 'unverified', 'https://naivas.info/locations/naivas-mountain-mall/',
 jsonb_build_object('parking', 'Yes — basement parking', 'supermarket', 'Naivas', 'banks', 'National Bank of Kenya branch + Co-operative Bank ATM')),

('Two Rivers Mall', 'two-rivers-mall',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 (SELECT id FROM areas WHERE slug = 'two-rivers'),
 'Limuru Road', NULL,
 'One of the largest shopping malls in Sub-Saharan Africa outside South Africa, at the Limuru/Kiambu Road junction, Ruaka.',
 'One of the largest shopping malls in Sub-Saharan Africa outside South Africa, at the Limuru/Kiambu Road junction near Ruaka, with a Carrefour hypermarket, Century Cinemax, and a theme park.',
 '0799 847 695', 'https://tworiversmall.com', 'https://www.google.com/maps/place/Two+Rivers+Mall,+Limuru+Road+Nairobi+KE/data=!4m2!3m1!1s0x182f3d454886e4ab:0xc48e63a813496999',
 'Daily 9am–9pm',
 'published', 'unverified', 'https://tworiversmall.com/two-rivers-mall-shops/',
 jsonb_build_object('parking', 'Yes — 1,046 spaces', 'supermarket', 'Carrefour (10,000 sqm hypermarket)', 'play_area', 'Yes — indoor Fun Zone + Funscapes Theme Park', 'banks', '6 (Stanbic, Sidian, KCB, Co-op, NCBA, ABSA)', 'restaurants', '14+', 'cinema', 'Yes — Century Cinemax')),

('Rosslyn Riviera Mall', 'rosslyn-riviera-mall',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 NULL,
 'Limuru Road, Rosslyn', NULL,
 'Eco-friendly neighbourhood mall on Limuru Road in Rosslyn, with 35+ retail, dining and wellness stores.',
 'Eco-friendly neighbourhood mall on Limuru Road in Rosslyn, anchored by Chandarana Foodplus, with 35+ retail, dining, wellness and a cinema.',
 '+254 700 362 654', 'https://rosslynrivieramall.co.ke', 'https://www.google.com/maps/search/Rosslyn+Riviera+Mall',
 NULL,
 'published', 'unverified', 'https://rosslynrivieramall.co.ke/shopping/',
 jsonb_build_object('parking', 'Yes — free, secure parking', 'supermarket', 'Chandarana Foodplus', 'restaurants', '5+', 'cinema', 'Yes — Nyumba Cinema')),

('New Muthaiga Shopping Mall', 'new-muthaiga-shopping-mall',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 (SELECT id FROM areas WHERE slug = 'muthaiga-north'),
 'Thigiri Ridge Road', NULL,
 'Neighbourhood mall on Thigiri Ridge Road in Muthaiga North, anchored by a Chandarana FoodPlus supermarket.',
 'Neighbourhood mall on Thigiri Ridge Road in Muthaiga North, anchored by a Chandarana FoodPlus supermarket, with a free outdoor children''s playground and several restaurants.',
 '+254 722 786037', NULL, 'https://www.google.com/maps/search/New+Muthaiga+Shopping+Mall',
 'Daily 8am–8pm',
 'published', 'unverified', 'https://kenya.tortoisepath.com/place/new-muthaiga-shopping-mall/',
 jsonb_build_object('parking', 'Yes — first hour free', 'supermarket', 'Chandarana FoodPlus', 'play_area', 'Yes — free outdoor playground', 'restaurants', '5+')),

('Ruaka Square', 'ruaka-square',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 (SELECT id FROM areas WHERE slug = 'ruaka'),
 'Limuru Road', 'Ruaka Square',
 'A six-storey mixed-use building on Limuru Road in Ruaka combining retail, personal-care services, and office space.',
 'A six-storey mixed-use building on Limuru Road in Ruaka combining retail, personal-care services, and office/coworking space. Public information on individual tenants is limited.',
 '+254 703 826 370', NULL, 'https://www.google.com/maps/search/Ruaka+Square',
 NULL,
 'review', 'unverified', 'https://mapcarta.com/W1307989693',
 NULL),

('The Courtyard', 'the-courtyard-gigiri',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 (SELECT id FROM areas WHERE slug = 'gigiri'),
 'Gigiri Lane, off UN Avenue', 'The Gigiri Courtyard',
 'Open-air compound of container-style restaurants, cafes and artisan shops in Gigiri, popular for weekend dining and live music.',
 'Open-air compound of container/cabin-style restaurants, cafes and artisan shops in Gigiri, popular for weekend dining, live music, and padel courts.',
 '+254 742 621 299', 'https://gigiricourtyard.four.africa/', 'https://www.google.com/maps/search/The+Courtyard+Gigiri+Nairobi',
 'Sun, Wed–Sat 7am–11pm; Mon–Tue 7am–7pm (indicative, unverified)',
 'published', 'unverified', 'https://gigiricourtyard.four.africa/',
 jsonb_build_object('supermarket', 'None — dining/lifestyle venue, not a retail mall', 'restaurants', '8+')),

('Runda Mall', 'runda-mall',
 (SELECT id FROM categories WHERE slug = 'malls'),
 (SELECT id FROM subcategories WHERE slug = 'malls-stores' AND category_id = (SELECT id FROM categories WHERE slug = 'malls')),
 (SELECT id FROM areas WHERE slug = 'runda'),
 'Kiambu Road', NULL,
 'Modern shopping mall on Kiambu Road in Runda with a Carrefour anchor, retail stores, restaurants and an artisan market area.',
 'Modern shopping mall on Kiambu Road in Runda with a Carrefour anchor, retail stores, restaurants, a kids'' zone, and a VR/gaming attraction.',
 '+254 793 273 909', 'https://rundamallke.com/', 'https://www.google.com/maps/search/Runda+Mall+Kiambu+Road',
 'Daily 9am–11pm',
 'published', 'unverified', 'https://rundamallke.com/about-runda-mall/',
 jsonb_build_object('parking', 'Yes — ample parking with highway access', 'supermarket', 'Carrefour', 'play_area', 'Yes — kids zone', 'restaurants', '8+'))

ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- Tenant directory ("Inside the Mall") — joined back to the businesses above
-- by slug, so this works whether or not the INSERT above hit ON CONFLICT.
-- =============================================================================

INSERT INTO mall_tenants (mall_id, name, category, sort_order)
SELECT b.id, t.name, t.category, t.sort_order
FROM businesses b
JOIN (VALUES
  -- Garden City Mall
  ('garden-city-mall', 'Artcaffe Coffee & Bakery', 'eat', 0),
  ('garden-city-mall', 'Java House', 'eat', 1),
  ('garden-city-mall', 'KFC', 'eat', 2),
  ('garden-city-mall', 'Pizza Inn', 'eat', 3),
  ('garden-city-mall', 'Galito''s', 'eat', 4),
  ('garden-city-mall', 'Big Square', 'eat', 5),
  ('garden-city-mall', 'Chicken Inn', 'eat', 6),
  ('garden-city-mall', 'Cold Stone Creamery', 'eat', 7),
  ('garden-city-mall', 'Mambo Italia', 'eat', 8),
  ('garden-city-mall', 'Bata', 'shop', 0),
  ('garden-city-mall', 'Miniso', 'shop', 1),
  ('garden-city-mall', 'Text Book Centre', 'shop', 2),
  ('garden-city-mall', 'Hotpoint', 'shop', 3),
  ('garden-city-mall', 'Samsung', 'shop', 4),
  ('garden-city-mall', 'Nairobi Sports House', 'shop', 5),
  ('garden-city-mall', 'Goodlife Pharmacy', 'services', 0),
  ('garden-city-mall', 'Avenue Health Care', 'services', 1),
  ('garden-city-mall', 'Deans Dental Clinic', 'services', 2),
  ('garden-city-mall', 'City Spa', 'services', 3),
  ('garden-city-mall', 'Safaricom', 'services', 4),
  ('garden-city-mall', 'Century Cinemax (IMAX)', 'entertainment', 0),
  ('garden-city-mall', 'Panda Gaming City', 'entertainment', 1),
  ('garden-city-mall', 'Kidzania Bus', 'entertainment', 2),

  -- Village Market
  ('village-market', 'Artcaffe', 'eat', 0),
  ('village-market', 'CJ''s', 'eat', 1),
  ('village-market', 'ANDO Kitchens', 'eat', 2),
  ('village-market', 'Adèle Dejak', 'shop', 0),
  ('village-market', 'Adidas', 'shop', 1),
  ('village-market', 'Anta', 'shop', 2),
  ('village-market', 'Anisuma Traders', 'shop', 3),
  ('village-market', 'Miniso', 'shop', 4),
  ('village-market', 'Home & Beyond', 'shop', 5),
  ('village-market', 'ABSA Bank', 'services', 0),
  ('village-market', 'AA Kenya', 'services', 1),
  ('village-market', 'Airtel Store', 'services', 2),
  ('village-market', 'Ozone Trampoline Park', 'entertainment', 0),
  ('village-market', 'Under The Sea (kids play)', 'entertainment', 1),
  ('village-market', 'Village Bowl', 'entertainment', 2),

  -- Ridgeways Mall
  ('ridgeways-mall', 'Artcaffe', 'eat', 0),
  ('ridgeways-mall', 'Pizza Inn', 'eat', 1),
  ('ridgeways-mall', 'Galito''s', 'eat', 2),
  ('ridgeways-mall', 'Scotchie''s Lounge', 'eat', 3),
  ('ridgeways-mall', 'Savanna Coffee Lounge', 'eat', 4),
  ('ridgeways-mall', 'Bata', 'shop', 0),
  ('ridgeways-mall', 'House of Leather & Gifts', 'shop', 1),
  ('ridgeways-mall', 'KK Optics', 'shop', 2),
  ('ridgeways-mall', 'Goodlife Pharmacy', 'services', 0),
  ('ridgeways-mall', 'SBM Bank', 'services', 1),
  ('ridgeways-mall', 'Equity Bank', 'services', 2),
  ('ridgeways-mall', 'Co-operative Bank', 'services', 3),
  ('ridgeways-mall', 'Morgan Forex Bureau', 'services', 4),
  ('ridgeways-mall', 'Auto Xpress', 'services', 5),

  -- Ciata City Mall
  ('ciata-city-mall', 'Saape Lounge', 'eat', 0),
  ('ciata-city-mall', 'Bonfire', 'eat', 1),
  ('ciata-city-mall', 'Victory Furniture', 'shop', 0),
  ('ciata-city-mall', 'Naivas', 'services', 0),
  ('ciata-city-mall', 'NCBA Bank', 'services', 1),

  -- Evergreen Centre
  ('evergreen-centre', 'Goodlife Pharmacy', 'services', 0),

  -- Mountain Mall
  ('mountain-mall', 'Naivas', 'shop', 0),
  ('mountain-mall', 'National Bank of Kenya', 'services', 0),
  ('mountain-mall', 'Co-operative Bank ATM', 'services', 1),
  ('mountain-mall', 'Equity Afia Mountain Mall (clinic)', 'services', 2),

  -- Two Rivers Mall
  ('two-rivers-mall', 'Panda Tea', 'eat', 0),
  ('two-rivers-mall', 'Boba Cafeteria', 'eat', 1),
  ('two-rivers-mall', 'Mister Wok', 'eat', 2),
  ('two-rivers-mall', 'Cinnamon Cafe', 'eat', 3),
  ('two-rivers-mall', 'Big Square', 'eat', 4),
  ('two-rivers-mall', 'Pizza Inn', 'eat', 5),
  ('two-rivers-mall', 'Java House', 'eat', 6),
  ('two-rivers-mall', 'Artcaffe', 'eat', 7),
  ('two-rivers-mall', 'Burger King', 'eat', 8),
  ('two-rivers-mall', 'Galitos', 'eat', 9),
  ('two-rivers-mall', 'Spur Steak Ranch', 'eat', 10),
  ('two-rivers-mall', 'Carrefour', 'shop', 0),
  ('two-rivers-mall', 'LC Waikiki', 'shop', 1),
  ('two-rivers-mall', 'Bata', 'shop', 2),
  ('two-rivers-mall', 'Levis', 'shop', 3),
  ('two-rivers-mall', 'Giordano', 'shop', 4),
  ('two-rivers-mall', 'Miniso', 'shop', 5),
  ('two-rivers-mall', 'Decathlon', 'shop', 6),
  ('two-rivers-mall', 'Oppo', 'shop', 7),
  ('two-rivers-mall', 'Tecno', 'shop', 8),
  ('two-rivers-mall', 'Ashley Furniture', 'shop', 9),
  ('two-rivers-mall', 'Swarovski', 'shop', 10),
  ('two-rivers-mall', 'Stanbic Bank', 'services', 0),
  ('two-rivers-mall', 'KCB Bank', 'services', 1),
  ('two-rivers-mall', 'Co-operative Bank', 'services', 2),
  ('two-rivers-mall', 'NCBA Bank', 'services', 3),
  ('two-rivers-mall', 'ABSA Bank', 'services', 4),
  ('two-rivers-mall', 'Safaricom', 'services', 5),
  ('two-rivers-mall', 'Aga Khan Hospital', 'services', 6),
  ('two-rivers-mall', 'Horton Dental Clinic', 'services', 7),
  ('two-rivers-mall', 'Lintons Beauty', 'services', 8),
  ('two-rivers-mall', 'Century Cinemax', 'entertainment', 0),
  ('two-rivers-mall', 'Funscapes ThemePark', 'entertainment', 1),
  ('two-rivers-mall', 'Madmax Karting', 'entertainment', 2),
  ('two-rivers-mall', 'Eye of Kenya Ferris wheel', 'entertainment', 3),

  -- Rosslyn Riviera Mall
  ('rosslyn-riviera-mall', 'Java House', 'eat', 0),
  ('rosslyn-riviera-mall', 'Roberto''s Cellar', 'eat', 1),
  ('rosslyn-riviera-mall', 'Roberto''s Market', 'eat', 2),
  ('rosslyn-riviera-mall', 'The Lochol', 'eat', 3),
  ('rosslyn-riviera-mall', 'Chi-Robi', 'eat', 4),
  ('rosslyn-riviera-mall', 'Chandarana Foodplus', 'shop', 0),
  ('rosslyn-riviera-mall', 'Beyond Chic', 'shop', 1),
  ('rosslyn-riviera-mall', 'Replica', 'shop', 2),
  ('rosslyn-riviera-mall', 'Flint Home Integrators', 'shop', 3),
  ('rosslyn-riviera-mall', 'Persian Carpets', 'shop', 4),
  ('rosslyn-riviera-mall', 'Ameerah Spa', 'services', 0),
  ('rosslyn-riviera-mall', 'Delish Nail Bar', 'services', 1),
  ('rosslyn-riviera-mall', 'Stuhler Orthodontics', 'services', 2),
  ('rosslyn-riviera-mall', 'Goodlife Pharmacy', 'services', 3),
  ('rosslyn-riviera-mall', 'The Nairobi Hospital (satellite)', 'services', 4),
  ('rosslyn-riviera-mall', 'Nyumba Cinema', 'entertainment', 0),

  -- New Muthaiga Shopping Mall
  ('new-muthaiga-shopping-mall', 'Suchi Obenjo Japanese Restaurant', 'eat', 0),
  ('new-muthaiga-shopping-mall', 'Clarett Lounge', 'eat', 1),
  ('new-muthaiga-shopping-mall', 'Karura Coffee House', 'eat', 2),
  ('new-muthaiga-shopping-mall', 'KFC', 'eat', 3),
  ('new-muthaiga-shopping-mall', 'Chinese Kitchen', 'eat', 4),
  ('new-muthaiga-shopping-mall', 'Chandarana FoodPlus', 'shop', 0),
  ('new-muthaiga-shopping-mall', 'Jumia mini mart', 'shop', 1),
  ('new-muthaiga-shopping-mall', 'Beacon Hope Insurance', 'services', 0),

  -- Ruaka Square
  ('ruaka-square', 'Goshen Real Estate', 'shop', 0),
  ('ruaka-square', 'Royal Smiles Clinic', 'services', 0),

  -- The Courtyard (Gigiri)
  ('the-courtyard-gigiri', 'Shokudo', 'eat', 0),
  ('the-courtyard-gigiri', 'The Daily Cafe and Bistro', 'eat', 1),
  ('the-courtyard-gigiri', 'Josephine''s Caribbean BBQ', 'eat', 2),
  ('the-courtyard-gigiri', 'Little Beirut', 'eat', 3),
  ('the-courtyard-gigiri', 'Solo Grano', 'eat', 4),
  ('the-courtyard-gigiri', 'Guacca', 'eat', 5),
  ('the-courtyard-gigiri', 'Shakespeare''s Coffee', 'eat', 6),
  ('the-courtyard-gigiri', 'NEEd Gelato', 'eat', 7),
  ('the-courtyard-gigiri', 'SD Padel Kenya', 'entertainment', 0),

  -- Runda Mall
  ('runda-mall', 'Java House', 'eat', 0),
  ('runda-mall', 'Artcaffe', 'eat', 1),
  ('runda-mall', 'German Point Restaurant', 'eat', 2),
  ('runda-mall', 'COFICAF', 'eat', 3),
  ('runda-mall', 'Nairowua', 'eat', 4),
  ('runda-mall', 'Skyview Coffee', 'eat', 5),
  ('runda-mall', 'Vivo', 'shop', 0),
  ('runda-mall', 'Felicity''s', 'shop', 1),
  ('runda-mall', 'Flawless Collection', 'shop', 2),
  ('runda-mall', 'Galaxy Runda', 'shop', 3),
  ('runda-mall', 'Optica', 'shop', 4),
  ('runda-mall', 'Samsung', 'shop', 5),
  ('runda-mall', 'Disne VR & Gaming', 'entertainment', 0)

) AS t(mall_slug, name, category, sort_order) ON b.slug = t.mall_slug;
