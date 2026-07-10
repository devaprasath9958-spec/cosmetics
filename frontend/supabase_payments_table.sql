-- ============================================================
-- LUME — Create payments table
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             uuid REFERENCES orders(id) ON DELETE SET NULL,
  user_id              uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  razorpay_order_id    text,
  razorpay_payment_id  text UNIQUE,   -- prevents duplicate payment records
  razorpay_signature   text,
  payment_method       text NOT NULL DEFAULT 'Razorpay',
  payment_status       text NOT NULL DEFAULT 'Pending',  -- Pending | Success | Failed | Refunded | COD
  amount               numeric(12, 2) NOT NULL DEFAULT 0,
  currency             text NOT NULL DEFAULT 'INR',
  transaction_date     timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- Index for quick lookups by order and user
CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments(order_id);
CREATE INDEX IF NOT EXISTS payments_user_id_idx  ON payments(user_id);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payments"    ON payments;
DROP POLICY IF EXISTS "Admin can manage all payments"  ON payments;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Admin (service role) and anon with direct Supabase can see all
CREATE POLICY "Admin can manage all payments"
  ON payments FOR ALL
  USING (true)
  WITH CHECK (true);

-- ── Add payment columns to orders table (if missing) ────────
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_status      text DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS razorpay_order_id   text,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id text;
