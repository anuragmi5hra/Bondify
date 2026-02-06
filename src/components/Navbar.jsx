import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";  // adjust path if needed

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="Bondify Logo" className="navbar-logo" />
      </Link>

      <div>
        <button>About</button>
        <button>Contact</button>
      </div>
    </nav>
  );
}
