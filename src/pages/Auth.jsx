import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Auth() {
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

      alert("Logged in successfully 🎉");

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

      alert("Signup successful 🎉");

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

      <div className="center-card">
        <h2>Login / Signup</h2>

        <input
          list="emails"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <datalist id="emails">
          {savedEmails.map((e, i) => (
            <option key={i} value={e} />
          ))}
        </datalist>

        {!showForgot && (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={login} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <button onClick={signup} disabled={loading}>
              {loading ? "Signing up..." : "Signup"}
            </button>

            <p
              style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </p>
          </>
        )}

        {showForgot && (
          <>
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={resetPassword}>
              Reset Password
            </button>

            <p
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => setShowForgot(false)}
            >
              Back to Login
            </p>
          </>
        )}
      </div>
    </>
  );
}