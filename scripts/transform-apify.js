const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, '..', 'dataset_crawler-google-places_2026-07-27_12-47-48-071.json');
const REFERENCE_FILE = path.join(__dirname, 'reference-data.json');
const CLEANED_OUT = path.join(__dirname, '..', 'data', 'cleaned.json');
const NEEDS_REVIEW_OUT = path.join(__dirname, '..', 'data', 'needs-review.json');

const CORRIDOR_TERMS = ['ridgeways', 'thindigua', 'runda', 'ruaka', 'kiambu road', 'kiambu', 'kitisuru', 'karura'];

// Google categoryName -> { category: slug, subcategory: slug|null }. null subcategory means category-only.
// Anything not in this table (or explicitly mapped to null category) is UNMAPPED.
const CATEGORY_MAP = {
  'Beauty salon': { category: 'lifestyle-wellness', subcategory: 'beauty-spas' },
  'Car dealer': { category: 'car-motor-dealers', subcategory: 'car-dealers' },
  'Restaurant': { category: 'eat-drink-stay', subcategory: 'restaurants' },
  'Auto repair shop': { category: 'auto-services', subcategory: 'auto-care-tyre' },
  'Car wash': { category: 'auto-services', subcategory: 'car-wash' },
  'Motor vehicle dealer': { category: 'car-motor-dealers', subcategory: 'car-dealers' },
  'Pharmacy': { category: 'medical-services', subcategory: 'pharmacies' },
  'Shopping mall': { category: 'malls', subcategory: 'malls-stores' },
  'Church': { category: 'faith-community', subcategory: 'churches' },
  'Home builder': { category: 'building-construction', subcategory: 'building-road-contractors' },
  'Bar & grill': { category: 'eat-drink-stay', subcategory: 'bars-clubs' },
  'Gym': { category: 'lifestyle-wellness', subcategory: 'gyms-fitness' },
  'Kindergarten': { category: 'education-childcare', subcategory: 'kindergarten-daycare' },
  'Real estate agency': { category: 'real-estate-property', subcategory: 'home-land-property-agents' },
  'Mattress store': { category: 'retail-shopping', subcategory: 'furniture-decor' },
  'Building materials supplier': { category: 'building-construction', subcategory: 'timber-building-materials' },
  'Construction company': { category: 'building-construction', subcategory: 'building-road-contractors' },
  'Hotel': { category: 'eat-drink-stay', subcategory: 'hotels-conference' },
  'Fast food restaurant': { category: 'eat-drink-stay', subcategory: 'fast-food-cafes' },
  'Spa': { category: 'lifestyle-wellness', subcategory: 'beauty-spas' },
  'Used car dealer': { category: 'car-motor-dealers', subcategory: 'car-dealers' },
  'Bed & breakfast': { category: 'eat-drink-stay', subcategory: 'airbnb-furnished-apartments' },
  'Bar': { category: 'eat-drink-stay', subcategory: 'bars-clubs' },
  'Family restaurant': { category: 'eat-drink-stay', subcategory: 'restaurants' },
  'Clothing store': { category: 'lifestyle-wellness', subcategory: 'boutiques' },
  'General store': { category: 'retail-shopping', subcategory: 'groceries-fresh-foods' },
  'Nail salon': { category: 'lifestyle-wellness', subcategory: 'beauty-spas' },
  'Fitness center': { category: 'lifestyle-wellness', subcategory: 'gyms-fitness' },
  'Stylist': { category: 'lifestyle-wellness', subcategory: 'beauty-spas' },
  'Tire shop': { category: 'auto-services', subcategory: 'auto-care-tyre' },
  'Auto body shop': { category: 'auto-services', subcategory: 'auto-care-tyre' },
  'Montessori school': { category: 'education-childcare', subcategory: 'kindergarten-daycare' },
  "Girls' high school": { category: 'education-childcare', subcategory: 'private-schools' },
  'Elementary school': { category: 'education-childcare', subcategory: 'private-schools' },
  'Industrial real estate agency': { category: 'real-estate-property', subcategory: 'home-office-agents' },
  'Hypermarket': { category: 'malls', subcategory: 'malls-stores' },
  'Furniture store': { category: 'retail-shopping', subcategory: 'furniture-decor' },
  'Grocery store': { category: 'retail-shopping', subcategory: 'groceries-fresh-foods' },
  'Auto restoration service': { category: 'auto-services', subcategory: 'auto-care-tyre' },
  'Building materials market': { category: 'building-construction', subcategory: 'timber-building-materials' },
  'General contractor': { category: 'building-construction', subcategory: 'building-road-contractors' },
  'Serviced accommodation': { category: 'eat-drink-stay', subcategory: 'airbnb-furnished-apartments' },
  'Cafe': { category: 'eat-drink-stay', subcategory: 'fast-food-cafes' },
  'Chinese restaurant': { category: 'eat-drink-stay', subcategory: 'restaurants' },
  'Aquarium shop': { category: 'home-garden', subcategory: 'pets' },
  'Homestay': { category: 'eat-drink-stay', subcategory: 'airbnb-furnished-apartments' },
  'Pet store': { category: 'home-garden', subcategory: 'pets' },
  'African restaurant': { category: 'eat-drink-stay', subcategory: 'restaurants' },
  'Steak house': { category: 'eat-drink-stay', subcategory: 'restaurants' },
  'Indian restaurant': { category: 'eat-drink-stay', subcategory: 'restaurants' },
  'Hamburger restaurant': { category: 'eat-drink-stay', subcategory: 'fast-food-cafes' },
  'Liquor store': { category: 'retail-shopping', subcategory: 'wines-spirits' },
  'Pizza restaurant': { category: 'eat-drink-stay', subcategory: 'fast-food-cafes' },
  'Veterinarian': { category: 'professional-services', subcategory: 'vet-agronomy' },
  'Barbecue restaurant': { category: 'eat-drink-stay', subcategory: 'restaurants' },
  'Hospital': { category: 'medical-services', subcategory: 'hospitals-clinics' },
  'Coffee shop': { category: 'eat-drink-stay', subcategory: 'fast-food-cafes' },
  'Education center': { category: 'education-childcare', subcategory: 'colleges-tuition' },
  'Dental clinic': { category: 'medical-services', subcategory: 'dentists' },
  'Diagnostic center': { category: 'medical-services', subcategory: 'lab-xray' },
  'Chicken restaurant': { category: 'eat-drink-stay', subcategory: 'fast-food-cafes' },
  'Quantity surveyor': { category: 'professional-services', subcategory: 'valuation-survey-engineering' },
  'Software company': { category: 'professional-services', subcategory: 'it-graphic-design' },
  'Real estate developer': { category: 'real-estate-property', subcategory: 'land-property-agents' },
  'Contractor': { category: 'building-construction', subcategory: 'building-road-contractors' },
  'Insurance broker': { category: 'finance', subcategory: 'insurance' },
  'Digital printing service': { category: 'professional-services', subcategory: 'it-graphic-design' },
  "Women's clothing store": { category: 'lifestyle-wellness', subcategory: 'boutiques' },
  'Boutique': { category: 'lifestyle-wellness', subcategory: 'boutiques' },
  'Juice shop': { category: 'eat-drink-stay', subcategory: 'fast-food-cafes' },
  'Fashion accessories store': { category: 'lifestyle-wellness', subcategory: 'boutiques' },
  'Cell phone store': { category: 'retail-shopping', subcategory: 'computers-phones' },
  'Cell phone accessory store': { category: 'retail-shopping', subcategory: 'computers-phones' },
  'Computer store': { category: 'retail-shopping', subcategory: 'computers-phones' },
  'Electronics store': { category: 'retail-shopping', subcategory: 'computers-phones' },
  'Butcher shop deli': { category: 'retail-shopping', subcategory: 'meat-supply' },
  'Convenience store': { category: 'retail-shopping', subcategory: 'groceries-fresh-foods' },
  'Religious organization': { category: 'faith-community', subcategory: 'churches' },
  'Wok restaurant': { category: 'eat-drink-stay', subcategory: 'restaurants' },
  'Night club': { category: 'eat-drink-stay', subcategory: 'bars-clubs' },
  'Prosthodontist': { category: 'medical-services', subcategory: 'dentists' },
  'Event planner': { category: 'professional-services', subcategory: 'event-organizers' },
  'Bistro': { category: 'eat-drink-stay', subcategory: 'restaurants' },
  'Parapharmacy': { category: 'medical-services', subcategory: 'pharmacies' },
  'Massage spa': { category: 'lifestyle-wellness', subcategory: 'beauty-spas' },
  'Hair salon': { category: 'lifestyle-wellness', subcategory: 'beauty-spas' },
  'Cleaners': { category: 'home-garden', subcategory: 'cleaning-services' },
  'Spa garden': { category: 'lifestyle-wellness', subcategory: 'beauty-spas' },
  'Car repair and maintenance service': { category: 'auto-services', subcategory: 'auto-care-tyre' },
  'Auto window tinting service': { category: 'auto-services', subcategory: 'auto-care-tyre' },
  'Serviced apartment': { category: 'eat-drink-stay', subcategory: 'airbnb-furnished-apartments' },
  'Carpet cleaning service': { category: 'home-garden', subcategory: 'cleaning-services' },
  'Event management company': { category: 'professional-services', subcategory: 'event-organizers' },

  // Explicitly UNMAPPED — no confident subcategory fit, do not guess.
  'Barber shop': null,
  'Gas station': null,
  'Optician': null,
  'Driving school': null,
  'Dessert shop': null,
  'Internet cafe': null,
  'Optometrist': null,
  'Business management consultant': null,
  'Repair service': null,
  'Educational institution': null,
  'Babysitter': null,
  'Cake shop': null,
  'Golf shop': null,
  'Farm': null,
  'Health consultant': null,
  'Housing society': null,
  'Manufacturer': null,
  'Architecture firm': null,
  'Photography service': null,
  'Perfume store': null,
  'Appliance store': null,
  'Kitchen supply store': null,
  'Beverage distributor': null,
  'Fish store': null,
  'Car accessories store': null,
  'Gated community': null,
  'Garden': null,
};

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normPhone(s) {
  if (!s) return null;
  const digits = String(s).replace(/[^0-9]/g, '');
  return digits.slice(-9);
}

