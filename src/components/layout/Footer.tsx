import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Logo from "../art/Logo";
import { IconArrow, IconCheck } from "../art/Icons";
import { apiNewsletterSubscribe, ApiError } from "../../services/microservices";
import "./Footer.css";

type NewsletterStatus = "idle" | "ok" | "err";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setStatus("err");
      setMessage("Please agree to receive research updates.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus("err");
      setMessage("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiNewsletterSubscribe(email.trim(), agreed, "footer");
      setStatus("ok");
      setMessage(
        res.already_subscribed
          ? "You're already on the list — thanks!"
          : "You're on the list — thanks for joining."
      );
      setEmail("");
    } catch (err) {
      setStatus("err");
      if (err instanceof ApiError) {
        setMessage(
          err.status === 429
            ? "Too many submissions — please try again later."
            : err.message
        );
      } else {
        setMessage("Couldn't subscribe right now. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Logo size={40} light />
          <a href="mailto:help@vyrahealth.example" className="site-footer__mail">
            <span className="site-footer__mail-dot" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M8.5 14c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8M9 9.5h.01M15 9.5h.01"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            help@vyrahealth.example
          </a>
        </div>

        <div className="site-footer__info">
          <div className="site-footer__block">
            <h4>Product information</h4>
            <p>
              Vyra Health supplies pharmaceutical-grade peptide compounds prepared at
              licensed compounding facilities. Every batch is purity-tested
              (≥99%) and a certificate of analysis is available on request.
              These are compounded preparations — not branded, FDA-approved
              medicines.
            </p>
            <p>
              Vials are supplied as lyophilised (freeze-dried) powder and
              require reconstitution before use. Full instructions and dosing
              guidance are included with every order. Specifications are shared
              for informational purposes only.
            </p>
          </div>

          <div className="site-footer__block">
            <h4>Important &amp; disclaimers</h4>
            <p>
              <strong>This site is a practice / learning project</strong> — a
              UI reconstruction, not a real clinic. Nothing here is medical
              advice, no real orders are processed, and no payment is taken.
            </p>
            <p>
              GLP-1 medicines such as tirzepatide and retatrutide are the same
              active compounds found in some branded medications. Individual
              results vary. Always consult a qualified healthcare professional
              before starting any treatment. You must be 18 or over.
            </p>
          </div>

          {/* Subscribe column */}
          <div className="site-footer__block site-footer__subscribe">
            <h4>Stay in the loop</h4>
            <p>
              Batch drops, storage tips, research notes. One short email a
              month — no spam.
            </p>

            <form
              className="site-footer__sub-form"
              onSubmit={onSubscribe}
              noValidate
            >
              <div
                className={`site-footer__sub-field${
                  status === "err" ? " is-invalid" : ""
                }`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder="you@lab.com"
                  aria-label="Email address"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="site-footer__sub-btn"
                  aria-label="Subscribe"
                  disabled={submitting}
                >
                  <IconArrow size={16} />
                </button>
              </div>

              <label className="site-footer__sub-agree">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span aria-hidden="true" className="site-footer__sub-tick">
                  {agreed && <IconCheck size={11} />}
                </span>
                I agree to receive research updates.
              </label>

              {status !== "idle" && (
                <p
                  className={`site-footer__sub-msg site-footer__sub-msg--${status}`}
                  role={status === "err" ? "alert" : "status"}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="site-footer__nav">
          <Link to="/process">How it works</Link>
          <Link to="/#products">Treatments</Link>
          <Link to="/numbers">Results</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/doctors">Our doctors &amp; team</Link>
          <Link to="/affiliates">Affiliates</Link>
          <Link to="/contact">Contact support</Link>
        </div>

        <div className="site-footer__bottom">
          <span>
            © {new Date().getFullYear()} Vyra Health (practice clone). All rights
            reserved.
          </span>
          <span className="site-footer__legal">
            <Link to="/refund-policy">Refund policy</Link>
            <Link to="/contact">Contact</Link>
            <span className="site-footer__select">English · USD ($)</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
