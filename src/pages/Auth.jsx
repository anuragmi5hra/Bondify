import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔐 LOGIN FUNCTION (HERE 👇)
  const login = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      if (!res.ok) {
        alert("Login failed");
        return;
      }

      const data = await res.json();

      // save token
      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // 📝 SIGNUP FUNCTION
  const signup = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      if (!res.ok) {
        alert("Signup failed");
        return;
      }

      navigate("/create-profile");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="center-card">
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
      <button onClick={signup}>Signup</button>
    </div>
  );
}
