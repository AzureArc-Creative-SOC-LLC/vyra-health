/* Thin, typed wrapper around localStorage so the rest of the app
   never touches raw JSON. Keys are namespaced under "vyra.". */

const PREFIX = "vyra.";

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — ignore for this practice app */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export const STORAGE_KEYS = {
  users: "users",
  session: "session",
  cart: "cart",
  orders: "orders",
  quiz: "quiz",
} as const;
