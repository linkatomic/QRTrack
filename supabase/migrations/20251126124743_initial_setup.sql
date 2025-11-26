/*
  # QRTrack Initial Database Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `plan` (text, default 'free')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `qr_codes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `destination_url` (text)
      - `short_code` (text, unique)
      - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` (text, nullable)
      - `qr_color` (text, default '#000000')
      - `landing_page_enabled` (boolean, default false)
      - `landing_page_title`, `landing_page_description`, `landing_page_logo_url` (text, nullable)
      - `landing_page_cta_text` (text, default 'Visit Site')
      - `status` (text, default 'active')
      - `expires_at` (timestamp, nullable)
      - `total_scans` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `scans`
      - `id` (uuid, primary key)
      - `qr_code_id` (uuid, references qr_codes)
      - `scanned_at` (timestamp)
      - `user_agent`, `device_type`, `os`, `browser` (text, nullable)
      - `country`, `city` (text, nullable)
      - `referrer`, `ip_address` (text, nullable)
      - `utm_snapshot` (jsonb, nullable)

  2. Security
    - Enable RLS on all tables
    - Profiles: Users can view/update own profile
    - QR Codes: Users can manage own QR codes, anonymous users can read active QR codes for redirects
    - Scans: Users can view scans for own QR codes, anyone can insert scan records

  3. Functions & Triggers
    - Auto-update `updated_at` timestamps
    - Auto-increment scan counts

  4. Indexes
    - Performance indexes on frequently queried columns
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  plan text DEFAULT 'free' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  destination_url text NOT NULL,
  short_code text UNIQUE NOT NULL,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  qr_color text DEFAULT '#000000' NOT NULL,
  landing_page_enabled boolean DEFAULT false NOT NULL,
  landing_page_title text,
  landing_page_description text,
  landing_page_logo_url text,
  landing_page_cta_text text DEFAULT 'Visit Site',
  status text DEFAULT 'active' NOT NULL,
  expires_at timestamptz,
  total_scans integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid REFERENCES qr_codes(id) ON DELETE CASCADE NOT NULL,
  scanned_at timestamptz DEFAULT now() NOT NULL,
  user_agent text,
  device_type text,
  os text,
  browser text,
  country text,
  city text,
  referrer text,
  ip_address text,
  utm_snapshot jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_short_code ON qr_codes(short_code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_status ON qr_codes(status);
CREATE INDEX IF NOT EXISTS idx_scans_qr_code_id ON scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON scans(scanned_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- QR codes policies
CREATE POLICY "Users can view own QR codes"
  ON qr_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own QR codes"
  ON qr_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QR codes"
  ON qr_codes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own QR codes"
  ON qr_codes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous can read active QR codes for redirects"
  ON qr_codes FOR SELECT
  TO anon
  USING (status = 'active');

CREATE POLICY "Public can view active QR codes for landing pages"
  ON qr_codes FOR SELECT
  TO anon
  USING (status = 'active' AND landing_page_enabled = true);

-- Scans policies
CREATE POLICY "Users can view scans for own QR codes"
  ON scans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM qr_codes
      WHERE qr_codes.id = scans.qr_code_id
      AND qr_codes.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert scan records"
  ON scans FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_qr_codes_updated_at'
  ) THEN
    CREATE TRIGGER update_qr_codes_updated_at
      BEFORE UPDATE ON qr_codes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Function to increment scan count
CREATE OR REPLACE FUNCTION increment_scan_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE qr_codes
  SET total_scans = total_scans + 1
  WHERE id = NEW.qr_code_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment scan count
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'increment_qr_scan_count'
  ) THEN
    CREATE TRIGGER increment_qr_scan_count
      AFTER INSERT ON scans
      FOR EACH ROW
      EXECUTE FUNCTION increment_scan_count();
  END IF;
END $$;
