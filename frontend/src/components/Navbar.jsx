import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const {
        user,
        role,
        logout
    } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                <h2>ERP System</h2>
            </div>

            <div className="navbar-links">

                <NavLink to="/enquiries">
                    Enquiries
                </NavLink>

                <NavLink to="/quotations">
                    Quotations
                </NavLink>

                <NavLink to="/sales-orders">
                    Sales Orders
                </NavLink>

            </div>

            <div className="navbar-user">

                <div className="user-info">
                    <span>{user?.email}</span>
                    <small>{role}</small>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Logout
                </button>

            </div>

        </nav>
    );
};

export default Navbar;