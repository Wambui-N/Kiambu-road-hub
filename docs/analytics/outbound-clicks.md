# Outbound Click Tracking

## What is tracked

Every time a visitor clicks an outbound link from a business directory listing, the event is recorded in the `outbound_clicks` table in Supabase.

Tracked data per click:

| Column | Description |
|---|---|
| `destination_url` | Raw destination before UTMs are appended |
| `link_type` | `website`, `whatsapp`, `phone`, `email`, `maps`, or `ad` |
| `surface` | Where on the site the click came from (e.g. `directory_listing`, `directory_category`) |
| `business_slug` | Slug of the business whose link was clicked |
| `category_slug` | Category the business belongs to |
| `page_path` | URL path on Kiambu Road Explorer when the click happened |
| `utm_source` | `kiamburoadexplorer` (for `website` clicks only) |
| `utm_medium` | Derived from `surface` (e.g. `directory-listing`) |
| `utm_campaign` | `directory` |
| `utm_content` | Business slug, or `listing` as fallback |
| `referrer` | HTTP Referer header (where the visitor came from before Kiambu Road Explorer) |
| `ip_hash` | One-way SHA-256 hash of visitor IP (privacy-safe) |
| `created_at` | Timestamp of the click |

UTM fields are populated **only for `website` link types** — WhatsApp, phone, email, and maps clicks store `null` for UTM columns since those destinations cannot use UTM parameters.

## How it works

1. Outbound links route through `/api/out?url=...&type=...&surface=...&bslug=...&cat=...&path=...`.
2. The API logs the click to `outbound_clicks` (fire-and-forget — does not delay the redirect).
3. For `website` clicks, it appends UTM parameters to the destination URL before redirecting.
4. The UTM values stored in the DB always match what was appended to the destination URL.

## Verifying that UTMs are recorded

Run the following in the Supabase SQL editor after triggering a test "Visit website" click on any business listing:

```sql
SELECT
  id,
  created_at,
  destination_url,
  link_type,
  surface,
  business_slug,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content
FROM outbound_clicks
ORDER BY created_at DESC
LIMIT 20;
```

Expected for a `website` click:
- `utm_source` = `kiamburoadexplorer`
- `utm_medium` = surface with underscores replaced by hyphens (e.g. `directory-listing`)
- `utm_campaign` = `directory`
- `utm_content` = business slug (e.g. `java-house-kiambu`)

## Reporting queries

### Click volume per business (all time)

```sql
SELECT
  business_slug,
  COUNT(*) AS total_clicks
FROM outbound_clicks
GROUP BY business_slug
ORDER BY total_clicks DESC;
```

### Click volume per business, broken down by link type

```sql
SELECT
  business_slug,
  link_type,
  COUNT(*) AS clicks
FROM outbound_clicks
GROUP BY business_slug, link_type
ORDER BY business_slug, clicks DESC;
```

### Click volume per business by channel (UTM medium)

```sql
SELECT
  business_slug,
  utm_medium,
  COUNT(*) AS clicks
FROM outbound_clicks
WHERE utm_medium IS NOT NULL
GROUP BY business_slug, utm_medium
ORDER BY business_slug, clicks DESC;
```

### Daily click trend

```sql
SELECT
  DATE(created_at) AS day,
  COUNT(*) AS clicks
FROM outbound_clicks
GROUP BY day
ORDER BY day DESC
LIMIT 30;
```

### Top surfaces driving outbound clicks

```sql
SELECT
  surface,
  COUNT(*) AS clicks
FROM outbound_clicks
GROUP BY surface
ORDER BY clicks DESC;
```
