/**
 * backendApi.js
 * ---------------------------------------------------------------------------
 * Thin wrapper around the deployed Express backend on Render.
 * Base URL is read from the Vite environment variable VITE_API_URL so the
 * same source works both locally (pointing at http://localhost:5000) and in
 * production (pointing at https://backend-for-lume.onrender.com).
 *
 * Usage:
 *   import { getBackendStatus } from './services/backendApi';
 *   const data = await getBackendStatus();
 * ---------------------------------------------------------------------------
 */

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Generic fetch helper — adds default headers and converts responses to JSON.
 * @param {string} path     - Route path, e.g. "/api/test"
 * @param {RequestInit} [options] - Optional fetch options (method, body, …)
 * @returns {Promise<any>}
 */
const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Backend error ${response.status}: ${text}`);
  }

  return response.json();
};

/**
 * GET /api/test
 * Returns the backend health-check payload:
 *   { status: "ok", message: "...", timestamp: "..." }
 */
export const getBackendStatus = () => apiFetch("/api/test");

// ─────────────────────────────────────────────────────────────
// Razorpay Payment Services
// ─────────────────────────────────────────────────────────────

/**
 * POST /api/payment/create-order
 *
 * Creates a Razorpay order on the backend and returns all the
 * details the frontend needs to open the Checkout modal.
 *
 * @param {number} amount   - Amount in smallest currency unit (paise for INR)
 *                            e.g. ₹500 → pass 50000
 * @param {string} currency - Currency code, defaults to "INR"
 * @returns {{ success, order_id, amount, currency, key_id }}
 */
export const createPaymentOrder = (amount, currency = "INR") =>
  apiFetch("/api/payment/create-order", {
    method: "POST",
    body: JSON.stringify({ amount, currency }),
  });

/**
 * POST /api/payment/verify
 *
 * Sends the three Razorpay response fields to the backend for
 * HMAC-SHA256 signature verification. Only call this inside the
 * Razorpay `handler` callback (after successful payment).
 *
 * @param {{ razorpay_order_id, razorpay_payment_id, razorpay_signature }} payload
 * @returns {{ success, payment_id, order_id, message }}
 */
export const verifyPayment = (payload) =>
  apiFetch("/api/payment/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/**
 * POST /api/payment/record
 *
 * Records a payment in the payments table via the backend.
 * Uses the service role key to bypass RLS.
 *
 * @param {{ supabase_order_id, user_id, amount, currency, razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_method }} payload
 * @returns {{ success, message }}
 */
export const recordPayment = (payload) =>
  apiFetch("/api/payment/record", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/**
 * POST /api/payment/cod
 *
 * Records a Cash on Delivery payment in the payments table.
 *
 * @param {{ supabase_order_id, user_id, amount, currency }} payload
 * @returns {{ success, message }}
 */
export const recordCodPayment = (payload) =>
  apiFetch("/api/payment/cod", {
    method: "POST",
    body: JSON.stringify(payload),
  });
