/*
  # Sync Existing Scan Counts

  ## Purpose
  Recalculates and syncs the total_scans count for all existing QR codes
  based on actual scan records in the scans table.

  ## Changes
  - Updates all qr_codes.total_scans to match actual scan count
  - Creates a function to recalculate scan counts on demand
*/

-- Function to recalculate total scans for all QR codes
CREATE OR REPLACE FUNCTION sync_all_qr_scan_counts()
RETURNS void AS $$
BEGIN
  UPDATE qr_codes
  SET total_scans = (
    SELECT COUNT(*)
    FROM scans
    WHERE scans.qr_code_id = qr_codes.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the sync immediately for existing data
SELECT sync_all_qr_scan_counts();
