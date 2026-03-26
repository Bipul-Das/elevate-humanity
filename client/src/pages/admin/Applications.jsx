// client/src/pages/admin/Applications.jsx
import { useState, useEffect } from "react";
import {
  getApplications,
  updateAppStatus,
} from "../../services/applicationService";
import toast from "react-hot-toast";

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("New"); // 'New' | 'Viewed'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getApplications();
      setApps(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load applications");
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppStatus(id, newStatus);
      toast.success(`Application marked as ${newStatus}`);
      fetchData(); // Refresh list
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="p-5 text-center text-muted">
        Loading Application Queue...
      </div>
    );

  const displayApps =
    activeTab === "New"
      ? apps.filter((a) => a.status === "Pending")
      : apps.filter((a) => a.status !== "Pending");

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-1">Application Review</h2>
          <p className="text-muted small m-0">
            Audit and process new network onboarding requests.
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="btn-group bg-white p-1 rounded-pill shadow-sm border">
          <button
            className={`btn rounded-pill px-4 fw-bold ${
              activeTab === "New"
                ? "btn-primary"
                : "btn-light text-muted border-0"
            }`}
            onClick={() => setActiveTab("New")}
          >
            PENDING QUEUE
          </button>
          <button
            className={`btn rounded-pill px-4 fw-bold ${
              activeTab === "Viewed"
                ? "btn-primary"
                : "btn-light text-muted border-0"
            }`}
            onClick={() => setActiveTab("Viewed")}
          >
            PROCESSED
          </button>
        </div>
      </div>

      <div className="row g-4">
        {displayApps.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">
            <h5>No applications found in this section.</h5>
          </div>
        ) : (
          displayApps.map((app) => (
            <div className="col-md-6" key={app._id}>
              <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
                {/* Card Header */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                  <div className="fw-bold text-secondary text-uppercase small d-flex align-items-center gap-2">
                    <span>👤</span> {app.roleRequested} REQUEST
                  </div>
                  {/* Status Badge */}
                  {app.status === "Pending" ? (
                    <span className="badge bg-warning bg-opacity-10 text-dark border border-warning px-3 py-2 rounded-pill">
                      PENDING
                    </span>
                  ) : app.status === "Approved" ? (
                    <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">
                      APPROVED
                    </span>
                  ) : (
                    <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2 rounded-pill">
                      REJECTED
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="row mb-4">
                  <div className="col-6">
                    <div className="small text-muted text-uppercase fw-bold mb-1">
                      Name
                    </div>
                    <div className="fw-bold fs-5 text-dark mb-2">
                      {app.fullName}
                    </div>
                    <div className="small text-muted mb-1">📧 {app.email}</div>
                    <div className="small text-muted font-monospace">
                      📞 {app.phone}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-light rounded-3 p-3 h-100">
                      <div className="small text-muted fw-bold mb-1">
                        📍 LOCATION
                      </div>
                      <div className="fw-bold text-dark">{app.city}</div>
                      <div className="small text-muted">{app.area}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-warning bg-opacity-10 rounded-3 p-3 mb-4 border border-warning border-opacity-25 flex-grow-1">
                  <div
                    className="small fw-bold text-warning text-uppercase mb-2"
                    style={{ color: "#d97706" }}
                  >
                    Statement of Motivation
                  </div>
                  <p className="small text-dark fst-italic m-0">
                    "{app.motivation}"
                  </p>
                </div>

                {/* Action Buttons (Only show if Pending) */}
                {activeTab === "New" && (
                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-outline-success flex-fill fw-bold rounded-3 py-2"
                      onClick={() => handleStatusChange(app._id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-outline-danger flex-fill fw-bold rounded-3 py-2"
                      onClick={() => handleStatusChange(app._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applications;
