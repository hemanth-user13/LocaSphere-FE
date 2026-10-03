/**
 * Runtime configuration.
 *
 * Set `EXPO_PUBLIC_API_URL` (e.g. in `.env`) to point the app at the Django
 * REST API, for example `https://api.locasphere.app/api/v1`. When it is not
 * set, every service falls back to its in-memory mock implementation.
 */
const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

export const config = {
  apiBaseUrl: apiUrl ?? "",
  useMocks: !apiUrl || process.env.EXPO_PUBLIC_USE_MOCKS === "true",
  requestTimeoutMs: 15000,
  /** Simulated latency for mocks so loading states are exercised. */
  mockLatencyMs: { min: 350, max: 800 },
  features: {
    /** Flip on once the backend exposes `/search/semantic/`. */
    semanticSearch: process.env.EXPO_PUBLIC_FEATURE_SEMANTIC_SEARCH === "true",
    googleSignIn: true,
  },
  defaultCity: "Hyderabad",
} as const;
