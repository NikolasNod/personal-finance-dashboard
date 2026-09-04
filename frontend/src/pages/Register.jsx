import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    setLoading(true);

    try {
        await api.post("/auth/register", {
            email,
            password
        });

        navigate("/login");
    } catch (error) {
        if (error.response) {
            setError(
                error.response.data.message ||
                "Registration failed"
            );
        } else {
            setError("Unable to connect to the server");
        }
    } finally {
        setLoading(false);
    }
};

return (
    <div className="register-page">

        <div className="register-container">

            <div className="register-brand">
                <div className="brand-icon">
                    €
                </div>

                <h1>Personal Finance</h1>

                <p>
                    Take control of your finances
                </p>
            </div>

            <div className="register-card">

                <div className="register-header">
                    <h2>Create an account</h2>

                    <p>
                        Start managing your personal finances today.
                    </p>
                </div>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">
                            Confirm password
                        </label>

                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Repeat your password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                    </div>

                    {error && (
                        <div className="register-error">
                            {error}
                        </div>
                    )}

                    <button
                        className="register-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating account...
                            </>
                        ) : (
                            "Create account"
                        )}
                    </button>

                </form>

                <div className="register-footer">
                    <span>Already have an account?</span>

                    <Link to="/login">
                        Login
                    </Link>
                </div>

            </div>

            <p className="register-copyright">
                Personal Finance Dashboard
            </p>

        </div>

    </div>
);

}

export default Register;
