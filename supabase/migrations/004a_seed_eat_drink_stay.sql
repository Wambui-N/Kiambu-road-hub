-- =============================================================================
-- Kiambu Road Hub — Demo Seed: EAT, DRINK & STAY
-- =============================================================================
-- Run AFTER 003_seed_reference_data.sql.
-- All rows are tagged via businesses.source_note = 'demo-seed-2025' (set by
-- migration 005_add_source_note_to_businesses.sql which runs after this file).
-- Safe to re-run: ON CONFLICT (slug) DO NOTHING on all inserts.
-- To remove all demo rows:
--   DELETE FROM businesses WHERE source_note = 'demo-seed-2025';
-- =============================================================================

-- ─── HELPERS ────────────────────────────────────────────────────────────────
-- Re-usable inline sub-selects used throughout this file:
--   category: (select id from categories where slug = 'eat-drink-stay')
--   subcategory: (select s.id from subcategories s
--                  join categories c on s.category_id = c.id
--                  where c.slug = 'eat-drink-stay' and s.slug = '<sub-slug>')
--   area: (select id from areas where slug = '<area-slug>')
-- =============================================================================


-- =============================================================================
-- HOTELS & CONFERENCE
-- =============================================================================

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  phone, whatsapp, email, website,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, source_url, published_at
) values (
  'Windsor Golf Hotel & Country Club',
  'windsor-golf-hotel',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'hotels-conference'),
  (select id from areas where slug = 'ridgeways'),
  'Kigwa Lane, Ridgeways, off Kiambu Road, Nairobi 00100',
  'Iconic 4-star resort on a championship 18-hole golf course, 15 min from the CBD. Rooms, spa, pool, conference and fine dining.',
  'Nairobi''s iconic 4-star resort set on a championship 18-hole golf course, just 15 minutes north of the CBD. Features 115+ rooms across deluxe doubles, studio suites and cottages, a heated swimming pool, tennis and squash courts, a fully equipped gym, spa, and multiple dining outlets including a bar and fine-dining restaurant. Popular for corporate conferences, weddings, and weekend getaways.',
  '+254722203361', '+254722203361', 'reservations@windsor.co.ke', 'https://windsorgolfresort.com',
  '24 hours', '$$$$'::price_range,
  4.2, null,
  true, true, 'verified'::verification_status,
  'published'::content_status, 'https://windsorgolfresort.com', now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  website, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, source_url, published_at
) values (
  'Elysian Resort',
  'elysian-resort',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'hotels-conference'),
  (select id from areas where slug = 'runda'),
  'Junction of Northern Bypass and Kiambu Road, Runda, Nairobi',
  'Serene 5-acre oasis owned by the Catholic Diocese. 42 rooms, pool, fitness centre, and the Sacred Heart restaurant.',
  'A serene 5-acre oasis owned by the Catholic Diocese of Murang''a, nestled in the leafy Runda suburb. Offers 42 elegantly designed rooms, an outdoor swimming pool, fitness center, and the signature Sacred Heart restaurant serving diverse cuisine. Perfect for spiritual retreats, family getaways, and corporate off-sites in a tranquil setting.',
  'https://elysian-resort.com', '24 hours', '$$$'::price_range,
  4.4, null,
  true, false, 'unverified'::verification_status,
  'published'::content_status, 'https://elysian-resort.com', now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  website, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, source_url, published_at
) values (
  'Hotel Tobriana Ridgeways',
  'hotel-tobriana-ridgeways',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'hotels-conference'),
  (select id from areas where slug = 'ridgeways'),
  'Jacaranda Close, Ridgeways, off Kiambu Road, Nairobi',
  'Boutique hotel in lush Ridgeways gardens with a pool, conference hall, and exceptional food. Great for weekends and intimate corporate meetings.',
  'A discreetly luxurious boutique hotel tucked along a private road in Ridgeways. Set in lush gardens with a swimming pool, gazebos for private group sessions, and a conference hall. Known for exceptional food, a warm and welcoming atmosphere, and a sense of undisturbed nature just minutes from the busy Kiambu Road. Great for family weekends, birthday celebrations, and intimate corporate meetings.',
  'https://hoteltobriana.com', '24 hours', '$$$'::price_range,
  4.5, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, 'https://hoteltobriana.com', now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  phone, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Glee Nairobi',
  'glee-nairobi',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'hotels-conference'),
  (select id from areas where slug = 'ridgeways'),
  'Off Kiambu Road, Nairobi 00100',
  'Modern hotel with gym, conference facilities, restaurant and bar. Well-reviewed for professional service standards.',
  'A modern, stylish hotel in the Kiambu Road vicinity offering comfortable rooms, a well-equipped gym, conference facilities, restaurant and bar. Well-reviewed by business and leisure travellers for its professional service standards and convenient access to the Northern Nairobi business corridor.',
  '+254709785100', '24 hours', '$$$'::price_range,
  4.3, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Ridgeways Park Hotel',
  'ridgeways-park-hotel',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'hotels-conference'),
  (select id from areas where slug = 'ridgeways'),
  'Kiambu Road, Ridgeways',
  'Mid-range hotel in the heart of Ridgeways. Clean rooms, free Wi-Fi and private parking. Popular for short stays and business visits.',
  'A conveniently located mid-range hotel in the heart of Ridgeways. Offers clean and comfortable rooms with free Wi-Fi and private parking, making it a popular choice for both short stays and longer business visits along the Kiambu Road corridor.',
  '24 hours', '$$'::price_range,
  3.9, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Phoenicia Hotel Kiambu',
  'phoenicia-hotel-kiambu',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'hotels-conference'),
  (select id from areas where slug = 'kiambu-town'),
  'Kiambu Town, Kiambu County',
  '37-room hotel in Kiambu Town with two restaurants and conference facilities. Solid value for money near the County headquarters.',
  'A well-regarded hotel in Kiambu Town featuring 37 rooms, two restaurants, and conference facilities. A favourite among visitors to the Kiambu County headquarters area. Offers solid value for money with reliable hospitality standards.',
  '24 hours', '$$'::price_range,
  3.8, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;


