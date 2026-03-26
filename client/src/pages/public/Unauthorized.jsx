// client/src/pages/public/Unauthorized.jsx
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 w-100"
      style={{ backgroundColor: "#000000", color: "#ffffff" }}
    >
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger mb-3">403</h1>
        <h2 className="mb-4">ACCESS DENIED</h2>
        <p
          
          style={{ maxWidth: "400px", margin: "0 auto", color: "blue", paddingBottom: 20 }}
        >
          Your current clearance level does not permit access to this sector. If
          you believe this is an error, please contact the Lead Developer.
        </p>
        <Link
          to="/dashboard"
          className="btn btn-outline-light px-4 py-2 rounded-0 fw-bold"
        >
          ← RETURN TO SAFETY
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
