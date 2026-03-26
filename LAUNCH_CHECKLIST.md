# Kiambu Road Explorer — Pre-Launch Checklist

A structured checklist to run through before making the site publicly accessible.

---

## 1. Database Setup

- [ ] Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL editor
- [ ] Run `supabase/migrations/002_storage.sql` in Supabase SQL editor
- [ ] Run `supabase/migrations/003_seed_reference_data.sql` in Supabase SQL editor
- [ ] Verify all 14 categories appear in Supabase → Table Editor → categories
- [ ] Verify all 10 areas appear in areas table
- [ ] Verify all 11 journal sections appear in journal_sections table
- [ ] Create first admin user: Supabase → Authentication → Users → Create User
- [ ] Copy the user's UUID and run:
  ```sql
  INSERT INTO admin_roles (user_id, role) VALUES ('<your-uuid>', 'super_admin');
  ```

## 2. Environment Variables

- [ ] `.env.local` has real `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `.env.local` has real `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `.env.local` has real `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Vercel environment variables match `.env.local.example` (all required keys set)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production URL in Vercel (e.g. `https://kiamburoad-hub.com`)

## 3. Admin Smoke Test

- [ ] Navigate to `/admin/login` and log in with your admin credentials
- [ ] Admin dashboard loads without errors
- [ ] `/admin/businesses` loads (may be empty — that is fine)
- [ ] `/admin/categories` shows all 14 categories with subcategories
- [ ] `/admin/submissions` loads
- [ ] Create a test business via `/admin/businesses/new` (status: draft)
- [ ] Edit the test business via `/admin/businesses/[id]` and save
- [ ] Delete or archive the test business after confirming edit works

## 4. Public Directory Smoke Test

- [ ] Homepage loads with hero, stats, categories, and featured section
- [ ] Hero search with a category selected routes to `/search?category=<slug>`
- [ ] `/directory` shows all published categories
- [ ] `/directory/eat-drink-stay` loads (shows "No listings yet" if empty)
- [ ] Search page at `/search?q=test` loads without errors
- [ ] `/emergency` page loads with correct content
- [ ] `/list-your-business` form submits and shows success state

## 5. Content Entry — Seed Data

- [ ] Add at least 3 real, verified businesses per main category before launch
- [ ] Each business has: name, slug, category, area, phone, short_description, status=published
- [ ] Featured businesses (is_sponsor=true) for the homepage carousel
- [ ] Confirm data verification policy:
  - Set `verification_status` to `verified` only after confirming via official source
  - Set `source_url` to the URL used for verification
  - Set `last_verified_at` to the verification date

## 6. Emergency Contacts

- [ ] Review `/app/(public)/emergency/page.tsx`
- [ ] Replace all "To be confirmed" values with real verified numbers
- [ ] Verify each number before publishing

## 7. Public Forms Test

- [ ] Contact form at `/contact` submits and appears in `/admin/messages`
- [ ] Newsletter form in footer subscribes without errors
- [ ] List Your Business form at `/list-your-business` submits and appears in `/admin/submissions`
- [ ] Travel enquiry at `/travel` submits (check `travel_inquiries` table in Supabase)

## 8. SEO Checks

- [ ] Homepage title is set correctly in `/app/(public)/page.tsx`
- [ ] Each category page generates correct `<title>` and meta description
- [ ] Business profile pages have unique titles and descriptions
- [ ] Search page has appropriate meta (noindex may be appropriate for paginated results)
- [ ] `/robots.txt` or `next-sitemap` configured if needed

## 9. Mobile Smoke Test

- [ ] Homepage renders correctly on mobile (iPhone SE size)
- [ ] Header mobile menu opens and closes
- [ ] Business cards are readable and tap-targets are large enough
- [ ] Contact buttons (call, WhatsApp) work on mobile
- [ ] Forms are usable on a small screen keyboard

## 10. Performance Checks

- [ ] Run `npm run build` locally — zero TypeScript errors
- [ ] No console errors on homepage, directory, and business profile pages
- [ ] Images use `next/image` with correct `alt` text
- [ ] No unoptimised images loading from external sources without being whitelisted in `next.config.ts`

## 11. Deployment

- [ ] Connect GitHub repository to Vercel (if not already done)
- [ ] Set all environment variables in Vercel → Project → Settings → Environment Variables
- [ ] Deploy to production and verify build succeeds in Vercel dashboard
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS is active on the production URL

## 12. Post-Launch

- [ ] Add Google Analytics or PostHog for traffic insights
- [ ] Set up a monitoring alert for downtime (e.g. Better Uptime, UptimeRobot)
- [ ] Review the first 5 incoming submissions from the list-your-business form
- [ ] Begin structured data verification pass for published listings
- [ ] Plan first journal articles across key sections (Health Digest, Newswatch, Business Notes)
