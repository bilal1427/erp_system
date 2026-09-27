import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinkClass = ({ isActive }) =>
        isActive ? "nav-link nav-link-active" : "nav-link";

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>ERP System</h2>
            </div>

            <div className="navbar-links">
                <NavLink to="/enquiries" className={navLinkClass}>
                    Enquiries
                </NavLink>
                <NavLink to="/quotations" className={navLinkClass}>
                    Quotations
                </NavLink>
                <NavLink to="/sales-orders" className={navLinkClass}>
                    Sales Orders
                </NavLink>
            </div>

            <div className="navbar-user">
                <div className="user-info">
                    <span className="navbar-user-email">{user?.name || user?.email}</span>
                    <small className="navbar-user-role">{role}</small>
                </div>
                <button type="button" onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
