import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../components/art/Logo";
import { useSeo } from "../lib/seo";
import { apiResetPassword } from "../services/microservices";
import "./Login.css";

export default function ResetPassword() {
  useSeo({
    title: "Reset password",
    description: "Choose a new password for your Vyra Health account.",
    path: "/reset-password",
    noindex: true,
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!token) {
      setError("This reset link is missing its token. Please request a new one.");
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

    setBusy(true);
    try {
      const res = await apiResetPassword(token, password);
      setDone(true);
      setInfo(res.message || "Password has been reset successfully.");
      window.setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="patient-login">
      <div className="patient-login__card">
        <div className="patient-login__brand">
          <Logo size={36} />
          <span className="patient-login__beta">BETA</span>
        </div>

        <h1 className="patient-login__title">Choose a new password</h1>
        <p className="patient-login__sub">
          {token
            ? "Enter your new password to finish resetting your account."
            : "This reset link looks incomplete — please request a new one."}
        </p>

        <form onSubmit={onSubmit} className="patient-login__form">
          <div className="patient-login__field">
            <label htmlFor="reset-password">New password</label>
            <input
              id="reset-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={done}
            />
          </div>

          <div className="patient-login__field">
            <label htmlFor="reset-confirm">Confirm new password</label>
            <input
              id="reset-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
              disabled={done}
            />
          </div>

          {error && <p className="patient-login__error">{error}</p>}
          {info && <p className="patient-login__info">{info}</p>}

          <button
            type="submit"
            className="patient-login__submit"
            disabled={busy || done || !token}
          >
            {busy ? "Please wait…" : done ? "Password updated" : "Update password"}
          </button>
        </form>

        <p className="patient-login__foot">
          <Link to="/login">
            <strong>Back to sign in</strong>
          </Link>
        </p>
      </div>
    </div>
  );
}
