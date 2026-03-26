# Kiambu Road Explorer

The definitive business directory and lifestyle journal for the Kiambu Road corridor, Nairobi, Kenya.

**Live site:** [kiamburoad-hub.com](https://kiamburoad-hub.com) (coming soon)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Components | shadcn/ui + Tailwind CSS v4 |
| Animations | Framer Motion |
| Database | Supabase (Postgres + Auth + Storage) |
| Fonts | Playfair Display · DM Sans · JetBrains Mono |
| Icons | Lucide React |
| Email | Resend |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd kiambu-road-hub
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
# Fill in your Supabase keys and other values
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open the SQL editor and run the migrations **in order**:
   - `supabase/migrations/001_initial_schema.sql` — core tables, enums, RLS
   - `supabase/migrations/002_storage.sql` — storage buckets and policies
   - `supabase/migrations/003_seed_reference_data.sql` — areas, categories, subcategories
   - `supabase/migrations/004a_seed_eat_drink_stay.sql` — 30 demo listings (Eat, Drink & Stay)
   - `supabase/migrations/004b_seed_health_wellness.sql` — 11 demo listings (Health & Wellness)
   - `supabase/migrations/004c_seed_education_childcare.sql` — 9 demo listings (Education & Childcare)
   - `supabase/migrations/004d_seed_retail_shopping.sql` — 9 demo listings (Retail & Shopping)
   - `supabase/migrations/004e_seed_automotive.sql` — 8 demo listings (Automotive)
   - `supabase/migrations/004f_seed_leisure_outdoors.sql` — 9 demo listings (Leisure & Outdoors)
   - `supabase/migrations/005_add_source_note_to_businesses.sql` — tags all demo rows
3. Go to **Authentication → Users** and create your admin user
4. Copy the user UUID and run:
   ```sql
   INSERT INTO admin_roles (user_id, role) VALUES ('<your-uuid>', 'super_admin');
   ```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
  (public)/          Public-facing pages (directory, journal, etc.)
  admin/             Protected admin panel
  api/               Server-side API route handlers
components/
  home/              Homepage sections
  directory/         Directory listing components
  admin/             Admin panel components
  layout/            Header, footer, navigation
  ui/                Shared UI primitives
lib/
  supabase/          Supabase client helpers (client, server, middleware)
  data/              Shared data options, query helpers
  env.ts             Environment variable validation
  rate-limit.ts      In-memory rate limiter for API routes
  utils.ts           Utility functions (slugify, formatPhone, etc.)
data/seed/           Seed data (categories, areas, journal sections)
supabase/migrations/ SQL migrations for schema, storage, and seed data
types/database.ts    TypeScript types for all Supabase tables
```

---

## Admin Panel

The admin panel is accessible at `/admin/login`. It requires an authenticated Supabase user with an entry in the `admin_roles` table.

| Route | Purpose |
|---|---|
| `/admin` | Dashboard |
| `/admin/businesses` | List, create, edit businesses |
| `/admin/categories` | Manage categories and subcategories |
| `/admin/submissions` | Review public listing requests |
| `/admin/articles` | Write and publish journal articles |
| `/admin/jobs` | Manage job listings |
| `/admin/prices` | Add and track price entries |
| `/admin/messages` | View contact form messages |

---

## Deployment

Deploy to Vercel in one command:

```bash
vercel --prod
```

Set all environment variables from `.env.local.example` in your Vercel project settings.

---

## Demo Data

The directory ships with **76 curated demo listings** across all six main categories, seeded via migrations `004a`–`004f`. These listings are based on real Kiambu Road corridor businesses and are intended to demonstrate the app to stakeholders before fully verified data is collected.

### How to identify demo rows

All demo businesses have `source_note = 'demo-seed-2025'`:

```sql
SELECT name, status, verification_status
FROM businesses
WHERE source_note = 'demo-seed-2025'
ORDER BY name;
```

### Managing demo data via the admin panel

| Task | How |
|---|---|
| Edit a listing | `/admin/businesses/[id]` — update any field and save |
| Feature/unfeature | Toggle `featured` flag in the business edit form |
| Hide from public | Set `status = 'draft'` in the edit form |
| Add images | Upload via the business edit form → Images tab |

### Upgrading to verified data (pre-launch)

When the client approves the project for full launch:

1. Freeze demo listings — set `status = 'archived'` on unverified rows.
2. Import verified data category by category using the same schema.
3. Set `verification_status = 'verified'` and `source_note = null` on confirmed listings.
4. Optionally remove all demo rows in one shot:
   ```sql
   DELETE FROM businesses WHERE source_note = 'demo-seed-2025';
   ```
5. Keep URLs stable where possible; add redirects in `next.config.ts` for changed slugs.

> **Note:** All demo listings have `verification_status = 'unverified'` (or `'verified'` for well-known anchor businesses). Treat them as illustrative, not as confirmed operational data, until re-verified by the client.

---

## Pre-Launch

See [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) for the full pre-launch QA checklist.
