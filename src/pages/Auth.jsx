import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savedEmails, setSavedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* =========================
     🔐 AUTO REDIRECT IF LOGGED IN
  ========================= */
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/dashboard");
  //   }

  //   const users = JSON.parse(localStorage.getItem("savedUsers")) || [];
  //   setSavedEmails(users);
  // }, [navigate]);

  /* =========================
     ✅ LOGIN
  ========================= */
  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // remove old token just in case
      localStorage.removeItem("token");

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (!data.token) {
        alert("Token not received from backend!");
        return;
      }

      // ✅ STORE TOKEN
      localStorage.setItem("token", data.token);

      console.log("TOKEN STORED:", localStorage.getItem("token"));

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ✅ SIGNUP
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
      console.log("SIGNUP RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      if (!data.token) {
        alert("Token not received from backend!");
        return;
      }

      // ✅ STORE TOKEN
      localStorage.setItem("token", data.token);

      // Save email locally
      const users = JSON.parse(localStorage.getItem("savedUsers")) || [];
      if (!users.includes(email)) {
        users.push(email);
        localStorage.setItem("savedUsers", JSON.stringify(users));
      }

      alert("Signup successful 🎉");

      navigate("/create-profile");

    } catch (err) {
      console.error(err);
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