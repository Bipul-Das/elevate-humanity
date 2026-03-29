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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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

  // Enterprise-Grade Custom Styles
  const customStyles = `
    .hover-lift-card {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .hover-lift-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08) !important;
      border-color: rgba(37, 99, 235, 0.2) !important;
    }

    .animate-fade-up {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }
      
    .btn-toggle-custom {
      transition: all 0.3s ease;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    
    .btn-toggle-custom.active {
      background-color: #0F172A;
      color: #FFFFFF;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  `;

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <span
          className="spinner-border text-primary mb-3"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        ></span>
        <h5 className="text-muted fw-bold">Loading Application Queue...</h5>
      </div>
    );
  }

  const displayApps =
    activeTab === "New"
      ? apps.filter((a) => a.status === "Pending")
      : apps.filter((a) => a.status !== "Pending");

  return (
    <div className="container-fluid p-4 p-md-5 bg-light min-vh-100">
      <style>{customStyles}</style>

      {/* Header & Controls */}
      <div
        className={`d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-4 animate-fade-up ${
          isVisible ? "" : "d-none"
        }`}
      >
        <div>
          <h2 className="fw-bolder text-dark mb-2 d-flex align-items-center gap-3">
            <div
              className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 fs-4 d-flex align-items-center justify-content-center"
              style={{ width: "45px", height: "45px" }}
            >
              📋
            </div>
            Application Review
          </h2>
          <p className="text-muted small m-0 ms-1">
            Audit and process new network onboarding requests.
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="bg-white p-1 rounded-pill shadow-sm border d-inline-flex">
          <button
            className={`btn btn-toggle-custom rounded-pill px-4 py-2 ${
              activeTab === "New"
                ? "active"
                : "text-muted border-0 hover-lift-card"
            }`}
            onClick={() => setActiveTab("New")}
          >
            PENDING QUEUE
          </button>
          <button
            className={`btn btn-toggle-custom rounded-pill px-4 py-2 ${
              activeTab === "Viewed"
                ? "active"
                : "text-muted border-0 hover-lift-card"
            }`}
            onClick={() => setActiveTab("Viewed")}
          >
            PROCESSED
          </button>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="row g-4 pb-5">
        {displayApps.length === 0 ? (
          <div
            className={`col-12 animate-fade-up ${isVisible ? "" : "d-none"}`}
            style={{ animationDelay: "0.1s" }}
          >
            <div className="bg-white rounded-4 shadow-sm p-5 border text-center">
              <h5 className="fw-bold text-muted mb-0">
                No applications found in this section.
              </h5>
            </div>
          </div>
        ) : (
          displayApps.map((app, index) => (
            <div
              className={`col-md-6 col-xl-4 animate-fade-up`}
              key={app._id}
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white hover-lift-card d-flex flex-column position-relative overflow-hidden">
                {/* Status Color Bar */}
                <div
                  className={`position-absolute top-0 start-0 w-100 ${
                    app.status === "Pending"
                      ? "bg-warning"
                      : app.status === "Rejected"
                      ? "bg-danger"
                      : "bg-success"
                  }`}
                  style={{ height: "4px" }}
                ></div>

                {/* Card Header */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3 mt-2">
                  <div
                    className="fw-bolder text-secondary text-uppercase small d-flex align-items-center gap-2"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    <span className="fs-5 bg-light rounded p-1">👤</span>{" "}
                    {app.roleRequested} REQUEST
                  </div>

                  {/* Semantic Status Badge */}
                  {app.status === "Pending" ? (
                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-1 rounded-pill small fw-bold">
                      PENDING
                    </span>
                  ) : app.status === "Approved" ? (
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-1 rounded-pill small fw-bold">
                      APPROVED
                    </span>
                  ) : (
                    <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-1 rounded-pill small fw-bold">
                      REJECTED
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="row mb-4">
                  <div className="col-6">
                    <div
                      className="small text-muted text-uppercase fw-bold mb-1"
                      style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                    >
                      Name
                    </div>
                    <div className="fw-bolder fs-5 text-dark mb-3 lh-sm">
                      {app.fullName}
                    </div>
                    <div className="small fw-bold text-muted mb-2 d-flex align-items-center gap-2">
                      <span className="bg-light rounded p-1">📧</span>{" "}
                      {app.email}
                    </div>
                    <div className="small fw-bold text-muted font-monospace d-flex align-items-center gap-2">
                      <span className="bg-light rounded p-1">📞</span>{" "}
                      {app.phone}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-light rounded-3 p-3 h-100 border">
                      <div
                        className="small text-muted fw-bold mb-1 text-uppercase"
                        style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                      >
                        📍 LOCATION
                      </div>
                      <div className="fw-bold text-dark mb-1">{app.city}</div>
                      <div className="small text-muted lh-sm">{app.area}</div>
                    </div>
                  </div>
                </div>

                {/* Motivation Box */}
                <div className="bg-primary bg-opacity-10 rounded-3 p-3 mb-4 border border-primary border-opacity-25 flex-grow-1">
                  <div
                    className="small fw-bolder text-primary text-uppercase mb-2 d-flex align-items-center gap-2"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    <span>🎯</span> Statement of Motivation
                  </div>
                  <p
                    className="small text-dark fst-italic m-0 lh-lg"
                    style={{ fontSize: "0.85rem" }}
                  >
                    "{app.motivation}"
                  </p>
                </div>

                {/* Action Buttons (Only show if Pending) */}
                {activeTab === "New" && (
                  <div className="d-flex gap-3 mt-auto">
                    <button
                      className="btn btn-success bg-opacity-10 text-success border border-success border-opacity-25 flex-fill fw-bold rounded-pill py-2 shadow-sm"
                      onClick={() => handleStatusChange(app._id, "Approved")}
                      style={{ transition: "all 0.2s ease" }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger bg-opacity-10 text-danger border border-danger border-opacity-25 flex-fill fw-bold rounded-pill py-2 shadow-sm"
                      onClick={() => handleStatusChange(app._id, "Rejected")}
                      style={{ transition: "all 0.2s ease" }}
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
