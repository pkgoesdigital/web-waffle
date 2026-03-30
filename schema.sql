-- Kristyn Wade visitor coordination sign-ups
-- Run this once in your Neon/Vercel Postgres dashboard (Query tab)

CREATE TABLE IF NOT EXISTS kristyn_signups (
  id         SERIAL PRIMARY KEY,
  slot_date  DATE        NOT NULL,
  slot_key   VARCHAR(64) NOT NULL,
  full_name  TEXT        NOT NULL,
  email      TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slot_date, slot_key, full_name)
);

CREATE INDEX IF NOT EXISTS idx_kristyn_signups_slot
  ON kristyn_signups (slot_date, slot_key);
