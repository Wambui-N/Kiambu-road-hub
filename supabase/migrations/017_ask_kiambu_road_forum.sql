-- =============================================================================
-- Kiambu Road Explorer — Migration 017
-- "Ask Kiambu Road" community Q&A / tips forum.
-- Adds phone_number to profiles (collected at signup, never shown publicly),
-- and a lightweight posts+replies forum gated behind real Supabase Auth
-- accounts (email/password or Google) rather than anonymous posting.
-- Run AFTER 016_business_cover_images_part4of4.sql
-- =============================================================================

-- ─── 1. Extend profiles with phone_number ─────────────────────────────────────

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number text;

-- Signup (email/password and Google OAuth both) now also carries phone_number
-- in raw_user_meta_data when provided, so the auto-profile trigger picks it up.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone_number)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'phone_number'
  );
  RETURN new;
END;
$$;

-- ─── 2. forum_posts — questions and tips ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS forum_posts (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid not null references auth.users(id) on delete cascade,
  author_name  text not null,
  post_type    text not null check (post_type in ('question', 'tip')),
  title        text not null,
  body         text not null,
  status       text not null default 'published' check (status in ('published', 'hidden')),
  reply_count  integer not null default 0,
  upvote_count integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_feed ON forum_posts(status, created_at desc);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);

-- ─── 3. forum_replies — comments/answers on a post ────────────────────────────

CREATE TABLE IF NOT EXISTS forum_replies (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references forum_posts(id) on delete cascade,
  author_id    uuid not null references auth.users(id) on delete cascade,
  author_name  text not null,
  body         text not null,
  status       text not null default 'published' check (status in ('published', 'hidden')),
  upvote_count integer not null default 0,
  created_at   timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON forum_replies(post_id, created_at);

-- ─── 4. Vote tables — one row per (item, user), real accounts so no IP hashing ─

CREATE TABLE IF NOT EXISTS forum_post_votes (
  post_id    uuid not null references forum_posts(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS forum_reply_votes (
  reply_id   uuid not null references forum_replies(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reply_id, user_id)
);

-- ─── 5. Atomic increment functions (avoid read-modify-write races) ────────────

CREATE OR REPLACE FUNCTION increment_forum_post_upvote(p_post_id uuid)
RETURNS integer LANGUAGE sql AS $$
  UPDATE forum_posts SET upvote_count = upvote_count + 1
  WHERE id = p_post_id
  RETURNING upvote_count;
$$;

CREATE OR REPLACE FUNCTION increment_forum_reply_upvote(p_reply_id uuid)
RETURNS integer LANGUAGE sql AS $$
  UPDATE forum_replies SET upvote_count = upvote_count + 1
  WHERE id = p_reply_id
  RETURNING upvote_count;
$$;

CREATE OR REPLACE FUNCTION increment_forum_post_reply_count(p_post_id uuid)
RETURNS integer LANGUAGE sql AS $$
  UPDATE forum_posts SET reply_count = reply_count + 1
  WHERE id = p_post_id
  RETURNING reply_count;
$$;

-- ─── 6. RLS ────────────────────────────────────────────────────────────────────

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_reply_votes ENABLE ROW LEVEL SECURITY;

-- Anyone (including signed-out visitors) can read published posts/replies —
-- only participating (post/reply/vote) requires a real account.
CREATE POLICY "Public read forum_posts" ON forum_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read forum_replies" ON forum_replies FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated insert forum_posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authenticated insert forum_replies" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authenticated insert forum_post_votes" ON forum_post_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated insert forum_reply_votes" ON forum_reply_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors update own forum_posts" ON forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors delete own forum_posts" ON forum_posts FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Authors update own forum_replies" ON forum_replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors delete own forum_replies" ON forum_replies FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admin all forum_posts" ON forum_posts FOR ALL USING (is_admin());
CREATE POLICY "Admin all forum_replies" ON forum_replies FOR ALL USING (is_admin());
CREATE POLICY "Admin all forum_post_votes" ON forum_post_votes FOR ALL USING (is_admin());
CREATE POLICY "Admin all forum_reply_votes" ON forum_reply_votes FOR ALL USING (is_admin());
