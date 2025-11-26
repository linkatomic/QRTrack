/*
  # Add Tracking Toggle and QR Templates

  ## New Features
  
  1. Tracking Toggle
    - `enable_tracking` - Boolean to enable/disable analytics
    - When false, QR directly redirects to destination_url
    - When true, uses our redirect system for tracking
  
  2. QR Templates & Frames
    - `qr_template` - Pre-designed template name
    - `qr_frame_style` - Frame/border style around QR
    - `qr_frame_color` - Frame color
    - `qr_frame_text` - Custom text on frame
  
  3. Download Options
    - `download_format` - Preferred format (png, svg, pdf)
    - `transparent_bg` - Use transparent background
  
  ## Security
    - Maintains existing RLS policies
*/

-- Add new columns to qr_codes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'enable_tracking'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN enable_tracking boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_template'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_template text DEFAULT 'default';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_frame_style'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_frame_style text DEFAULT 'none';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_frame_color'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_frame_color text DEFAULT '#000000';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_frame_text'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_frame_text text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'transparent_bg'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN transparent_bg boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'download_format'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN download_format text DEFAULT 'png';
  END IF;
END $$;