-- =============================================================================
-- RESTAURANTS
-- =============================================================================

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  website, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, source_url, published_at
) values (
  'Artcaffe Ridgeways Mall',
  'artcaffe-ridgeways-mall',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'restaurants'),
  (select id from areas where slug = 'ridgeways'),
  'Ridgeways Mall, Kiambu Road, Ridgeways',
  'Nairobi''s beloved café-restaurant chain. Exceptional coffee, all-day menu, and great brunch. Consistently rated top dining in Ridgeways.',
  'One of Nairobi''s most beloved café-restaurant chains, Artcaffe at Ridgeways Mall is known for exceptional attention to plating, freshly brewed Kenyan and Ethiopian highland coffee, and a diverse all-day menu. Ideal for breakfast meetings, family lunches, and relaxed weekend brunches. Consistently rated among the top dining spots in Ridgeways for its quality and ambiance.',
  'https://artcaffe.co.ke', '7:30 AM – 10:00 PM daily', '$$$'::price_range,
  4.7, null,
  true, true, 'verified'::verification_status,
  'published'::content_status, 'https://artcaffe.co.ke', now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  phone, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'The Vineyard Ridgeways',
  'the-vineyard-ridgeways',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'restaurants'),
  (select id from areas where slug = 'ridgeways'),
  'Kiambu Road, Ridgeways, just after Ciata Mall',
  'Beloved garden restaurant with lush greenery, premium cocktails, and live band every Wednesday. Happy hour daily 2–7 PM.',
  'A beloved bar and garden restaurant in Ridgeways surrounded by lush greenery, earning a loyal following for its fresh, well-prepared food, premium cocktails, and live band performances every Wednesday. Happy hour on cocktails daily from 2 PM to 7 PM. A perfect spot for dates, group celebrations, or a relaxed evening soaking up the natural ambiance. Budget approximately KES 1,000–1,800 per person.',
  '+254705919706', '7:30 AM – 11:00 PM daily', '$$'::price_range,
  4.4, 800,
  true, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Pelikan Village Thindigua',
  'pelikan-village-thindigua',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'restaurants'),
  (select id from areas where slug = 'thindigua'),
  'Thindigua, close to Quickmart, off Kiambu Road',
  'Family-friendly garden restaurant in Thindigua. Tasty food, fresh juices, and a welcoming atmosphere for children and adults. ~KES 1,000/person.',
  'A family-friendly garden restaurant in Thindigua, widely known for tasty food, fresh juices, and a welcoming atmosphere ideal for both children and adults. With over 1,200 Google reviews and a rating of 4.2 stars, Pelikan Village has become a community favourite for affordable, quality meals averaging around KES 1,000 per person.',
  'Daily', '$'::price_range,
  4.2, 1200,
  true, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Ramsha Vibes Grill',
  'ramsha-vibes-grill',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'restaurants'),
  (select id from areas where slug = 'karura'),
  'Kiambu Road, past DCI Headquarters, opposite Karura Gate B',
  'Popular nyama choma and grill spot with live bands. Well-charred meat served with fresh kachumbari. Authentic Kenyan BBQ experience.',
  'A popular nyama choma and grill spot renowned among locals for its well-charred meat served with fresh kachumbari. Ramsha Vibes brings in live bands and musicians to keep guests entertained as they dine, creating an energetic atmosphere that keeps patrons coming back. A true neighbourhood favourite with an authentic Kenyan BBQ experience.',
  'Daily', '$$'::price_range,
  4.3, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Hog''s Paradise Thindigua',
  'hogs-paradise-thindigua',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'restaurants'),
  (select id from areas where slug = 'thindigua'),
  'Kiambu Road, Thindigua, near Quickmart',
  'Trendy café-restaurant celebrated for finger-licking chicken wings, ribs, and rolls at very reasonable prices.',
  'A trendy and affordable café-restaurant in Thindigua celebrated for its finger-licking chicken wings, ribs, and rolls. Hog''s Paradise attracts a loyal following for the quality of its food and skilled chefs who consistently deliver high-quality meals at very reasonable prices.',
  '9:00 AM – 10:00 PM daily', '$$'::price_range,
  4.4, 80,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Jitrit Restaurant',
  'jitrit-restaurant',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'restaurants'),
  (select id from areas where slug = 'runda'),
  'Kiambu Road, inside Wadi Degla Club, Runda',
  'Spacious, well-decorated restaurant inside the Wadi Degla sports complex. Diverse menu, quick service, calm and serene setting.',
  'A spacious, well-decorated restaurant inside the Wadi Degla sports complex on Kiambu Road. Jitrit is lauded for its diverse menu, attentive and quick service, and clean, comfortable dining environment. The calm and serene setting makes it popular with sports enthusiasts and families alike.',
  'Daily', '$$'::price_range,
  4.8, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Truce Lounge & Grill',
  'truce-lounge-grill',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'restaurants'),
  (select id from areas where slug = 'runda'),
  'Kiambu Road, next to Runda Entrance',
  'Vibrant lounge and grill with themed nights — Reggae, Saturday Shutdown, Karaoke Tuesdays. Quality grills and cocktails.',
  'A vibrant lounge and grill next to the Runda junction offering themed entertainment nights including Reggae Nights, Saturday Shutdown, and Karaoke Tuesdays. Serves quality grilled food paired with a wide selection of drinks and cocktails. A great spot for late-night dining and entertainment in the Runda–Kiambu Road neighbourhood.',
  'Daily evenings', '$$'::price_range,
  4.4, 450,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  phone, email, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Golden Eagle Spur Kiambu Road',
  'golden-eagle-spur-kiambu',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'restaurants'),
  (select id from areas where slug = 'kiambu-town'),
  'Kiambu Road 00900, Kiambu',
  'Spur Steak Ranches franchise. Signature flame-grilled steaks, ribs, and burgers in a family-friendly Western-themed setting.',
  'Part of the well-known Spur Steak Ranches chain, Golden Eagle Spur on Kiambu Road serves signature flame-grilled steaks, ribs, burgers, and salads in a family-friendly Western-themed setting. A consistently popular choice for steak lovers and families looking for a quality sit-down meal along Kiambu Road.',
  '+254791009717', 'golden.eagle@loswanihotels.co.ke', 'Mon–Sun 7:30 AM – 11:00 PM', '$$$'::price_range,
  4.1, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;


