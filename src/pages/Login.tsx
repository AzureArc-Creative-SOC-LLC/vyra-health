import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/art/Logo";
import { useAuth } from "../context/AuthContext";
import { useSeo } from "../lib/seo";
import "./Login.css";

type Mode = "signin" | "signup";

export default function Login() {
  useSeo({ title: "Log in", description: "Log in to your Vyra Health account.", path: "/login", noindex: true });
  const { user, loading, logIn, signUp, logOut } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
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
        <div
          className="patient-login__tabs"
          role="tablist"
          aria-label="Sign in or create account"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!isSignup}
            className={`patient-login__tab${!isSignup ? " is-active" : ""}`}
            onClick={() => {
              setMode("signin");
              setError("");
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isSignup}
            className={`patient-login__tab${isSignup ? " is-active" : ""}`}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Create account
          </button>
        </div>

        <h1 className="patient-login__title">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="patient-login__sub">
          {isSignup
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

          <button
            type="submit"
            className="patient-login__submit"
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : isSignup
              ? "Create account"
              : "Sign In"}
          </button>
        </form>

        {!isSignup && (
          <a
            href="#forgot"
            className="patient-login__link"
            onClick={(e) => e.preventDefault()}
          >
            Forgot your password?
          </a>
        )}

        <p className="patient-login__foot">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="patient-login__foot-btn"
                onClick={() => {
                  setMode("signin");
                  setError("");
                }}
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
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
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
