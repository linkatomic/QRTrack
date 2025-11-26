/*
  # Fix Scan Counter and Add QR Customization Options

  ## Changes
  
  1. Auto-increment scan counter
    - Creates a trigger function to automatically increment total_scans
    - Adds trigger to scans table to call the function on insert
    
  2. New QR Customization Fields
    - `qr_style` - Style of QR dots (square, dots, rounded)
    - `qr_eye_style` - Style of corner eyes (square, dots, rounded)
    - `qr_bg_color` - Background color (default white)
    - `qr_gradient_type` - Gradient type (none, linear, radial)
    - `qr_gradient_color` - Secondary color for gradient
    - `qr_logo_url` - URL to logo image
    - `qr_size` - Size in pixels (default 512)
    - `qr_error_correction` - Error correction level (L, M, Q, H)
    - `qr_margin` - Margin/quiet zone size
  
  3. Security
    - Maintains existing RLS policies
*/

-- Add function to increment total_scans
CREATE OR REPLACE FUNCTION increment_qr_total_scans()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE qr_codes
  SET total_scans = total_scans + 1
  WHERE id = NEW.qr_code_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-increment on scan insert
DROP TRIGGER IF EXISTS trigger_increment_qr_scans ON scans;
CREATE TRIGGER trigger_increment_qr_scans
  AFTER INSERT ON scans
  FOR EACH ROW
  EXECUTE FUNCTION increment_qr_total_scans();

-- Add new customization columns to qr_codes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_style'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_style text DEFAULT 'square';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_eye_style'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_eye_style text DEFAULT 'square';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_bg_color'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_bg_color text DEFAULT '#FFFFFF';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_gradient_type'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_gradient_type text DEFAULT 'none';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_gradient_color'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_gradient_color text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_logo_url'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_logo_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_size'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_size integer DEFAULT 512;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_error_correction'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_error_correction text DEFAULT 'M';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'qr_codes' AND column_name = 'qr_margin'
  ) THEN
    ALTER TABLE qr_codes ADD COLUMN qr_margin integer DEFAULT 2;
  END IF;
END $$;
