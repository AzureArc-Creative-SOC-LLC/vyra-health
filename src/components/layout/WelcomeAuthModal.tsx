import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../art/Logo";
import { useAuth } from "../../context/AuthContext";
import "./WelcomeAuthModal.css";

const STORAGE_KEY = "vyra-welcome-auth-seen";

export default function WelcomeAuthModal() {
  const { user, loading, logIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 350);
    return () => window.clearTimeout(t);
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      dismiss();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="welcome-auth__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismiss}
          />
          <div className="welcome-auth__shell">
            <motion.div
              className="welcome-auth"
              role="dialog"
              aria-modal="true"
              aria-labelledby="welcome-auth-title"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                className="welcome-auth__close"
                aria-label="Close"
                onClick={dismiss}
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

              <div className="welcome-auth__brand">
                <Logo size={36} />
                <span className="welcome-auth__beta">BETA</span>
              </div>

              <h2 id="welcome-auth-title" className="welcome-auth__title">
                Welcome
              </h2>

              <form onSubmit={onSubmit} className="welcome-auth__form">
                <div className="welcome-auth__field">
                  <label htmlFor="wa-email">Email</label>
                  <input
                    id="wa-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="welcome-auth__field">
                  <label htmlFor="wa-password">Password</label>
                  <input
                    id="wa-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="current-password"
                  />
                </div>

                {error && <p className="welcome-auth__error">{error}</p>}

                <button
                  type="submit"
                  className="welcome-auth__submit"
                  disabled={loading}
                >
                  {loading ? "Please wait…" : "Sign In"}
                </button>
              </form>

              <div className="welcome-auth__divider"><span>or</span></div>

              <Link
                to="/login"
                className="welcome-auth__portal"
                onClick={dismiss}
              >
                Go to patient portal
              </Link>

              <Link
                to="/login?mode=forgot"
                className="welcome-auth__link"
                onClick={dismiss}
              >
                Forgot your password?
              </Link>

              <p className="welcome-auth__foot">
                Don't have an account?{" "}
                <Link to="/quiz" onClick={dismiss}>
                  <strong>Sign up after completing your assessment</strong>
                </Link>
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
