## Kiambu Road Explorer — Client Overview

**Environment:** Next.js 16 · Supabase (Postgres + Auth + Storage) · Tailwind · shadcn/ui · Framer Motion  
**Scope:** MVP directory + demo content for the Kiambu Road corridor

---

### 1. What’s Live in the MVP

- **Public pages**
  - **Homepage**: Search hero, category grid, animated stats, featured businesses carousel.
  - **Directory listing**:
    - `/directory` – all main categories (Eat, Drink & Stay, Health & Wellness, etc.).
    - `/directory/[category]` – cards for businesses in that category, with subcategory filters and area filters.
    - `/directory/business/[slug]` – full profile pages with description, contact details, price range, Google rating, map snapshot and related businesses.
  - **Search**:
    - `/search` – keyword + filters (category, area, minimum rating) driven from Supabase.
  - **Travel Enquiry**:
    - `/travel` – simple travel enquiry form (hotels, car hire, day trips, etc.) posting into the backend, with confirmation state.

- **Admin**
  - Secure admin panel at `/admin` (Supabase Auth + admin roles).
  - Manage businesses, categories, submissions, journal articles, jobs, prices and messages.
  - Admins can edit any seeded listing (text, flags, later also images).

---

### 2. Demo Data for the Corridor

- **Seeded businesses (from curated research)**
  - **Total:** 76 demo listings, all along Kiambu Road / Kiambu corridor and connected bypass nodes.
  - **By main category:**
    - Eat, Drink & Stay – 30
    - Health & Wellness – 11
    - Education & Childcare – 9
    - Retail & Shopping – 9
    - Automotive – 8
    - Leisure & Outdoors – 9
  - Each listing includes:
    - Name, category & subcategory, area (e.g. Ridgeways, Thindigua, Ruaka, Kiambu Town).
    - Short description + full description.
    - Phone, WhatsApp (where available), website, Google Maps URL.
    - Opening-hours text, price range \($–$$$$\), Google rating and review count where known.
    - Flags: **featured**, **verified**, **status** (published) and **verification_status**.

- **How they appear in the app**
  - Home search and `/search` now return real results from Supabase.
  - Category pages render real cards and accurate counts.
  - Business profile pages show correct details, pricing band and ratings.
  - Featured carousel on the homepage is powered by `featured = true` + rating.

---

### 3. Visuals & Default Images

- **Design system**
  - Tailored to Kiambu greenery: soft greens, warm neutrals, rounded cards and subtle shadows.
  - Components built with `shadcn/ui` and animated with Framer Motion.

- **Images**
  - When a business has no uploaded photos, we show a **relevant Unsplash cover image** based on its category:
    - Eat, Drink & Stay → restaurant interior
    - Health & Wellness → modern hospital corridor
    - Education & Childcare → classroom in Kenya
    - Retail & Shopping → supermarket aisle
    - Automotive → garage / service vibe (currently same scenic fallback as leisure)
    - Leisure & Outdoors → golf / green landscape
  - This ensures every card and profile has a strong visual without blocking on photography.
  - In the future, you can replace these with real photos via the admin (Supabase Storage).

---

### 4. Data Management & Safety

- **Tech foundation**
  - Structured Postgres schema in Supabase, with row-level security and audit fields.
  - Next.js App Router, ISR (`revalidate`) and server+client components used appropriately.

- **How demo data is tagged**
  - All demo businesses have `source_note = 'demo-seed-2025'` in the database.
  - This allows us to:
    - Filter demo records for review.
    - Deactivate or delete them in a single, safe operation once fully verified data is ready.

- **Admin controls**
  - Admins can:
    - Toggle **featured / verified / status** (published vs draft) per listing.
    - Edit text fields (descriptions, phone, hours) live.
    - Use the same flows later for real data — no code changes required.

---

### 5. Next Steps (Suggested)

- **Content**
  - Fill in real photography for key anchor listings (Windsor, Two Rivers, main hospitals, etc.).
  - Add first 3–5 editorial articles in the Lifestyle Journal (health, leisure, business notes).

- **Data**
  - Work category-by-category with your team to:
    - Confirm which demo listings are correct.
    - Mark them as **verified** and update important details.
    - Add any missing businesses that are critical on the ground.

- **Experience**
  - Iterate on filters (e.g. “family friendly”, “open now”), richer maps, and sponsorship slots once we have real usage feedback.

This document is meant to give you a clear picture of **what is built and demo-ready today**, and how we’ll smoothly graduate from curated demo data to fully verified listings without rebuilding the platform.

