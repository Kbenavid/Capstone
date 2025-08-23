import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";


export default function NavBar({ onLogout }) {
return (
<nav className="navbar">
<div className="navbar-inner">
<div className="brand">PipeTrack</div>
<div className="nav-links">
<Link to="/" className="nav-btn">Inventory</Link>
<Link to="/jobs" className="nav-btn">Jobs</Link>
</div>
<div className="nav-actions">
<button className="btn" onClick={onLogout}>Logout</button>
</div>
</div>
</nav>
);
}