import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { ShippingAddress } from "../types";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import * as api from "../services/api";
import {
  apiPlaceCentralOrder,
  apiValidatePromo,
  ApiError,
} from "../services/microservices";
import { LinkButton } from "../components/ui/Button";
import Button from "../components/ui/Button";
import {
  IconArrow,
  IconCart,
  IconCheck,
  IconLock,
} from "../components/art/Icons";
import { getProductBySlug } from "../data/products";
import { useSeo } from "../lib/seo";
import "./Checkout.css";

interface Fields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
}

const emptyFields: Fields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  postcode: "",
  country: "United Kingdom",
};

/** Checkout page — Lunvera-style two-column layout. */
export default function Checkout() {
  useSeo({ title: "Checkout", description: "Complete your Vyra Health order securely.", path: "/checkout", noindex: true });
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [fields, setFields] = useState<Fields>(() => ({
    ...emptyFields,
    email: user?.email ?? "",
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [promo, setPromo] = useState("");
  const [promoNote, setPromoNote] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoPercent, setPromoPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [placed, setPlaced] = useState<{
    orderId: string;
    total: number;
  } | null>(null);

  /* ---- Guards ---- */

  if (items.length === 0 && !placed) {
    return (
      <div className="co">
        <div className="container">
          <div className="co__head">
            <Link to="/cart" className="co__back">
              <IconArrow size={14} className="co__back-arrow" /> Back to cart
            </Link>
            <span className="co__step">Final step</span>
          </div>
          <h1 className="co__title">Checkout</h1>

          <div className="co__blocked">
            <span className="co__blocked-icon">
              <IconCart size={26} />
            </span>
            <h2>Nothing to check out</h2>
            <p>
              Your basket is empty. Add a treatment before you continue.
            </p>
            <LinkButton to="/#products" size="lg" arrow>
              Browse treatments
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="co">
        <div className="container">
          <div className="co__head">
            <Link to="/cart" className="co__back">
              <IconArrow size={14} className="co__back-arrow" /> Back to cart
            </Link>
            <span className="co__step">Final step</span>
          </div>
          <h1 className="co__title">Checkout</h1>

          <div className="co__blocked">
            <span className="co__blocked-icon">
              <IconLock size={26} />
            </span>
            <h2>Sign in to complete your order</h2>
            <p>
              You need a Vyra Health account to place an order. It only takes a
              minute — and it's free.
            </p>
            <LinkButton to="/login" size="lg">
              Sign in or create account
            </LinkButton>
          </div>
        </div>
      </div>
    );
  }

  const shipping: number = 0; // free
  const discount = Math.round(subtotal * promoPercent) / 100;
  const total = Math.max(0, subtotal - discount + shipping);

  function setField<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof Fields, string>> = {};
    if (!fields.firstName.trim()) e.firstName = "Required";
    if (!fields.lastName.trim()) e.lastName = "Required";
    if (!fields.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = "Please enter a valid email";
    if (!fields.phone.trim()) e.phone = "Required";
    if (!fields.line1.trim()) e.line1 = "Required";
    if (!fields.city.trim()) e.city = "Required";
    if (!fields.postcode.trim()) e.postcode = "Required";
    if (!fields.country.trim()) e.country = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onPlaceOrder() {
    setOrderError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const address: ShippingAddress = {
        fullName: `${fields.firstName} ${fields.lastName}`.trim(),
        line1: fields.line1.trim(),
        line2: fields.line2.trim() || undefined,
        city: fields.city.trim(),
        postcode: fields.postcode.trim(),
        phone: fields.phone.trim(),
      };
      /* Record the order server-side (details-only intake, no on-site payment). */
      const centralRes = await apiPlaceCentralOrder({
        firstName: fields.firstName.trim(),
        lastName: fields.lastName.trim(),
        email: fields.email.trim().toLowerCase(),
        mobile: fields.phone.trim(),
        address: { ...address, country: fields.country.trim() },
        items,
        totals: { subtotal, shipping, discount, total },
        promoCode: appliedCode || undefined,
      });
      /* Also record locally so the /account page can show it in the demo. */
      await api.placeOrder(user!.id, items, address);
      setPlaced({
        orderId: centralRes.orderNumber,
        total: centralRes.totals?.total ?? total,
      });
      clear();
    } catch (err) {
      if (err instanceof ApiError) setOrderError(err.message);
      else if (err instanceof Error) setOrderError(err.message);
      else setOrderError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function applyPromo() {
    const code = promo.trim().toUpperCase();
    setPromoError("");
    setPromoNote("");
    if (!code) return;
    setApplyingPromo(true);
    try {
      const res = await apiValidatePromo(code);
      setPromoPercent(res.percent);
      setAppliedCode(code);
      setPromoNote(`Promo "${code}" applied — ${res.percent}% off.`);
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 404
          ? `"${code}" is not a valid promo code.`
          : err instanceof Error
          ? err.message
          : "Couldn't validate that promo code.";
      setPromoError(msg);
      setPromoPercent(0);
      setAppliedCode("");
    } finally {
      setApplyingPromo(false);
    }
  }

  return (
    <div className="co">
      <div className="container">
        <div className="co__head">
          <Link to="/cart" className="co__back">
            <IconArrow size={14} className="co__back-arrow" /> Back to cart
          </Link>
          <span className="co__step">Final step</span>
        </div>
        <h1 className="co__title">Checkout</h1>

        <div className="co__grid">
          {/* ============ Form column ============ */}
          <form
            className="co__form"
            onSubmit={(e) => {
              e.preventDefault();
              onPlaceOrder();
            }}
          >
            {/* Contact */}
            <section className="co__section">
              <span className="co__section-eyebrow">Contact</span>

              <div className="co__row">
                <div className="co__field">
                  <label htmlFor="co-first">First name</label>
                  <input
                    id="co-first"
                    type="text"
                    autoComplete="given-name"
                    value={fields.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    placeholder="Jordan"
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <span className="co__err">{errors.firstName}</span>
                  )}
                </div>
                <div className="co__field">
                  <label htmlFor="co-last">Last name</label>
                  <input
                    id="co-last"
                    type="text"
                    autoComplete="family-name"
                    value={fields.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    placeholder="Avery"
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <span className="co__err">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="co__field">
                <label htmlFor="co-email">Email address</label>
                <input
                  id="co-email"
                  type="email"
                  autoComplete="email"
                  value={fields.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@lab.com"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <span className="co__err">{errors.email}</span>
                )}
              </div>

              <div className="co__field">
                <label htmlFor="co-phone">Mobile</label>
                <input
                  id="co-phone"
                  type="tel"
                  autoComplete="tel"
                  value={fields.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+44 …"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <span className="co__err">{errors.phone}</span>
                )}
              </div>
            </section>

            {/* Shipping address */}
            <section className="co__section">
              <span className="co__section-eyebrow">Shipping address</span>

              <div className="co__field">
                <label htmlFor="co-line1">Address line 1</label>
                <input
                  id="co-line1"
                  type="text"
                  autoComplete="address-line1"
                  value={fields.line1}
                  onChange={(e) => setField("line1", e.target.value)}
                  placeholder="123 Research Park"
                  aria-invalid={!!errors.line1}
                />
                {errors.line1 && (
                  <span className="co__err">{errors.line1}</span>
                )}
              </div>

              <div className="co__field">
                <label htmlFor="co-line2">
                  Address line 2 <em>(optional)</em>
                </label>
                <input
                  id="co-line2"
                  type="text"
                  autoComplete="address-line2"
                  value={fields.line2}
                  onChange={(e) => setField("line2", e.target.value)}
                  placeholder="Unit 4B"
                />
              </div>

              <div className="co__row">
                <div className="co__field">
                  <label htmlFor="co-city">City</label>
                  <input
                    id="co-city"
                    type="text"
                    autoComplete="address-level2"
                    value={fields.city}
                    onChange={(e) => setField("city", e.target.value)}
                    placeholder="London"
                    aria-invalid={!!errors.city}
                  />
                  {errors.city && (
                    <span className="co__err">{errors.city}</span>
                  )}
                </div>
                <div className="co__field">
                  <label htmlFor="co-post">Postcode</label>
                  <input
                    id="co-post"
                    type="text"
                    autoComplete="postal-code"
                    value={fields.postcode}
                    onChange={(e) => setField("postcode", e.target.value)}
                    placeholder="SW1A 1AA"
                    aria-invalid={!!errors.postcode}
                  />
                  {errors.postcode && (
                    <span className="co__err">{errors.postcode}</span>
                  )}
                </div>
              </div>

              <div className="co__field">
                <label htmlFor="co-country">Country</label>
                <input
                  id="co-country"
                  type="text"
                  autoComplete="country-name"
                  value={fields.country}
                  onChange={(e) => setField("country", e.target.value)}
                  aria-invalid={!!errors.country}
                />
                {errors.country && (
                  <span className="co__err">{errors.country}</span>
                )}
              </div>

              {orderError && (
                <p className="co__form-error" role="alert">
                  {orderError}
                </p>
              )}
            </section>
          </form>

          {/* ============ Order summary ============ */}
          <aside className="co__summary" aria-label="Order summary">
            <span className="co__summary-eyebrow">Order summary</span>

            <ul className="co__summary-items">
              {items.map((item) => {
                const product = getProductBySlug(item.productSlug);
                const img = product?.img ?? "/images/alluvi-product.jpeg";
                return (
                  <li key={item.doseId} className="co__summary-item">
                    <span className="co__summary-thumb">
                      <img src={img} alt="" loading="lazy" />
                      <em className="co__summary-qty">{item.quantity}</em>
                    </span>
                    <span className="co__summary-info">
                      <strong>{item.productName}</strong>
                      <span>
                        {item.doseLabel} · {item.strength}
                      </span>
                    </span>
                    <span className="co__summary-price">
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="co__promo">
              <input
                type="text"
                value={promo}
                onChange={(e) => {
                  setPromo(e.target.value);
                  if (promoError) setPromoError("");
                }}
                placeholder="Promo code"
                aria-label="Promo code"
                disabled={applyingPromo}
              />
              <button
                type="button"
                onClick={applyPromo}
                disabled={applyingPromo || !promo.trim()}
              >
                {applyingPromo ? "…" : "Apply"}
              </button>
            </div>
            {promoNote && <span className="co__promo-note">{promoNote}</span>}
            {promoError && (
              <span className="co__promo-note co__promo-note--err">
                {promoError}
              </span>
            )}

            <div className="co__totals">
              <div>
                <span>Subtotal</span>
                <strong>£{subtotal.toFixed(2)}</strong>
              </div>
              {discount > 0 && (
                <div>
                  <span>
                    Discount <em>({appliedCode})</em>
                  </span>
                  <strong>−£{discount.toFixed(2)}</strong>
                </div>
              )}
              <div>
                <span>Shipping</span>
                <strong>{shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}</strong>
              </div>
            </div>

            <div className="co__grand">
              <span>Total</span>
              <strong>£{total.toFixed(2)}</strong>
            </div>

            <Button
              size="lg"
              fullWidth
              className="co__place"
              disabled={submitting}
              onClick={onPlaceOrder}
            >
              {submitting
                ? "Placing order…"
                : `Place order · £${total.toFixed(2)}`}
            </Button>

            <p className="co__foot-note">
              A clinician reviews every order before dispatch — usually within
              24 hours. You'll receive confirmation and tracking to your email.
            </p>
          </aside>
        </div>
      </div>

      {/* ============ Order placed dialog ============ */}
      <AnimatePresence>
        {placed && (
          <>
            <motion.div
              className="co__scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => navigate("/account")}
            />
            <div className="co__dialog-shell">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Order placed"
                className="co__dialog"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="co__dialog-icon" aria-hidden="true">
                  <IconCheck size={24} />
                </span>
                <h2>Order placed</h2>
                <p>
                  Thank you. A clinician will review your order shortly. We've
                  emailed you a confirmation and secure link to track progress.
                </p>

                <div className="co__dialog-meta">
                  <div>
                    <span>Order reference</span>
                    <strong>{placed.orderId}</strong>
                  </div>
                  <div className="co__dialog-meta-right">
                    <span>Total</span>
                    <strong>£{placed.total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="co__dialog-actions">
                  <button
                    type="button"
                    className="co__dialog-primary"
                    onClick={() => navigate("/account")}
                  >
                    Track order
                  </button>
                  <button
                    type="button"
                    className="co__dialog-ghost"
                    onClick={() => navigate("/")}
                  >
                    Back to home
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
