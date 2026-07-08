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