-- =============================================================================
-- FAST FOOD & CAFES
-- =============================================================================

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  website, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, source_url, published_at
) values (
  'Java House Ciata City Mall',
  'java-house-ciata-city-mall',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'fast-food-cafes'),
  (select id from areas where slug = 'ridgeways'),
  'Ciata City Mall, Ridgeways, Kiambu Road',
  'Nairobi''s iconic all-day dining chain. Freshly brewed coffee, full breakfast, pastries, sandwiches, and free WiFi.',
  'Nairobi''s iconic all-day dining and coffee chain. The Ciata Mall branch serves freshly brewed coffee, full breakfast, pastries, sandwiches, and hearty main meals in a bright, comfortable setting with free WiFi. A go-to for morning coffee, working lunches, and casual meetings.',
  'https://javahouseafrica.com', '7:00 AM – 10:00 PM daily', '$$'::price_range,
  4.6, null,
  true, true, 'verified'::verification_status,
  'published'::content_status, 'https://javahouseafrica.com', now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  website, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, source_url, published_at
) values (
  'KFC Fourways Junction',
  'kfc-fourways-junction',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'fast-food-cafes'),
  (select id from areas where slug = 'ridgeways'),
  'Fourways Junction, Kiambu Road',
  'International fried chicken chain serving the busy Fourways Junction. Full KFC menu with dine-in and takeaway.',
  'The popular international fried chicken chain with a dedicated branch serving the busy Fourways Junction on Kiambu Road. Offers the full KFC menu including the signature Original Recipe chicken, Zinger burgers, Streetwise meals, and sides. Dine-in and takeaway available.',
  'https://kfc.co.ke', '9:00 AM – 11:00 PM daily', '$'::price_range,
  3.8, null,
  false, true, 'verified'::verification_status,
  'published'::content_status, 'https://kfc.co.ke', now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Artcaffe Shell Windsor',
  'artcaffe-shell-windsor',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'fast-food-cafes'),
  (select id from areas where slug = 'ridgeways'),
  'Shell Petrol Station, Windsor/Kiambu Road area',
  'Artcaffe drive-through at Shell Windsor. Quality coffee, pastries, and quick bites on the go for commuters.',
  'A conveniently located Artcaffe outlet at the Shell Windsor petrol station, popular with commuters and residents picking up quality coffee, pastries, and quick bites on the go. One of the few quality drive-through café options along the Kiambu Road corridor.',
  'Daily', '$$$'::price_range,
  4.4, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  phone, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Saape Lounge Ciata City Mall',
  'saape-lounge-ciata-mall',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'fast-food-cafes'),
  (select id from areas where slug = 'ridgeways'),
  'Ciata City Mall, Kiambu Road, Ridgeways',
  'Highly-rated lounge and café at Ciata Mall. Exquisite atmosphere, diverse drinks menu, and continental meals.',
  'A highly-rated lounge and café within Ciata City Mall with a stellar reputation for its exquisite atmosphere, diverse drinks menu, and continental meals. With multiple branches across Nairobi, the Ridgeways location at Ciata Mall is among its most popular, offering a refined environment for coffee, cocktails, and casual dining throughout the day.',
  '+254740420824', 'Daily', '$$'::price_range,
  4.5, 202,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Fisherman''s Grill Thindigua',
  'fishermans-grill-thindigua',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'fast-food-cafes'),
  (select id from areas where slug = 'thindigua'),
  'Thindigua Highway, Kiambu Road',
  'Popular grill café specialising in fresh grilled fish, seafood, and meat in a relaxed outdoor setting.',
  'A popular grill café along Thindigua Highway specialising in fresh grilled fish, seafood, and meat dishes in a relaxed outdoor setting. A favourite among residents of Thindigua and surroundings looking for affordable, freshly prepared grilled meals.',
  'Daily', '$$'::price_range,
  4.0, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;


