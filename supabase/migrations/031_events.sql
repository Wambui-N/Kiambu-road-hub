-- =============================================================================
-- Kiambu Road Explorer — Migration 031
-- Events & Expos becomes a real admin-manageable listing at /events, replacing
-- the static "Coming Soon" stub. Seeds the first real entry, the Kiambu
-- Tourism Expo, from the client's copy.
-- Run AFTER 030_shop_extraction_and_content_copy.sql
-- =============================================================================

CREATE TABLE events (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  tagline       text,
  description   text,
  body_content  text,
  venue_note    text,
  date_note     text,
  image_path    text,
  status        content_status not null default 'draft',
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

CREATE TABLE event_inquiries (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id) on delete set null,
  name       text not null,
  email      text not null,
  phone      text not null,
  message    text,
  status     text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

CREATE INDEX idx_events_status ON events(status, sort_order);
CREATE INDEX idx_event_inquiries_created ON event_inquiries(created_at desc);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read events" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Admin all events" ON events FOR ALL USING (is_admin());

CREATE POLICY "Public submit event_inquiries" ON event_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all event_inquiries" ON event_inquiries FOR ALL USING (is_admin());

INSERT INTO events (name, slug, tagline, description, body_content, venue_note, date_note, status, sort_order)
VALUES (
  'Kiambu Tourism Expo',
  'kiambu-tourism-expo',
  E'Bringing Kiambu\'s Experiences to Its Market',
  'The Kiambu Tourism Expo is an opportunity for hotels, restaurants, cafés, furnished apartments, wellness centres, adventure operators, farms, cultural attractions, event venues and other experience-based businesses to come out from behind their individual businesses and show Kiambu what they have to offer.',
  E'The Kiambu Tourism Expo is a biannual event for business, discovery, networking and community, bringing together enterprises that may otherwise have little opportunity to meet their market collectively.\n\nExplore. Connect. Experience Kiambu.',
  'Venue to be announced soon',
  'Dates to be announced soon',
  'published',
  1
)
ON CONFLICT (slug) DO NOTHING;
