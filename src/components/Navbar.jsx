import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          HopeWorks NGO
        </Link>

        {/* Mobile Toggle */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        {/* Desktop Menu */}
        <div className="nav-links">
          <Link to="/dashboard" className={isActive("/dashboard") ? "link active" : "link"}>
            Dashboard
          </Link>

          <Link to="/my-tasks" className={isActive("/my-tasks") ? "link active" : "link"}>
            My Tasks
          </Link>

          {!user && (
            <Link to="/login" className={isActive("/login") ? "link active" : "link"}>
              Login
            </Link>
          )}

          {user ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/register" className="join-btn">
              Join Us
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/dashboard" onClick={closeMenu} className={isActive("/dashboard") ? "link active" : "link"}>
            Dashboard
          </Link>

          <Link to="/my-tasks" onClick={closeMenu} className={isActive("/my-tasks") ? "link active" : "link"}>
            My Tasks
          </Link>

          {!user && (
            <Link to="/login" onClick={closeMenu} className={isActive("/login") ? "link active" : "link"}>
              Login
            </Link>
          )}

          {user ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/register" onClick={closeMenu} className="join-btn">
              Join Us
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;