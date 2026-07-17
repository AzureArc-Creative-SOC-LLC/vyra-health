import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../components/art/Logo";
import { useAuth } from "../context/AuthContext";
import { useSeo } from "../lib/seo";
import { apiForgotPassword } from "../services/microservices";
import "./Login.css";

type Mode = "signin" | "signup" | "forgot";

export default function Login() {
  useSeo({ title: "Log in", description: "Log in to your Vyra Health account.", path: "/login", noindex: true });
  const { user, loading, logIn, signUp, logOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialMode: Mode =
    searchParams.get("mode") === "forgot" ? "forgot" : "signin";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setInfo("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (isForgot) {
      setBusy(true);
      try {
        const res = await apiForgotPassword(email.trim().toLowerCase());
        setInfo(
          res.message ||
            "If an account exists with this email, a password reset link has been sent."
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setBusy(false);
      }
      return;
    }

    if (isSignup) {
      if (name.trim().length < 2) {
        setError("Please enter your full name.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords don't match.");
        return;
      }
      try {
        await signUp(name.trim(), email, password);
        navigate("/account");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
      return;
    }

    try {
      await logIn(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (user) {
    return (
      <div className="patient-login">
        <div className="patient-login__card">
          <div className="patient-login__brand">
            <Logo size={36} />
            <span className="patient-login__beta">BETA</span>
          </div>
          <h1 className="patient-login__title">You're signed in</h1>
          <p className="patient-login__sub">
            Logged in as <strong>{user.name}</strong> ({user.email}).
          </p>
          <Link to="/account" className="patient-login__submit">
            Go to your account
          </Link>
          <button
            type="button"
            className="patient-login__link"
            onClick={async () => {
              await logOut();
            }}
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-login">
      <div className="patient-login__card">
        <div className="patient-login__brand">
          <Logo size={36} />
          <span className="patient-login__beta">BETA</span>
        </div>

        {/* Mode switch */}
        {!isForgot && (
          <div
            className="patient-login__tabs"
            role="tablist"
            aria-label="Sign in or create account"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signin"}
              className={`patient-login__tab${mode === "signin" ? " is-active" : ""}`}
              onClick={() => switchMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              className={`patient-login__tab${isSignup ? " is-active" : ""}`}
              onClick={() => switchMode("signup")}
            >
              Create account
            </button>
          </div>
        )}

        <h1 className="patient-login__title">
          {isForgot
            ? "Reset your password"
            : isSignup
            ? "Create your account"
            : "Welcome back"}
        </h1>
        <p className="patient-login__sub">
          {isForgot
            ? "Enter your email and we'll send you a link to reset your password."
            : isSignup
            ? "Just a few details to get started."
            : "Sign in to view your treatment and orders."}
        </p>

        <form onSubmit={onSubmit} className="patient-login__form">
          {isSignup && (
            <div className="patient-login__field">
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="patient-login__field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          {!isForgot && (
            <div className="patient-login__field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            </div>
          )}

          {isSignup && (
            <div className="patient-login__field">
              <label htmlFor="signup-confirm">Confirm password</label>
              <input
                id="signup-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <p className="patient-login__error">{error}</p>}
          {info && <p className="patient-login__info">{info}</p>}

          <button
            type="submit"
            className="patient-login__submit"
            disabled={loading || busy}
          >
            {loading || busy
              ? "Please wait…"
              : isForgot
              ? "Send reset link"
              : isSignup
              ? "Create account"
              : "Sign In"}
          </button>
        </form>

        {mode === "signin" && (
          <button
            type="button"
            className="patient-login__link"
            onClick={() => switchMode("forgot")}
          >
            Forgot your password?
          </button>
        )}

        <p className="patient-login__foot">
          {isForgot ? (
            <>
              Remembered it?{" "}
              <button
                type="button"
                className="patient-login__foot-btn"
                onClick={() => switchMode("signin")}
              >
                <strong>Back to sign in</strong>
              </button>
            </>
          ) : isSignup ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="patient-login__foot-btn"
                onClick={() => switchMode("signin")}
              >
                <strong>Sign in</strong>
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="patient-login__foot-btn"
                onClick={() => switchMode("signup")}
              >
                <strong>Create one</strong>
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
