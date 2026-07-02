import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../components/art/Logo";
import { IconArrow, IconCheck } from "../components/art/Icons";
import "./Affiliates.css";
import { useSeo } from "../lib/seo";

const tiers = [
  { pct: "15%", name: "Bronze", note: "0–10 sales" },
  { pct: "20%", name: "Silver", note: "11–50 sales" },
  { pct: "25%", name: "Gold", note: "50+ sales" },
];

type Tab = "login" | "signup";

export default function Affiliates() {
  useSeo({
    title: "Affiliate program",
    description:
      "Partner with Vyra Health — earn tiered commission by referring people to clinician-reviewed weight-loss treatments.",
    path: "/affiliates",
  });
  const [tab, setTab] = useState<Tab>("login");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="aff">
      <div className="container aff__back">
        <Link to="/">
          <IconArrow size={15} className="aff__back-icon" /> Back to shop
        </Link>
      </div>

      <header className="aff__header">
        <h1>
          Earn with <Logo size={44} />
        </h1>
        <p>
          Join our affiliate programme and earn commission on every customer
          you refer.
        </p>
      </header>

      <div className="aff__commission">
        <strong>Earn 15–25% commission on every sale</strong>
        <div className="aff__tiers">
          {tiers.map((t) => (
            <div className="aff__tier" key={t.name}>
              <span className="aff__tier-pct">{t.pct}</span>
              <span className="aff__tier-name">
                {t.name} <em>({t.note})</em>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="aff__tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "login"}
          className={tab === "login" ? "is-active" : ""}
          onClick={() => {
            setTab("login");
            setSubmitted(false);
          }}
        >
          Log in
        </button>
        <button
          role="tab"
          aria-selected={tab === "signup"}
          className={tab === "signup" ? "is-active" : ""}
          onClick={() => {
            setTab("signup");
            setSubmitted(false);
          }}
        >
          Sign up
        </button>
      </div>

      <div className="aff__card">
        {submitted ? (
          <div className="aff__done">
            <span className="aff__done-icon">
              <IconCheck size={26} />
            </span>
            <h2>You're all set</h2>
            <p>
              Thanks for joining the Vyra Health affiliate programme. We'll email your
              dashboard link and referral code shortly.
            </p>
            <button
              className="aff__done-link"
              onClick={() => {
                setSubmitted(false);
                setForm({ name: "", email: "", password: "" });
              }}
            >
              Back to the form
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.form
              key={tab}
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <h2>{tab === "login" ? "Welcome back" : "Create your account"}</h2>
              <p className="aff__card-sub">
                {tab === "login"
                  ? "Log in to your affiliate dashboard."
                  : "Set up your affiliate account in under a minute."}
              </p>

              {tab === "signup" && (
                <div className="field">
                  <label htmlFor="aff-name">Full name</label>
                  <input
                    id="aff-name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
              )}

              <div className="field">
                <label htmlFor="aff-email">Email</label>
                <input
                  id="aff-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="aff-password">Password</label>
                <input
                  id="aff-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Your password"
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="aff__submit">
                {tab === "login" ? "Sign in" : "Create account"}
              </button>
            </motion.form>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
