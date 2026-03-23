// client/src/pages/admin/Dashboard.jsx
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../services/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  // 1. Get User Data from Local Storage (we saved it during login)
  const user = JSON.parse(localStorage.getItem("user"));

  // 2. Logout Logic
  const handleLogout = () => {
    logout(); // Clear token
    toast.success("Logged out successfully");
    navigate("/login"); // Send back to login
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar (Simple Version) */}
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4 className="mb-4 text-primary">Elevate Admin</h4>
        <ul className="nav flex-column gap-2">
          <Link to="/inventory" className="text-decoration-none">
            <li className="nav-item p-2 text-white-50 hover-bg-secondary">
              📦 Inventory & Logistics
            </li>
          </Link>
          <Link to="/campaigns" className="text-decoration-none">
            <li className="nav-item p-2 text-white-50 hover-bg-secondary">
              💰 Campaigns & Finance
            </li>
          </Link>
          <Link to="/cases" className="text-decoration-none">
            <li className="nav-item p-2 text-white-50 hover-bg-secondary">
              🚑 Case Management
            </li>
          </Link>
          <Link to="/volunteers" className="text-decoration-none">
            <li className="nav-item p-2 text-white-50 hover-bg-secondary">
              👥 Volunteers & HR
            </li>
          </Link>
        </ul>
        <button onClick={handleLogout} className="btn btn-danger w-100 mt-5">
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 bg-light p-4">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h2>Overview</h2>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-bold text-secondary">
              Welcome, {user?.name || "Admin"}
            </span>
            <span className="badge bg-success">{user?.role}</span>
          </div>
        </header>

        {/* Stats Cards (Mock Data for now) */}
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="text-muted">Total Donations</h6>
                <h3>$12,450</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="text-muted">Pending Cases</h6>
                <h3 className="text-warning">8</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="text-muted">Low Stock Items</h6>
                <h3 className="text-danger">3</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="text-muted">Active Volunteers</h6>
                <h3 className="text-primary">24</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
