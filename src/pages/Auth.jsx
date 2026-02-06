import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function Auth() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();


const login = () => {
localStorage.setItem("user", JSON.stringify({ email }));
navigate("/create-profile");
};


const signup = () => {
localStorage.setItem("user", JSON.stringify({ email, password }));
navigate("/create-profile");
};


return (
<>
<Navbar />
<div className="center-card">
<input placeholder="Email" onChange={e => setEmail(e.target.value)} />
<input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
<button onClick={login}>Login</button>
<button onClick={signup}>Signup</button>
</div>
</>
);
}