import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HelpButton from "./components/ui/HelpButton";
import WelcomeAuthModal from "./components/layout/WelcomeAuthModal";

// Home is the landing/LCP route — keep it in the main bundle so first paint
// is not blocked by an extra async chunk fetch.
import Home from "./pages/Home";

// Everything else is code-split: each route ships as its own chunk that is
// only fetched when the user navigates to it, shrinking the initial payload.
const Process = lazy(() => import("./pages/Process"));
const Numbers = lazy(() => import("./pages/Numbers"));
const Reviews = lazy(() => import("./pages/Reviews"));
const FAQs = lazy(() => import("./pages/FAQs"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Contact = lazy(() => import("./pages/Contact"));
const Doctors = lazy(() => import("./pages/Doctors"));
const Affiliates = lazy(() => import("./pages/Affiliates"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Login = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Account = lazy(() => import("./pages/Account"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

/** Scroll to top on route change, or scroll to the hashed section if one is present. */
function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      let attempts = 0;
      let cancelled = false;
      const tryScroll = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        attempts += 1;
        if (attempts < 30) {
          window.setTimeout(tryScroll, 50);
        }
      };
      tryScroll();
      return () => {
        cancelled = true;
      };
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash, key]);
  return null;
}

/** Routes wrapped with an animated cross-fade between pages. */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        className="page-main"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/process" element={<Process />} />
          <Route path="/numbers" element={<Numbers />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    // reducedMotion="user" honours prefers-reduced-motion across every
    // motion.* call site at once. The reduced-motion block in global.css only
    // caps CSS animations; framer-motion animates inline transforms via JS, so
    // without this the reveals, drawer and page cross-fade ignore the setting.
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <CartProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <ScrollToTop />
          <Header />
          <div id="main">
            <AnimatedRoutes />
          </div>
          <Footer />
          <HelpButton />
          <WelcomeAuthModal />
        </CartProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
