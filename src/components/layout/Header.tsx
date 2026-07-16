import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../art/Logo";
import { IconCart, IconLock } from "../art/Icons";
import { products } from "../../data/products";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Header.css";

const SUPPORT_EMAIL = "help@vyrahealth.example";

const NAV: {
  to: string;
  label: string;
  external?: boolean;
}[] = [
  { to: "/#products", label: "Our products" },
  { to: "/#process", label: "Our process" },
  { to: "/#numbers", label: "The numbers" },
  { to: "/#reviews", label: "Reviews" },
  { to: "/#faqs", label: "FAQs" },
  { to: "/refund-policy", label: "Refund policy" },
  { to: `mailto:${SUPPORT_EMAIL}`, label: "Contact support", external: true },
  { to: "/doctors", label: "Our Doctors and Team" },
  { to: "/affiliates", label: "Affiliates" },
];

export default function Header() {
  const { user } = useAuth();
  const { count: cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const location = useLocation();

  /* Briefly pulse the cart button when the count changes upward. */
  useEffect(() => {
    if (cartCount <= 0) return;
    setPulse(true);
    const t = window.setTimeout(() => setPulse(false), 500);
    return () => window.clearTimeout(t);
  }, [cartCount]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname, location.hash, location.key]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="Vyra Health home">
          <Logo size={28} />
        </Link>

        <div className="site-header__right">
          <Link to="/doctors" className="site-header__providers">
            <IconLock size={14} />
            <span>Licensed providers</span>
          </Link>

          <Link
            to="/cart"
            className={`site-header__cart${pulse ? " is-pulse" : ""}`}
            aria-label={
              cartCount > 0
                ? `Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`
                : "Cart, empty"
            }
          >
            <IconCart size={18} />
            {cartCount > 0 && (
              <span className="site-header__cart-badge" aria-hidden="true">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <button
            className={`site-header__burger ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="site-header__scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="site-header__drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="site-header__drawer-top">
                <Logo size={26} />
                <div className="site-header__drawer-top-right">
                  <Link
                    to={user ? "/account" : "/login"}
                    className="site-header__drawer-login"
                  >
                    {user ? user.name.split(" ")[0] : "LOG IN"}
                  </Link>
                  <button
                    className="site-header__close"
                    aria-label="Close menu"
                    onClick={() => setOpen(false)}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <nav className="site-header__drawer-nav" aria-label="Primary">
                {NAV.map((item, i) => {
                  const chevron = (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  );
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.04, duration: 0.4 }}
                    >
                      {item.external ? (
                        <a
                          href={item.to}
                          className="site-header__drawer-link"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                          {chevron}
                        </a>
                      ) : (
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `site-header__drawer-link ${isActive ? "is-active" : ""}`
                          }
                        >
                          {item.label}
                          {chevron}
                        </NavLink>
                      )}
                    </motion.div>
                  );
                })}
              </nav>

              <div className="site-header__drawer-products" aria-label="Featured treatments">
                <div className="site-header__drawer-products-track">
                  {[...products, ...products].map((p, i) => {
                    const fromPrice = Math.min(...p.doses.map((d) => d.price));
                    return (
                      <Link
                        key={`${p.id}-${i}`}
                        to="/#products"
                        className="site-header__drawer-pcard"
                        onClick={() => setOpen(false)}
                      >
                        {p.badge && (
                          <span className="site-header__drawer-pcard-badge">
                            {p.badge}
                          </span>
                        )}
                        <span className="site-header__drawer-pcard-art">
                          <img
                            src={p.img}
                            alt={`${p.name} box`}
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                        <strong className="site-header__drawer-pcard-name">
                          {p.name}
                        </strong>
                        <span className="site-header__drawer-pcard-price">
                          From ${fromPrice}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
