/* ============================================================
   Central Order Management microservice client
   Base URL: https://www.microservices.tech
   Docs: API_DOCUMENTATION (3).md
   ============================================================ */

import type { CartItem, ShippingAddress } from "../types";

export const MICROSERVICES_BASE = "https://www.microservices.tech";
const JWT_KEY = "vyra.jwt";

/* ----- Token storage ----- */

export function getToken(): string | null {
  try {
    return localStorage.getItem(JWT_KEY);
  } catch {
    return null;
  }
}
export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(JWT_KEY, token);
    else localStorage.removeItem(JWT_KEY);
  } catch {
    /* ignore */
  }
}

/* ----- Fetch wrapper ----- */

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  /** send FormData instead of JSON */
  form?: FormData;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Extract a human-friendly error message from any of the microservice's
 * error envelopes: { error }, { ok:false, error }, or { message }.
 */
function extractError(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const p = payload as Record<string, unknown>;
  const candidate =
    (typeof p.error === "string" && p.error) ||
    (typeof p.message === "string" && p.message) ||
    (typeof p.reason === "string" && p.reason);
  return candidate || fallback;
}

async function request<T = unknown>(
  path: string,
  { method = "GET", body, auth = false, form, signal }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (!form) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${MICROSERVICES_BASE}${path}`, {
      method,
      headers,
      body: form ? form : body != null ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (netErr) {
    throw new ApiError(
      "Network error — check your internet connection.",
      0,
      netErr
    );
  }

  const text = await res.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    throw new ApiError(
      extractError(payload, `Request failed (${res.status})`),
      res.status,
      payload
    );
  }
  return payload as T;
}

/* ============================================================
   3. Authentication
   ============================================================ */

export interface ServerUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  date_of_birth: string;
  nationality: string;
  country_of_residence: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: ServerUser;
}

export async function apiRegister(input: {
  name: string;
  email: string;
  password: string;
  date_of_birth: string;
  nationality: string;
  country_of_residence: string;
}): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: input,
  });
  if (res.token) setToken(res.token);
  return res;
}

export async function apiLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  if (res.token) setToken(res.token);
  return res;
}

export async function apiVerify(): Promise<ServerUser> {
  const res = await request<{ success: boolean; user: ServerUser }>(
    "/api/auth/verify",
    { method: "GET", auth: true }
  );
  return res.user;
}

export async function apiForgotPassword(email: string): Promise<void> {
  await request("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

/* ============================================================
   5. Promo codes
   ============================================================ */

export interface PromoValidateResult {
  ok: true;
  valid: true;
  percent: number;
}
export async function apiValidatePromo(
  code: string
): Promise<PromoValidateResult> {
  return request<PromoValidateResult>("/api/promos/validate", {
    method: "POST",
    body: { code },
  });
}

/* ============================================================
   7. Orders — details-only intake (no on-site payment)

   Note: we hit /api/user-orders (the "primary" endpoint) rather than
   /api/central/orders. The central endpoint has a VARCHAR(50) column
   that overflows once you combine multiple items — reproducibly failing
   with "value too long for type character varying(50)". The primary
   endpoint accepts the same shape via itemsArray + top-level fields
   and does not have that limitation.
   ============================================================ */

export interface CentralOrderTotals {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface CentralOrderResponse {
  ok: true;
  success: true;
  orderNumber: string;
  orderId: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totals: CentralOrderTotals;
  message: string;
}

interface PrimaryOrderResponse {
  success: boolean;
  orderId: number;
  orderNumber: string;
  email_debug?: unknown;
}

export interface PlaceCentralOrderInput {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: ShippingAddress & { country?: string };
  items: CartItem[];
  totals: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
  promoCode?: string;
}

export async function apiPlaceCentralOrder(
  input: PlaceCentralOrderInput
): Promise<CentralOrderResponse> {
  const itemsArray = input.items.map((i) => ({
    name: `${i.productName} · ${i.doseLabel} ${i.strength}`,
    qty: i.quantity,
    unitPrice: i.price,
    sku: i.doseId,
  }));
  const payload = {
    email: input.email,
    customerEmail: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.mobile,
    customerPhone: input.mobile,
    address: input.address.line1,
    shippingAddress: input.address.line1,
    /* line2 is not part of the primary shape; fold into address if present */
    city: input.address.city,
    shippingCity: input.address.city,
    postcode: input.address.postcode,
    shippingZip: input.address.postcode,
    country: input.address.country ?? "United Kingdom",
    shippingCountry: input.address.country ?? "United Kingdom",
    itemsArray: JSON.stringify(itemsArray),
    subtotal: input.totals.subtotal,
    total: input.totals.total,
    discountAmount: input.totals.discount,
    promoCode: input.promoCode ?? "",
    payment_method: "manual",
  };
  const res = await request<PrimaryOrderResponse>("/api/user-orders", {
    method: "POST",
    body: payload,
  });
  /* Adapt the primary-endpoint response to the shape our callers already
     use (CentralOrderResponse), so no UI changes are needed. */
  return {
    ok: true,
    success: true,
    orderNumber: res.orderNumber,
    orderId: res.orderId,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "Manual",
    totals: input.totals,
    message:
      "Order received. No on-site payment was taken; the order is recorded as pending.",
  };
}

/* ============================================================
   15. Newsletter
   ============================================================ */

export interface NewsletterResponse {
  ok: true;
  id?: number;
  already_subscribed?: boolean;
}

export async function apiNewsletterSubscribe(
  email: string,
  consent: boolean,
  source = "footer"
): Promise<NewsletterResponse> {
  return request<NewsletterResponse>("/api/newsletter/subscribe", {
    method: "POST",
    body: { email, consent, source, website: "" },
  });
}
