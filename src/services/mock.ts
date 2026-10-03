import { config } from "./config";

/** Simulates network latency for mock services. */
export function mockDelay<T>(value: T): Promise<T> {
  const { min, max } = config.mockLatencyMs;
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(() => resolve(structuredCloneSafe(value)), ms));
}

/** Return copies so screens can't accidentally mutate the mock "database". */
function structuredCloneSafe<T>(value: T): T {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

export function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
