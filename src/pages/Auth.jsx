import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savedEmails, setSavedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("savedUsers")) || [];
    setSavedEmails(users);
  }, []);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

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
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Signup failed");

      const users = JSON.parse(localStorage.getItem("savedUsers")) || [];
      if (!users.includes(email)) {
        users.push(email);
        localStorage.setItem("savedUsers", JSON.stringify(users));
      }

      alert("Signup successful 🎉");
      navigate("/create-profile");
    } catch {
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="center-card">
        <h2>Login / Signup</h2>

        {/* ✅ EMAIL DROPDOWN */}
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
      </div>
    </>
  );
}
