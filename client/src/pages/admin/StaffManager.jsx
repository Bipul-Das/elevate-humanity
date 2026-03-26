// client/src/pages/admin/StaffManager.jsx
import { useState, useEffect } from "react";
import {
  getUsers,
  createStaff,
  deleteUser,
  updateStaff,
} from "../../services/adminService";
import toast from "react-hot-toast";

const StaffManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneSuffix: "", // User only types the last 5 digits
    city: "",
    area: "",
    role: "Member", // UPDATED: Default role is now 'Member'
    password: "",
  });
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load staff records");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Phone Suffix Length
    if (formData.phoneSuffix.length !== 5) {
      return toast.error("Phone number suffix must be exactly 5 digits.");
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: `10${formData.phoneSuffix}`, // Combine fixed '10' with 5 digits
      city: formData.city,
      area: formData.area,
      role: formData.role,
    };

    // Only attach password if we are creating a new user
    if (!isEditing) {
      payload.password = formData.password || "Elevate123";
    }

    try {
      if (isEditing) {
        await updateStaff(isEditing, payload);
        toast.success("Identity profile updated successfully.");
      } else {
        await createStaff(payload);
        toast.success("New account provisioned successfully.");
      }
      resetForm();
      loadStaff();
    } catch (err) {
      toast.error(err.response?.data?.error || "Provisioning failed");
    }
  };

  const handleEditClick = (user) => {
    setIsEditing(user._id);

    // Safely extract the last 5 digits assuming phone is always '10XXXXX'
    const suffix =
      user.phone && user.phone.startsWith("10") ? user.phone.substring(2) : "";

    setFormData({
      name: user.name,
      email: user.email,
      phoneSuffix: suffix,
      city: user.city || "",
      area: user.area || "",
      role: user.role,
      password: "",
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "WARNING: Are you sure you want to revoke this entity's access?"
      )
    )
      return;
    try {
      await deleteUser(id);
      toast.success("Access revoked & user deleted.");
      loadStaff();
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      name: "",
      email: "",
      phoneSuffix: "",
      city: "",
      area: "",
      role: "Member", // UPDATED
      password: "",
    });
  };

  // UI Helpers for Badges (UPDATED to match new schema)
  const getRoleBadge = (role) => {
    switch (role) {
      case "Lead Developer":
        return (
          <span className="badge rounded-pill bg-dark text-white px-3 py-2 small">
            LEAD DEV
          </span>
        );
      case "Admin":
        return (
          <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2 small">
            ADMIN
          </span>
        );
      case "Member":
        return (
          <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success px-3 py-2 small">
            MEMBER
          </span>
        );
      case "Volunteer":
        return (
          <span className="badge rounded-pill bg-warning bg-opacity-10 text-dark border border-warning px-3 py-2 small">
            VOLUNTEER
          </span>
        );
      default:
        return (
          <span className="badge rounded-pill bg-secondary px-3 py-2 small">
            {role}
          </span>
        );
    }
  };

  // Search Filter
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="p-5 text-center text-muted">
        Synchronizing Network Participants...
      </div>
    );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark d-flex align-items-center gap-2">
          <span className="text-primary">🛡️</span> Identity & Access Management
        </h2>
        <p className="text-muted small">
          Convert approved applications into active operational accounts and
          manage staff roles.
        </p>
      </div>

      <div className="row g-4">
        {/* LEFT PANEL: PROVISION ENTITY FORM */}
        <div className="col-lg-4 col-md-5">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 rounded-top-4">
              <h6 className="fw-bold text-primary mb-0 text-uppercase d-flex align-items-center gap-2">
                <span className="text-muted">👤</span>{" "}
                {isEditing ? "UPDATE ENTITY" : "PROVISION ENTITY"}
              </h6>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">
                    Entity / Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control bg-light border-0"
                    placeholder="e.g. Bruce Wayne"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">
                    Official Email
                  </label>
                  <input
                    type="email"
                    className="form-control bg-light border-0"
                    placeholder="contact@domain.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">
                    Official Phone
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted fw-bold">
                      📞 10 -
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-0 font-monospace"
                      placeholder="XXXXX"
                      maxLength="5"
                      required
                      value={formData.phoneSuffix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneSuffix: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                  </div>
                  <small className="text-muted" style={{ fontSize: "0.70rem" }}>
                    Fixed 7-digit format. Enter last 5 digits.
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-dark small">
                    Role Assignment
                  </label>
                  <select
                    className="form-select bg-light border-0 text-secondary"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    {/* UPDATED ROLE OPTIONS */}
                    <option value="Admin">Admin (Full Access)</option>
                    <option value="Member">Member (Core Operations)</option>
                    <option value="Volunteer">Volunteer (Restricted)</option>
                  </select>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-7">
                    <label className="form-label fw-bold text-dark small">
                      Street / Area
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0"
                      placeholder="e.g. Mirpur"
                      required
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-5">
                    <label className="form-label fw-bold text-dark small">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0"
                      placeholder="e.g. Dhaka"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                </div>

                {!isEditing && (
                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark small">
                      Temporary Password
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light border-0"
                      placeholder="Default: Elevate123"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.70rem" }}
                    >
                      Manually set a temporary key for the user.
                    </small>
                  </div>
                )}

                <div className="d-grid gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary fw-bold py-2 rounded-3 shadow-sm"
                  >
                    {isEditing ? "Save Configuration" : "Provision New Account"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-light fw-bold py-2 rounded-3"
                      onClick={resetForm}
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: REGISTERED PARTICIPANTS TABLE */}
        <div className="col-lg-8 col-md-7">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-white border-bottom pt-4 pb-3 px-4 d-flex justify-content-between align-items-center rounded-top-4">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2 text-uppercase">
                <span className="text-muted">⬡</span> Registered Network
                Participants
              </h6>

              {/* Search Bar */}
              <div className="input-group" style={{ width: "250px" }}>
                <span className="input-group-text bg-light border-0 text-muted">
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 small"
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4 py-3 small fw-bold text-muted text-uppercase">
                        Entity Details
                      </th>
                      <th className="py-3 small fw-bold text-muted text-uppercase text-center">
                        Role
                      </th>
                      <th className="py-3 small fw-bold text-muted text-uppercase">
                        Location & Contact
                      </th>
                      <th className="pe-4 py-3 small fw-bold text-muted text-uppercase text-end">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">
                          No participants found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u._id}>
                          <td className="ps-4 py-3">
                            <div className="fw-bold text-dark">{u.name}</div>
                            <div className="small text-muted">{u.email}</div>
                          </td>

                          <td className="py-3 text-center">
                            {getRoleBadge(u.role)}
                          </td>

                          <td className="py-3">
                            <div className="fw-bold text-dark small">
                              {/* If both exist, show with comma. Otherwise show whichever exists, or 'Location Pending' */}
                              {u.area && u.city
                                ? `${u.area}, ${u.city}`
                                : u.area || u.city || "Location Pending"}
                            </div>
                            <div className="small text-muted font-monospace">
                              {u.phone || "No Phone"}
                            </div>
                          </td>

                          <td className="pe-4 py-3 text-end">
                            <button
                              className="btn btn-sm btn-light text-primary border me-2 rounded-circle"
                              style={{ width: "35px", height: "35px" }}
                              onClick={() => handleEditClick(u)}
                              title="Edit Record"
                            >
                              ✏️
                            </button>

                            {u.role !== "Lead Developer" && (
                              <button
                                className="btn btn-sm btn-light text-danger border rounded-circle"
                                style={{ width: "35px", height: "35px" }}
                                onClick={() => handleDelete(u._id)}
                                title="Revoke Access"
                              >
                                🗑️
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManager;
