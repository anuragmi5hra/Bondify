import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savedEmails, setSavedEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  /* =========================
     LOAD SAVED EMAILS
  ========================= */
  useEffect(() => {
    const storedEmails = JSON.parse(localStorage.getItem("savedUsers")) || [];
    setSavedEmails(storedEmails);
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      localStorage.removeItem("token");

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SIGNUP
  ========================= */
  const signup = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);

      const users = JSON.parse(localStorage.getItem("savedUsers")) || [];
      if (!users.includes(email)) {
        users.push(email);
        localStorage.setItem("savedUsers", JSON.stringify(users));
      }

      setSavedEmails(users);

      navigate("/create-profile");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FORGOT PASSWORD
  ========================= */
  const resetPassword = async () => {
    if (!email || !newPassword) {
      alert("Enter email and new password");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await res.json();

      alert(data.message);

      if (res.ok) {
        setShowForgot(false);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-shell">
        <div className="card auth-card">
          <div className="card-header">
            <div>
              <h2 className="title" style={{ margin: 0 }}>Welcome to Bondify</h2>
              <p className="subtle">A clean, secure wallet-style points experience.</p>
            </div>
          </div>

          <div className="tabs" aria-label="Auth mode">
            <button
              className={`tab ${mode === "login" ? "tab-active" : ""}`}
              onClick={() => {
                setMode("login");
                setShowForgot(false);
              }}
              type="button"
            >
              Login
            </button>
            <button
              className={`tab ${mode === "signup" ? "tab-active" : ""}`}
              onClick={() => {
                setMode("signup");
                setShowForgot(false);
              }}
              type="button"
            >
              Signup
            </button>
          </div>

          <div className="field">
            <div className="label">Email</div>
            <input
              className="input"
              list="emails"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <datalist id="emails">
              {savedEmails.map((e, i) => (
                <option key={i} value={e} />
              ))}
            </datalist>
          </div>

          {!showForgot && (
            <>
              <div className="field">
                <div className="label">Password</div>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>

              <div className="grid" style={{ gap: 10 }}>
                {mode === "login" ? (
                  <button className="btn btn-primary" onClick={login} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={signup} disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                  </button>
                )}

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEmail("");
                    setPassword("");
                  }}
                  type="button"
                  disabled={loading}
                >
                  Clear
                </button>
              </div>

              {mode === "login" && (
                <button
                  className="btn btn-ghost"
                  style={{ width: "100%", marginTop: 6 }}
                  onClick={() => setShowForgot(true)}
                  type="button"
                >
                  Forgot password?
                </button>
              )}
            </>
          )}

          {showForgot && (
            <>
              <div className="field">
                <div className="label">New password</div>
                <input
                  className="input"
                  type="password"
                  placeholder="Create a new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button className="btn btn-primary" onClick={resetPassword}>
                Reset password
              </button>

              <button className="btn btn-ghost" onClick={() => setShowForgot(false)} type="button">
                Back
              </button>
            </>
          )}

          <div className="divider" />
          <p className="hint">
            Tip: your last used emails appear in the picker for faster sign-in.
          </p>
        </div>
      </div>
    </>
  );
}