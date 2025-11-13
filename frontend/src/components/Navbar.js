import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/") {
    return null;
  }

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={{ background: "#222", padding: "10px" }}>
      <Link to="/dashboard" style={{ color: "#fff", marginRight: "10px" }}>Dashboard</Link>
      <Link to="/items" style={{ color: "#fff", marginRight: "10px" }}>Items</Link>
      <Link to="/requests" style={{ color: "#fff", marginRight: "10px" }}>Requests</Link>
      <button onClick={logout} style={{ marginLeft: "20px" }}>Logout</button>
    </nav>
  );
}
