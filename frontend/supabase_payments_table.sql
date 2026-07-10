-- ============================================================
-- LUME — Create payments table + add payment columns to orders
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. Add payment columns to orders table (if missing) ─────
-- These columns store payment state directly on the order row.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_status      text DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS razorpay_order_id   text,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id text;

-- ── 2. Create payments table ────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             uuid REFERENCES orders(id) ON DELETE SET NULL,
  user_id              uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  razorpay_order_id    text,
  razorpay_payment_id  text,
  razorpay_signature   text,
  payment_method       text NOT NULL DEFAULT 'Razorpay',
  payment_status       text NOT NULL DEFAULT 'Pending',
  amount               numeric(12, 2) NOT NULL DEFAULT 0,
  currency             text NOT NULL DEFAULT 'INR',
  transaction_date     timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- Unique index on razorpay_payment_id (only for non-null values)
-- This prevents duplicate Razorpay records while allowing multiple COD entries
CREATE UNIQUE INDEX IF NOT EXISTS payments_razorpay_pid_unique
  ON payments (razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;

-- Index for quick lookups by order and user
CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments(order_id);
CREATE INDEX IF NOT EXISTS payments_user_id_idx  ON payments(user_id);

-- ── 3. Row Level Security ───────────────────────────────────
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payments"    ON payments;
DROP POLICY IF EXISTS "Users can insert own payments"  ON payments;
DROP POLICY IF EXISTS "Service role full access"       ON payments;

-- Authenticated users can view their own payment records
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can insert payment records for themselves
CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role (backend) has unrestricted access
-- This is the default behavior for service_role key