// Reviewed and confirmed in Phase 2 (fuzzy word-overlap matching produced too many false
// positives on shared corridor/category words - e.g. "auto garage", "dental clinic", "car wash" -
// so collisions are pinned to specific scraped titles we actually looked at, not a generic heuristic).
const CONFIRMED_COLLISION_TITLES = new Set([
  'Truce Lounge & Grill',
  'Zana Wines & Spirits (Whiskey Bar and Grill)',
  'The Fuse Club',
]);

function inCorridor(rec) {
  const haystack = [rec.address, rec.neighborhood, rec.street, rec.city].filter(Boolean).join(' ').toLowerCase();
  return CORRIDOR_TERMS.some(term => haystack.includes(term));
}

function findArea(rec, areas) {
  const haystack = [rec.neighborhood, rec.address, rec.street].filter(Boolean).join(' ').toLowerCase();
  for (const area of areas) {
    const name = area.slug.replace(/-/g, ' ');
    if (haystack.includes(name)) return area.id;
  }
  return null;
}

function formatOpeningHours(openingHours) {
  if (!openingHours || !openingHours.length) return null;
  return openingHours.map(h => `${h.day.slice(0, 3)} ${h.hours}`).join(' | ');
}

// Low-confidence candidates from Phase 2 (Goodlife Pharmacy branches, Servisus/VIP Auto Spa) import
// as separate businesses per approval - different branches/entities, not true duplicates.
function findCollision(rec, existingBusinesses) {
  if (CONFIRMED_COLLISION_TITLES.has(rec.title)) {
    return { existing: '(see Phase 2 review)', reason: 'confirmed duplicate in Phase 2 review' };
  }
  const rp = normPhone(rec.phoneUnformatted || rec.phone);
  if (rp) {
    for (const ex of existingBusinesses) {
      const exPhone = normPhone(ex.phone);
      if (exPhone && rp === exPhone) {
        return { existing: ex.name, reason: 'phone match' };
      }
    }
  }
  return null;
}

