// client/src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import toast from "react-hot-toast";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-primary text-white"
      : "text-white-50 hover-bg-secondary";

  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column"
      style={{ width: "250px", minHeight: "100vh", position: "fixed" }}
    >
      <h4 className="mb-4 text-primary fw-bold text-center">Elevate Admin</h4>

      <ul className="nav flex-column gap-2 mb-auto">
        {/* 1. DASHBOARD (Everyone) */}
        <li className="nav-item">
          <Link
            to="/dashboard"
            className={`nav-link rounded ${isActive("/dashboard")}`}
          >
            📊 Dashboard
          </Link>
        </li>

        {/* 2. STAFF MANAGEMENT (Lead Dev & Org Admin Only) */}
        {["Lead Developer", "Org Admin"].includes(role) && (
          <li className="nav-item">
            <Link
              to="/staff"
              className={`nav-link rounded ${isActive("/staff")}`}
            >
              👔 Staff & Users
            </Link>
          </li>
        )}

        {/* 3. FINANCE (Lead Dev & Org Admin) */}
        {["Lead Developer", "Org Admin"].includes(role) && (
          <li className="nav-item">
            <Link
              to="/campaigns"
              className={`nav-link rounded ${isActive("/campaigns")}`}
            >
              💰 Finance
            </Link>
          </li>
        )}

        {/* 4. INVENTORY (Admins & Volunteers) */}
        {["Lead Developer", "Org Admin", "Volunteer"].includes(role) && (
          <li className="nav-item">
            <Link
              to="/inventory"
              className={`nav-link rounded ${isActive("/inventory")}`}
            >
              📦 Inventory
            </Link>
          </li>
        )}

        {/* 5. CASES (Admins & Committee) */}
        {["Lead Developer", "Org Admin", "Committee"].includes(role) && (
          <li className="nav-item">
            <Link
              to="/cases"
              className={`nav-link rounded ${isActive("/cases")}`}
            >
              🚑 Case Manager
            </Link>
          </li>
        )}

        {/* 6. HR (Admins Only) */}
        {["Lead Developer", "Org Admin"].includes(role) && (
          <li className="nav-item">
            <Link
              to="/volunteers"
              className={`nav-link rounded ${isActive("/volunteers")}`}
            >
              👥 HR & Apps
            </Link>
          </li>
        )}
      </ul>

      {/* User Profile & Logout */}
      <div className="mt-4 pt-3 border-top border-secondary">
        <div className="mb-2 small text-light">
          <strong>{user?.name}</strong> <br />
          <span className="text-white-50">{user?.role}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-danger w-100 btn-sm">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
