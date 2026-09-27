import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Email and password are required.");
            return;
        }

        try {

            setLoading(true);

            const user = await login(
                formData.email,
                formData.password
            );

            // Both roles can access the main ERP screens.
            if (user.role === "ADMIN" || user.role === "SALES_USER") {
                navigate("/enquiries");
            }

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Login failed. Please check your credentials.";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-header">
                    <h1>ERP System</h1>
                    <p>Sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <ErrorMessage message={error} />

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />

                    </div>


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>

                </form>

                <div className="login-demo">

                    <p>Demo accounts</p>

                    <small>
                        ADMIN: admin@erp.com
                    </small>

                    <small>
                        SALES USER: sales@erp.com
                    </small>

                    <small>
                        Password: Admin@123
                    </small>

                </div>

            </div>

        </div>
    );
};

export default Login;