function main() {
  const ref = loadJson(REFERENCE_FILE);
  const categoryBySlug = new Map(ref.categories.map(c => [c.slug, c.id]));
  const subcategoryByKey = new Map(ref.subcategories.map(s => [`${s.category_slug}::${s.slug}`, s.id]));

  const raw = loadJson(SOURCE_FILE);

  // Dedupe by placeId
  const seenPlaceIds = new Set();
  const deduped = [];
  for (const rec of raw) {
    if (seenPlaceIds.has(rec.placeId)) continue;
    seenPlaceIds.add(rec.placeId);
    deduped.push(rec);
  }

  // Corridor filter
  const kept = deduped.filter(inCorridor);

  const usedSlugs = new Set(ref.existingBusinesses.map(b => b.slug));
  const cleaned = [];
  const needsReview = [];
  const perCategoryCounts = {};

  for (const rec of kept) {
    const collision = findCollision(rec, ref.existingBusinesses);
    const mapping = Object.prototype.hasOwnProperty.call(CATEGORY_MAP, rec.categoryName)
      ? CATEGORY_MAP[rec.categoryName]
      : null;

    if (collision) {
      needsReview.push({ title: rec.title, placeId: rec.placeId, reason: 'collision', detail: collision });
      continue;
    }
    if (!mapping) {
      needsReview.push({ title: rec.title, placeId: rec.placeId, reason: 'unmapped_category', categoryName: rec.categoryName });
      continue;
    }

    const categoryId = categoryBySlug.get(mapping.category);
    const subcategoryId = subcategoryByKey.get(`${mapping.category}::${mapping.subcategory}`);

    let baseSlug = slugify(rec.title);
    let slug = baseSlug;
    let n = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${n}`;
      n++;
    }
    usedSlugs.add(slug);

    const areaId = findArea(rec, ref.areas);

    cleaned.push({
      name: rec.title,
      slug,
      category_id: categoryId,
      subcategory_id: subcategoryId || null,
      area_id: areaId,
      address_line: rec.address || null,
      phone: rec.phoneUnformatted || rec.phone || null,
      website: rec.website || null,
      google_maps_url: rec.url || null,
      google_place_id: rec.placeId,
      latitude: rec.location ? rec.location.lat : null,
      longitude: rec.location ? rec.location.lng : null,
      opening_hours_text: formatOpeningHours(rec.openingHours),
      google_rating: rec.totalScore ?? null,
      google_review_count: rec.reviewsCount ?? null,
      source_url: rec.url || null,
      status: 'draft',
      verification_status: 'unverified',
      _cover_image_url: rec.imageUrl || null,
      _google_category: rec.categoryName,
    });

    perCategoryCounts[mapping.category] = (perCategoryCounts[mapping.category] || 0) + 1;
  }

  fs.mkdirSync(path.dirname(CLEANED_OUT), { recursive: true });
  fs.writeFileSync(CLEANED_OUT, JSON.stringify(cleaned, null, 2));
  fs.writeFileSync(NEEDS_REVIEW_OUT, JSON.stringify(needsReview, null, 2));

  console.log('=== TRANSFORM SUMMARY ===');
  console.log('Source records:', raw.length);
  console.log('After placeId dedupe:', deduped.length);
  console.log('In corridor:', kept.length);
  console.log('Ready to insert (cleaned.json):', cleaned.length);
  console.log('Needs review (needs-review.json):', needsReview.length);
  const unmappedCount = needsReview.filter(r => r.reason === 'unmapped_category').length;
  const collisionCount = needsReview.filter(r => r.reason === 'collision').length;
  console.log('  - unmapped category:', unmappedCount);
  console.log('  - collision:', collisionCount);
  console.log('');
  console.log('Per-category counts (ready to insert):');
  Object.entries(perCategoryCounts).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${n}\t${c}`));
  console.log('');
  console.log('=== 5 SAMPLE CLEANED RECORDS ===');
  cleaned.slice(0, 5).forEach(r => console.log(JSON.stringify(r, null, 2)));
}

main();