-- =============================================================================
-- BARS & CLUBS
-- =============================================================================

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  phone, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Whisky River Lounge',
  'whisky-river-lounge',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'bars-clubs'),
  (select id from areas where slug = 'ridgeways'),
  'Kiambu Road, Ridgeways',
  'The reigning late-night favourite along Kiambu Road with 2,700+ reviews. Excellent music, vibrant atmosphere, wide range of drinks.',
  'The reigning late-night favourite along Kiambu Road, Whisky River Lounge boasts over 2,700 Google reviews — a testament to its enduring popularity. Known for excellent music, a vibrant atmosphere, and a wide range of drinks, it draws a steady crowd from Thindigua, Ridgeways, and Runda every evening. The extended hours make it the area''s number-one destination for those seeking a lively nightlife experience.',
  '+254725104249', 'Mon–Fri 5:00 PM – 5:00 AM | Sat–Sun 2:00 PM – 5:00 AM', '$$'::price_range,
  4.3, 2713,
  true, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  phone, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Columbiana Lounge Ridgeways',
  'columbiana-lounge-ridgeways',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'bars-clubs'),
  (select id from areas where slug = 'ridgeways'),
  'Kiambu Road, opposite Whisky River, Ridgeways',
  'Ridgeways go-to sports bar and grill. Large screens for all major sporting events, diverse food and drinks menu.',
  'Ridgeways'' go-to sports bar and grill, Columbiana Lounge is a firm favourite among sports fans on Kiambu Road. Large screens broadcast all major sporting events, complemented by a diverse food and drinks menu. The prime location and long opening hours make it a convenient and lively gathering point for residents from morning through to the early hours.',
  '+254720674444', 'Mon–Sat 7:00 AM – 3:00 AM | Sun 7:00 AM – 12:00 AM', '$$'::price_range,
  4.3, 185,
  true, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Billionaire Club Thindigua',
  'billionaire-club-thindigua',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'bars-clubs'),
  (select id from areas where slug = 'thindigua'),
  'Thindigua, Kiambu Road',
  'One of Nairobi''s largest nightclubs. Capacity 1,000+, illuminated dance hall, outdoor pool, full bar, and extensive African menu.',
  'One of Nairobi''s largest and most extravagant nightclubs, with a capacity exceeding 1,000 guests. Features a magnificently lit dance hall, an outdoor swimming pool, a fully stocked bar with an extensive selection of wines, African beers, and premium spirits, plus an extensive African menu. World-class customer service and generous parking.',
  'Evenings & weekends', '$$$'::price_range,
  4.1, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  website, opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, source_url, published_at
) values (
  'Moran Lounge Thindigua',
  'moran-lounge-thindigua',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'bars-clubs'),
  (select id from areas where slug = 'thindigua'),
  'Off Kiambu Road, Thindigua',
  'Vibrant garden bar hosting major events including Dohty Family reggae concerts. Gym, kids'' play area, pool, restaurant on site.',
  'A vibrant garden bar and restaurant that doubles as a nightclub for major events. Moran Lounge is described as "an oasis of entertainment" hosting major events including Dohty Family reggae concerts. Uniquely combines a gym, kids'' play area, and swimming pool with its bar and restaurant offering, making it suitable for the whole family by day and a lively entertainment hub by night.',
  'https://moranlounge.co.ke', 'Daily', '$$'::price_range,
  4.2, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, 'https://moranlounge.co.ke', now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'The Walkabout Pub Karura',
  'the-walkabout-pub-karura',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'bars-clubs'),
  (select id from areas where slug = 'karura'),
  'Along Kiambu Road, near Karura Forest entrance',
  'Relaxed nature-inspired pub near Karura Forest. Organic outdoor seating surrounded by greenery — ideal for a quiet drink.',
  'A relaxed, nature-inspired late-night bar and restaurant nestled near the Karura Forest entrance on Kiambu Road. Beloved for its organic, natural ambiance with outdoor seating surrounded by greenery. A great contrast to the louder clubs in the area — ideal for those who prefer a quiet drink in a calming, earthy setting.',
  'Evenings – late', '$$'::price_range,
  4.2, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Zana Wine & Spirits Bar',
  'zana-wine-spirits-bar',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'bars-clubs'),
  (select id from areas where slug = 'thindigua'),
  'Thindigua, Kiambu Road area',
  'Curated wine and spirits bar in Thindigua. Indoor and outdoor seating, grilled meat with ugali, and home delivery across Ridgeways and Runda.',
  'A highly-regarded wine and spirits bar in Thindigua offering a curated selection of wines and spirits alongside freshly grilled meat served with ugali. Features both indoor and outdoor sitting areas, and provides home delivery services across Thindigua, Ridgeways, and Runda. Popular for its top-notch drink selection and convenient delivery.',
  'Daily', '$$'::price_range,
  4.3, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Fuse Club & Grill Ridgeways',
  'fuse-club-grill-ridgeways',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'bars-clubs'),
  (select id from areas where slug = 'ridgeways'),
  'Kiambu Road, Ridgeways',
  'Club and high-end grill with live weekend performances. Drive-through, dine-in, and home/office delivery available.',
  'A club and high-end grill on Kiambu Road that combines quality grilled food with a full nightlife entertainment experience. Fuse Club hosts local artists for live performances, especially on weekends, and offers drive-through, dine-in, and home/office delivery services. Known for its exquisite ambiance and reasonable prices for the quality on offer.',
  'Daily', '$$'::price_range,
  4.2, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;


