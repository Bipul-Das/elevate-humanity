// client/src/pages/admin/VolunteerManager.jsx
import { useState, useEffect } from "react";
import {
  getUsers,
  getApplications,
  approveApp,
  deleteUser,
  addHours,
} from "../../services/adminService";
import toast from "react-hot-toast";

const VolunteerManager = () => {
  const [activeTab, setActiveTab] = useState("roster"); // 'roster' or 'applications'
  const [users, setUsers] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === "roster") {
        const res = await getUsers();
        setUsers(res.data);
      } else {
        const res = await getApplications();
        setApps(res.data);
      }
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  const handleApprove = async (id, name) => {
    if (!window.confirm(`Approve ${name}? They will be able to login.`)) return;
    try {
      const res = await approveApp(id);
      toast.success(res.message, { duration: 5000, icon: "🔑" }); // Show temp password
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Approval failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User removed");
      loadData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleAddHours = async (id) => {
    const hours = prompt("Enter hours to add (e.g. 5):");
    if (!hours) return;
    try {
      await addHours(id, hours);
      toast.success("Hours Logged! Checking for badges...");
      loadData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading)
    return <div className="p-5 text-center">Loading Workforce Data...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Workforce & Gamification</h2>

        <div className="btn-group">
          <button
            className={`btn ${
              activeTab === "roster" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab("roster")}
          >
            Active Roster
          </button>
          <button
            className={`btn ${
              activeTab === "applications"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab("applications")}
          >
            Pending Apps{" "}
            {apps.length > 0 && (
              <span className="badge bg-danger ms-1">{apps.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            {apps.length === 0 ? (
              <p className="text-center text-muted">No pending applications.</p>
            ) : (
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Skill</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div className="fw-bold">{app.fullName}</div>
                        <div className="small text-muted">{app.email}</div>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {app.skills}
                        </span>
                      </td>
                      <td>
                        <small>{app.reason}</small>
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleApprove(app._id, app.fullName)}
                        >
                          ✅ Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE ROSTER (GAMIFICATION) */}
      {activeTab === "roster" && (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Volunteer</th>
                  <th>Role</th>
                  <th>Skills</th>
                  <th>Gamification (Hours & Badges)</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="fw-bold">{user.name}</div>
                      <div className="small text-muted">{user.email}</div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{user.role}</span>
                    </td>
                    <td>
                      {user.skills.map((s) => (
                        <span
                          key={s}
                          className="badge bg-light text-dark border me-1"
                        >
                          {s}
                        </span>
                      ))}
                    </td>

                    {/* GAMIFICATION COLUMN */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold fs-5">
                          {user.hoursLogged} hrs
                        </span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleAddHours(user._id)}
                        >
                          + Log
                        </button>
                      </div>
                      <div className="mt-1">
                        {user.badges.map((b) => (
                          <span
                            key={b}
                            className="badge bg-warning text-dark me-1"
                          >
                            🏆 {b}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      {user.role !== "Lead Developer" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          🗑 Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerManager;
