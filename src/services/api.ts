/* ============================================================
   Simulated backend API — Vyra Health (practice clone)

   There is no real server. Every function below mimics a network
   call: it runs async, adds a small delay, and persists to
   localStorage so the workflow survives a page refresh.
   Swapping this file for `fetch()` calls would make it real.
   ============================================================ */

import type {
  CartItem,
  Order,
  OrderStatus,
  QuizAnswers,
  QuizResult,
  ShippingAddress,
  User,
} from "../types";
import { load, save, remove, STORAGE_KEYS } from "./storage";
import {
  apiLogin,
  apiRegister,
  apiVerify,
  setToken,
  ApiError,
  type ServerUser,
} from "./microservices";

/* --- helpers --- */

const delay = (ms = 650) => new Promise((res) => setTimeout(res, ms));

const uid = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

/* --- Auth ---
   Delegates to the Central Order Management microservice for real JWT auth.
   User session (typed User) is cached locally so refreshes are instant, then
   verified against /api/auth/verify in the background. */

function toClientUser(u: ServerUser): User {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    createdAt: new Date().toISOString(),
  };
}

/** Sensible defaults for fields the microservice requires but our compact
 *  signup form does not collect (practice / demo project). */
const REGISTER_DEFAULTS = {
  date_of_birth: "1990-01-01",
  nationality: "British",
  country_of_residence: "United Kingdom",
};

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<User> {
  try {
    const res = await apiRegister({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      ...REGISTER_DEFAULTS,
    });
    const user = toClientUser(res.user);
    save(STORAGE_KEYS.session, user);
    return user;
  } catch (err) {
    if (err instanceof ApiError) throw new Error(err.message);
    throw err;
  }
}

export async function logIn(email: string, password: string): Promise<User> {
  try {
    const res = await apiLogin(email.trim().toLowerCase(), password);
    const user = toClientUser(res.user);
    save(STORAGE_KEYS.session, user);
    return user;
  } catch (err) {
    if (err instanceof ApiError) throw new Error(err.message);
    throw err;
  }
}

export async function logOut(): Promise<void> {
  setToken(null);
  remove(STORAGE_KEYS.session);
}

export function getCurrentUser(): User | null {
  /* Return the cached session immediately; call refreshSession() to reconcile
     with the server token in the background. */
  const cached = load<unknown>(STORAGE_KEYS.session, null);
  if (
    cached &&
    typeof cached === "object" &&
    "id" in cached &&
    "email" in cached
  ) {
    return cached as User;
  }
  /* Legacy sessions stored just the id string — discard them so the caller
     falls through to the API verify path. */
  if (cached) remove(STORAGE_KEYS.session);
  return null;
}

/** Re-verify the stored JWT against the server. On failure, clear the session. */
export async function refreshSession(): Promise<User | null> {
  if (!load<User | null>(STORAGE_KEYS.session, null)) return null;
  try {
    const server = await apiVerify();
    const user = toClientUser(server);
    save(STORAGE_KEYS.session, user);
    return user;
  } catch {
    /* Token invalid/expired — clear cached session so UI signs the user out. */
    setToken(null);
    remove(STORAGE_KEYS.session);
    return null;
  }
}

/* --- Eligibility quiz --- */

/** Localised labels used for the "None of these" option so eligibility
 *  logic can recognise either language. */
const NONE_OF_THESE_LABELS = ["None of these", "لا شيء مما سبق"];

export async function evaluateQuiz(answers: QuizAnswers): Promise<QuizResult> {
  await delay(900);

  const { heightCm, weightKg, conditions, pregnant } = answers;
  let bmi: number | null = null;
  if (heightCm && weightKg) {
    const m = heightCm / 100;
    bmi = Math.round((weightKg / (m * m)) * 10) / 10;
  }

  if (pregnant === "yes") {
    return {
      eligible: false,
      bmi,
      reason:
        "GLP-1 treatments are not suitable during pregnancy or breastfeeding. Please speak to your GP.",
    };
  }

  const pickedNone = conditions.some((c) => NONE_OF_THESE_LABELS.includes(c));
  const realConditions = conditions.filter(
    (c) => !NONE_OF_THESE_LABELS.includes(c)
  );

  if (!pickedNone && realConditions.length > 0) {
    return {
      eligible: false,
      bmi,
      reason:
        "Based on your health history, a clinician would need a fuller assessment before treatment. Our team will be in touch to discuss safe options.",
    };
  }

  if (bmi == null) {
    return {
      eligible: false,
      bmi,
      reason: "We couldn't calculate your BMI — please re-check your details.",
    };
  }

  /* Guideline BMI floor is 25 — matches the WHO overweight threshold and
     keeps the demo flow permissive for typical testers. */
  if (bmi < 25) {
    return {
      eligible: false,
      bmi,
      reason:
        "Treatment is generally recommended from a BMI of 25. Yours is below that range, so medication isn't the right step right now.",
    };
  }

  const recommendedProductSlug = bmi >= 35 ? "tirzepatide" : "semaglutide";
  save(STORAGE_KEYS.quiz, { answers, completedAt: new Date().toISOString() });

  return {
    eligible: true,
    bmi,
    reason:
      "Good news — based on your answers you look suitable for treatment. A clinician will confirm everything before anything is dispensed.",
    recommendedProductSlug,
  };
}

/* --- Orders --- */

const STATUS_FLOW: OrderStatus[] = [
  "Clinician review",
  "Approved",
  "Dispensing",
  "Dispatched",
  "Delivered",
];

const CLINICIAN_NOTES: Record<OrderStatus, string> = {
  "Clinician review":
    "Your order is with a clinician now. We'll message you as soon as it's been assessed — usually within 24 hours.",
  Approved:
    "A clinician has approved your treatment and titration plan. It's moving to our dispensing facility.",
  Dispensing:
    "Your treatment is being prepared and lab-checked at our licensed facility.",
  Dispatched:
    "Your order is on its way in discreet packaging. Tracking has been sent to your email.",
  Delivered:
    "Delivered. Remember you have 1:1 clinician chat and free dietitian sessions whenever you need them.",
};

export async function placeOrder(
  userId: string,
  items: CartItem[],
  address: ShippingAddress
): Promise<Order> {
  await delay(1100);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = 0; // free, always
  const order: Order = {
    id: uid("ord").toUpperCase(),
    userId,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: "Clinician review",
    placedAt: new Date().toISOString(),
    address,
    clinicianNote: CLINICIAN_NOTES["Clinician review"],
  };
  const orders = load<Order[]>(STORAGE_KEYS.orders, []);
  orders.unshift(order);
  save(STORAGE_KEYS.orders, orders);
  return order;
}

export async function getOrders(userId: string): Promise<Order[]> {
  await delay(400);
  return load<Order[]>(STORAGE_KEYS.orders, []).filter(
    (o) => o.userId === userId
  );
}

/* Demo helper: advance an order one step along the fulfilment flow,
   so the workflow feels alive on the account page. */
export async function advanceOrder(orderId: string): Promise<Order> {
  await delay(500);
  const orders = load<Order[]>(STORAGE_KEYS.orders, []);
  const order = orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found.");
  const idx = STATUS_FLOW.indexOf(order.status);
  if (idx < STATUS_FLOW.length - 1) {
    order.status = STATUS_FLOW[idx + 1];
    order.clinicianNote = CLINICIAN_NOTES[order.status];
  }
  save(STORAGE_KEYS.orders, orders);
  return order;
}