-- =============================================================================
-- AIRBNB & FURNISHED APARTMENTS
-- =============================================================================

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  featured, verified, verification_status,
  status, published_at
) values (
  'Greenzone Apartments Thindigua',
  'greenzone-apartments-thindigua',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'airbnb-furnished-apartments'),
  (select id from areas where slug = 'thindigua'),
  'Thindigua Green Zone, off Kiambu Road, near Quickmart',
  'Premium furnished studio and 1BR apartments in Thindigua. Pool access, free WiFi, balconies with garden views. From KES 2,500/night.',
  'A premium fully furnished apartment complex in the sought-after Green Zone area of Thindigua. Multiple units available including studio and 1-bedroom apartments, each with swimming pool access, free WiFi, balconies with garden views, and fully-equipped kitchens. Walking distance from Quickmart Thindigua and other key amenities. Popular with both short-stay visitors and extended corporate stays.',
  '24 hours (self-check-in)', '$$'::price_range,
  true, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  featured, verified, verification_status,
  status, published_at
) values (
  'Deliza Haven Kiambu Road',
  'deliza-haven-kiambu-road',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'airbnb-furnished-apartments'),
  (select id from areas where slug = 'ridgeways'),
  'Kiambu Road, Ridgeways area',
  'Stylish 1BR apartment with rooftop pool, 43-inch Smart TV with Netflix, and 30 Mbps WiFi. From KES 3,500/night.',
  'A stylish 1-bedroom apartment along Kiambu Road offering a rooftop pool, 43-inch Smart TV with Netflix, and 30 Mbps WiFi. Fully equipped kitchen and a cozy living space make this ideal for business travellers, couples, and long-stay guests. Minutes from Nairobi CBD with a peaceful residential vibe.',
  '24 hours (self-check-in)', '$$'::price_range,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  featured, verified, verification_status,
  status, published_at
) values (
  'The Nook Studio Thindigua',
  'the-nook-studio-thindigua',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'airbnb-furnished-apartments'),
  (select id from areas where slug = 'thindigua'),
  'Heart of Thindigua, just off Kiambu Road',
  'Cosy minimalist studio in Thindigua. Orthopedic bed, smart TV, modern kitchenette, stunning upper-floor views. From KES 1,500/night.',
  'A cosy minimalist studio in the heart of Thindigua designed for work trips, leisurely getaways, and urban adventures. Features an orthopedic bed, smart TV, modern kitchenette, blackout curtains, and breathtaking views from an upper floor. A perfectly curated home-away-from-home for solo travellers and couples seeking comfort on a budget.',
  '24 hours (self-check-in)', '$'::price_range,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  featured, verified, verification_status,
  status, published_at
) values (
  'Runda Gated Estate 3BR',
  'runda-gated-estate-3br',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'airbnb-furnished-apartments'),
  (select id from areas where slug = 'runda'),
  'Blue Zone Gated Estate, near Two Rivers Mall & Ciata Mall, Kiambu Road',
  'Spacious 3BR furnished bungalow in a secure UN Blue Zone estate. Private garden, pool access, 2 parking slots. From KES 7,000/night.',
  'A spacious 3-bedroom furnished bungalow in a secure UN Blue Zone gated estate. Features two parking slots, a small private garden, and access to shared estate amenities including a swimming pool. Only 20 minutes to the CBD and 40 minutes to JKIA. Walking distance to Two Rivers Mall, Ciata Mall, and all key facilities on Kiambu Road. Ideal for families, diplomatic visitors, and premium corporate stays.',
  '24 hours (self-check-in)', '$$$'::price_range,
  true, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;

insert into businesses (
  name, slug, category_id, subcategory_id, area_id,
  address_line, short_description, description,
  opening_hours_text, price_range,
  google_rating, google_review_count,
  featured, verified, verification_status,
  status, published_at
) values (
  'Siena Suites Kitisuru',
  'siena-suites-kitisuru',
  (select id from categories where slug = 'eat-drink-stay'),
  (select s.id from subcategories s join categories c on s.category_id = c.id
   where c.slug = 'eat-drink-stay' and s.slug = 'airbnb-furnished-apartments'),
  (select id from areas where slug = 'kitisuru'),
  'Kiambu Road, Kitisuru area, near Tsavo Sunset',
  'Well-appointed suites with pool, 24-hr security, elevator, and on-site restaurant. From KES 3,000/night.',
  'Well-appointed furnished suites in a quiet residential setting along Kiambu Road. Features a swimming pool, 24-hour security, elevator access, and a restaurant on-site. Conveniently located 6.7 miles from Nairobi National Museum, making it accessible to both city attractions and Kiambu Road amenities.',
  '24 hours (self-check-in)', '$$'::price_range,
  4.3, null,
  false, false, 'unverified'::verification_status,
  'published'::content_status, now()
) on conflict (slug) do nothing;
