-- Run this in your Supabase SQL Editor

-- 1. Drop Foreign Key Constraints
-- We need to drop these to allow changing the column types
ALTER TABLE pets DROP CONSTRAINT IF EXISTS pets_owner_id_fkey;
ALTER TABLE bills DROP CONSTRAINT IF EXISTS bills_customer_id_fkey;

-- 2. Update customers id to text
ALTER TABLE customers ALTER COLUMN id TYPE text;

-- 3. Update foreign key columns to match
ALTER TABLE pets ALTER COLUMN owner_id TYPE text;
ALTER TABLE bills ALTER COLUMN customer_id TYPE text;

-- 4. Re-add Foreign Key Constraints
ALTER TABLE pets
  ADD CONSTRAINT pets_owner_id_fkey
  FOREIGN KEY (owner_id)
  REFERENCES customers(id)
  ON DELETE CASCADE;

ALTER TABLE bills
  ADD CONSTRAINT bills_customer_id_fkey
  FOREIGN KEY (customer_id)
  REFERENCES customers(id)
  ON DELETE CASCADE;

-- 5. Update bills date columns (no FK issues here usually)
ALTER TABLE bills ALTER COLUMN appointed_date TYPE date;
ALTER TABLE bills ALTER COLUMN created_at TYPE timestamptz;
