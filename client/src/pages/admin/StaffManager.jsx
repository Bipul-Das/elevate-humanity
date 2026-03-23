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

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Committee",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(null); // ID of user being edited

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load staff");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateStaff(isEditing, formData);
        toast.success("Staff Updated");
      } else {
        await createStaff(formData);
        toast.success("Staff Created");
      }
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "Committee",
        password: "",
      });
      setIsEditing(null);
      loadStaff();
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed");
    }
  };

  const handleEditClick = (user) => {
    setIsEditing(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await deleteUser(id);
      toast.success("Staff Deleted");
      loadStaff();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="p-5 text-center">Loading Staff...</div>;

  return (
    <div className="container-fluid p-4">
      <h2>👔 Staff Management</h2>
      <p className="text-muted">
        Create and Manage Org Admins and Committee Members.
      </p>

      <div className="row g-4 mt-3">
        {/* LEFT: FORM */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white">
              {isEditing ? "Edit Staff" : "Add New Staff"}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label>Full Name</label>
                  <input
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Email</label>
                  <input
                    className="form-control"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Phone</label>
                  <input
                    className="form-control"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label>Role</label>
                  <select
                    className="form-select"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option>Org Admin</option>
                    <option>Committee</option>
                    <option>Volunteer</option>
                    <option>Lead Developer</option>
                  </select>
                </div>
                {!isEditing && (
                  <div className="mb-3">
                    <label>Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Default: Elevate123"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                )}
                <button className="btn btn-primary w-100">
                  {isEditing ? "Update Staff" : "Create Account"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    className="btn btn-secondary w-100 mt-2"
                    onClick={() => {
                      setIsEditing(null);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        role: "Committee",
                        password: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT: TABLE */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="fw-bold">{u.name}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === "Lead Developer"
                              ? "bg-danger"
                              : u.role === "Org Admin"
                              ? "bg-primary"
                              : "bg-info"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="small">
                        <div>{u.email}</div>
                        <div>{u.phone}</div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-dark me-2"
                          onClick={() => handleEditClick(u)}
                        >
                          ✏️
                        </button>
                        {u.role !== "Lead Developer" && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(u._id)}
                          >
                            🗑
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManager;
