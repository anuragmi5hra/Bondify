import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function Navbar({ profile }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => (location.pathname === path ? "nav-link tab-active" : "nav-link");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to={localStorage.getItem("token") ? "/dashboard" : "/"} className="brand">
          <img src={logo} alt="Bondify Logo" className="navbar-logo" />
          <div className="brand-name">
            <strong>Bondify</strong>
            {/* <span>Fintech-style points wallet</span> */}
          </div>
        </Link>

        <div className="nav-links">
          <Link className={isActive("/dashboard")} to="/dashboard">
            Dashboard
          </Link>
          <Link className={isActive("/send")} to="/send">
            Send
          </Link>
          <Link className={isActive("/bonds")} to="/bonds">
            Bonds
          </Link>
          <Link className={isActive("/charity")} to="/charity">
            Charity
          </Link>
          <Link className={isActive("/edit-profile")} to="/edit-profile">
            Profile
          </Link>
        </div>

        <div className="nav-actions">
          {profile?.points !== undefined && (
            <span className="pill" title="Available points">
              <span className="pill-dot" />
              <span>
                <strong>{profile.points}</strong> pts
              </span>
            </span>
          )}

          {localStorage.getItem("token") ? (
            <button className="btn btn-ghost" onClick={logout}>
              Logout
            </button>
          ) : (
            <Link className="btn btn-primary" to="/">
              Get started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
