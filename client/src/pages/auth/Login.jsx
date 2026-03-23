// client/src/pages/auth/Login.jsx
import { useState } from "react";
import { login } from "../../services/api";
import toast from "react-hot-toast"; // The Professional Notification
import { useNavigate } from 'react-router-dom'; // <--- ADD THIS

const Login = () => {
  // State: To store what the user types
  const navigate = useNavigate(); // <--- ADD THIS
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  // Handle Typing
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Submit button
  const onSubmit = async (e) => {
    e.preventDefault(); // Stop page refresh

    // Validation: Check empty fields
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      // Call the API Bridge
      // ... inside try block ...
      await login(email, password);
      toast.success(`Welcome back!`);

      // NEW: Redirect to Dashboard immediately
      navigate("/dashboard");

      // Temporary: Log to console to prove it worked
      console.log("Logged In Successfully!");

      // TODO: Redirect to Dashboard (We will add this next)
    } catch (error) {
      // Error Handling
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <div className="card-body">
          {/* Header */}
          <h2 className="text-center text-primary fw-bold mb-4">
            Elevate Humanity
          </h2>
          <p className="text-center text-secondary mb-4">
            Staff & Volunteer Access
          </p>

          {/* Form */}
          <form onSubmit={onSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                placeholder="Ex: admin@church.org"
                onChange={onChange}
              />
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                placeholder="Enter your secure password"
                onChange={onChange}
              />
            </div>

            {/* Submit Button */}
            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-primary btn-lg fw-bold">
                Secure Login
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-3">
            <small className="text-muted">
              Forgot Password? Contact Lead Developer.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
