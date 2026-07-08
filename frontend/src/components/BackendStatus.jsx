/**
 * BackendStatus.jsx
 * ---------------------------------------------------------------------------
 * Invisible diagnostic component — renders NOTHING in the UI.
 * On mount it pings GET /api/test on the Render backend and logs the result
 * exclusively to the browser Console.
 *
 * Success output:
 *   ✓ Backend Connected Successfully
 *   Backend Response: { status, message, timestamp }
 *
 * Failure output:
 *   ✗ Backend Connection Failed  <error message>
 *   [Lume] Possible cause + fix suggestion
 *
 * Import once in App.jsx:
 *   import BackendStatus from "./components/BackendStatus";
 *   <BackendStatus />   ← place anywhere inside the JSX tree
 * ---------------------------------------------------------------------------
 */

import { useEffect } from "react";
import { getBackendStatus } from "../services/backendApi";

// ─── Diagnostic helpers ────────────────────────────────────────────────────

/**
 * Analyses the caught error and returns a human-readable cause + fix pair.
 *
 * IMPORTANT — Chrome/Edge CORS behaviour:
 *   When a CORS preflight is rejected, the browser logs a warning in the
 *   console BUT the JS error thrown by fetch() is a generic TypeError with
 *   message "Failed to fetch". There is NO way to distinguish a CORS block
 *   from a true network failure in JS alone.
 *
 *   Heuristic: if the URL is a remote https:// origin and we get
 *   "Failed to fetch", CORS / missing deployment is overwhelmingly the
 *   most likely cause, so we surface that first.
 *
 * @param {Error} err
 * @param {string} apiUrl – value of import.meta.env.VITE_API_URL
 * @returns {{ cause: string; fix: string }}
 */
function diagnose(err, apiUrl) {
  const msg = (err?.message || "").toLowerCase();
  const isRemoteUrl =
    typeof apiUrl === "string" &&
    apiUrl.startsWith("https://") &&
    !apiUrl.includes("localhost");

  // 1. VITE_API_URL is missing / undefined
  if (!apiUrl || apiUrl === "undefined") {
    return {
      cause: "VITE_API_URL is not set or is undefined.",
      fix:
        "Add VITE_API_URL=https://backend-for-lume.onrender.com to your " +
        "frontend/.env file and restart the Vite dev server.",
    };
  }

  // 2. Environment variable present but malformed (no https://)
  if (!apiUrl.startsWith("http")) {
    return {
      cause: `VITE_API_URL ("${apiUrl}") is not a valid URL.`,
      fix:
        "Ensure the value starts with https:// — e.g. " +
        "VITE_API_URL=https://backend-for-lume.onrender.com",
    };
  }

  // 3. Duplicated Render domain
  if ((apiUrl || "").includes("onrender.com.onrender.com")) {
    return {
      cause: "VITE_API_URL contains a duplicated domain (onrender.com.onrender.com).",
      fix:
        "Update VITE_API_URL to https://backend-for-lume.onrender.com " +
        "(remove the extra .onrender.com) and restart the dev server.",
    };
  }

  // 4. "Failed to fetch" on a remote https URL
  //    — Chrome converts CORS preflight failures into this generic error.
  //    CORS mis-configuration or a missing deployment is by far the most
  //    common root cause when hitting a Render service.
  if (
    isRemoteUrl &&
    (msg.includes("failed to fetch") ||
      msg.includes("networkerror") ||
      msg.includes("network request failed"))
  ) {
    return {
      cause:
        "CORS is blocking the request OR the updated backend has not been deployed yet.\n" +
        "Chrome shows 'Failed to fetch' in JS for both CORS blocks and network failures.\n" +
        `Target URL: ${apiUrl}/api/test`,
      fix:
        "Step 1 — Push your updated backend to Render:\n" +
        "  git -C backend add .\n" +
        '  git commit -m "feat: add cors middleware"\n' +
        "  git push\n" +
        "  Then wait ~60 s for Render to redeploy automatically.\n\n" +
        "Step 2 — If Render is not connected to Git, deploy manually:\n" +
        "  Go to https://dashboard.render.com → your service → Manual Deploy → Deploy latest commit.\n\n" +
        "Step 3 — Verify cors is active by opening this URL in your browser:\n" +
        `  ${apiUrl}/api/test\n` +
        '  You should see { "status": "ok", ... } in the response.',
    };
  }

  // 5. Explicit CORS error text (rare — some proxies do include it)
  if (
    msg.includes("cors") ||
    msg.includes("cross-origin") ||
    msg.includes("has been blocked")
  ) {
    return {
      cause: "CORS policy is blocking the request.",
      fix:
        'Ensure your backend server.js has app.use(cors()) before all routes, ' +
        "the cors package is installed (npm install cors), and the backend is redeployed on Render.",
    };
  }

  // 6. HTTP 4xx / 5xx (apiFetch throws with status code in message)
  if (msg.includes("backend error")) {
    const codeMatch = msg.match(/backend error (\d+)/);
    const code = codeMatch ? codeMatch[1] : "unknown";
    if (code === "404") {
      return {
        cause: `Route not found (404) — the backend does not expose GET /api/test at ${apiUrl}.`,
        fix:
          'Verify that server.js defines app.get("/api/test", ...) and that ' +
          "the route is not prefixed differently in production.",
      };
    }
    if (code.startsWith("5")) {
      return {
        cause: `Server error (${code}) — the backend crashed or threw an unhandled exception.`,
        fix:
          "Check the Render service logs at https://dashboard.render.com for stack traces.",
      };
    }
  }

  // 7. Generic fallback
  return {
    cause: err?.message || "Unknown error.",
    fix:
      "Check VITE_API_URL in frontend/.env, confirm cors is enabled on the backend, " +
      "and verify the Render deployment is live.",
  };
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function BackendStatus() {
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    (async () => {
      try {
        const response = await getBackendStatus();

        // ── Success ──────────────────────────────────────────────────────
        console.log(
          "%c✓ Backend Connected Successfully",
          "color:#4ade80; font-weight:700; font-size:13px;"
        );
        console.log(
          "%cBackend Response:",
          "color:#c9a769; font-weight:600;",
          response
        );
      } catch (err) {
        // ── Failure ──────────────────────────────────────────────────────
        console.error(
          "%c✗ Backend Connection Failed",
          "color:#f87171; font-weight:700; font-size:13px;",
          err?.message || err
        );

        const { cause, fix } = diagnose(err, apiUrl);
        console.warn(
          "%c[Lume Diagnostics] Possible cause:\n",
          "color:#fbbf24; font-weight:600;",
          cause
        );
        console.info(
          "%c[Lume Diagnostics] Suggested fix:\n",
          "color:#60a5fa; font-weight:600;",
          fix
        );
      }
    })();
  }, []); // runs once on mount

  // Renders nothing — zero UI impact
  return null;
}
