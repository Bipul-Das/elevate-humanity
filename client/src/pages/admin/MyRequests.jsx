// client/src/pages/admin/MyRequests.jsx
import { useState, useEffect } from "react";
import { getMyRequests } from "../../services/caseService";
import toast from "react-hot-toast";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getMyRequests();
      // Console log added so you can see exactly what the database is sending!
      console.log("My Requests Data:", res.data);
      setRequests(res.data);
    } catch (error) {
      toast.error("Failed to load your requests.");
    } finally {
      setLoading(false);
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
      border-color: rgba(37, 99, 235, 0.3) !important;
    }

    .animate-fade-up {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }

    .info-box {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 0.5rem;
    }
  `;

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <span
          className="spinner-border text-primary mb-3"
          role="status"
          style={{ width: "2.5rem", height: "2.5rem" }}
        ></span>
        <h5 className="text-muted fw-bold">Synchronizing Request Ledger...</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 p-md-5 bg-light min-vh-100">
      <style>{customStyles}</style>

      {/* Header Section */}
      <div className={`mb-5 animate-fade-up ${isVisible ? "" : "d-none"}`}>
        <h2 className="fw-bolder text-dark mb-2 d-flex align-items-center gap-3">
          <div
            className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 fs-4 d-flex align-items-center justify-content-center"
            style={{ width: "45px", height: "45px" }}
          >
            📂
          </div>
          My Submitted Requests
        </h2>
        <p className="text-muted ms-1">
          Track the real-time operational status of your submitted resource
          applications.
        </p>
      </div>

      {/* Requests Grid */}
      <div className="row g-4">
        {requests.length === 0 ? (
          <div
            className={`col-12 animate-fade-up ${isVisible ? "" : "d-none"}`}
          >
            <div className="bg-white rounded-4 shadow-sm p-5 border text-center">
              <div className="text-muted fs-1 mb-3">📄</div>
              <h4 className="fw-bold text-dark">No Active Ledger Entries</h4>
              <p className="text-muted mb-0">
                You have not submitted any resource requests to the coordination
                network yet.
              </p>
            </div>
          </div>
        ) : (
          requests.map((req, index) => {
            // 1. Check all possible success statuses
            const isHelped = [
              "Resolved",
              "Approved",
              "Helped",
              "Completed",
              "Success",
            ].includes(req.status);

            // 2. Safely extract and format the 'aidProvided' array of objects
            let itemsText = "";

            if (
              req.aidProvided &&
              Array.isArray(req.aidProvided) &&
              req.aidProvided.length > 0
            ) {
              // Map through the objects and format them as "ItemName Quantity"
              itemsText = req.aidProvided
                .map((aid) => {
                  // We check the most common database key names for items and quantities
                  const name =
                    aid.item || aid.itemName || aid.name || aid.title || "Item";
                  const qty =
                    aid.quantity || aid.qty || aid.amount || aid.count || "";
                  return `${name} ${qty}`.trim();
                })
                .join(", ");
            } else {
              // Fallback just in case some older records used a simple string
              const rawItems =
                req.providedItems ||
                req.itemsProvided ||
                req.receivedItems ||
                req.items;
              itemsText = Array.isArray(rawItems)
                ? rawItems.join(", ")
                : rawItems;
            }

            return (
              <div
                className={`col-md-6 col-xl-4 animate-fade-up`}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                key={req._id}
              >
                <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift-card bg-white overflow-hidden">
                  {/* Top Status Bar indicator */}
                  <div
                    style={{ height: "4px" }}
                    className={`w-100 ${
                      req.status === "Pending"
                        ? "bg-warning"
                        : req.status === "Rejected"
                        ? "bg-danger"
                        : isHelped
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  ></div>

                  <div className="card-body p-4 p-md-5 d-flex flex-column">
                    {/* Header: Name, Location, Status */}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div>
                        <h5 className="fw-bolder mb-1 text-dark lh-sm">
                          {req.applicantName}
                        </h5>
                        <div className="text-muted small fw-bold d-flex align-items-center gap-1">
                          <span className="text-primary">📍</span> {req.area},{" "}
                          {req.city}
                        </div>
                      </div>

                      {/* Modern Semantic Status Badges */}
                      <div>
                        {req.status === "Pending" && (
                          <span
                            className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-2 rounded-pill small fw-bold text-uppercase"
                            style={{ letterSpacing: "0.5px" }}
                          >
                            ⏱ Pending
                          </span>
                        )}
                        {req.status === "Rejected" && (
                          <span
                            className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2 rounded-pill small fw-bold text-uppercase"
                            style={{ letterSpacing: "0.5px" }}
                          >
                            ✕ Rejected
                          </span>
                        )}
                        {isHelped && (
                          <span
                            className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill small fw-bold text-uppercase"
                            style={{ letterSpacing: "0.5px" }}
                          >
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description Box */}
                    <div className="info-box p-3 mb-4 flex-grow-1">
                      <p
                        className="mb-0 small text-secondary lh-lg font-monospace"
                        style={{ fontSize: "0.85rem" }}
                      >
                        "{req.description}"
                      </p>
                    </div>

                    {/* Contact Information */}
                    <div className="d-flex flex-column gap-2 mb-4 border-bottom pb-4">
                      <div className="d-flex align-items-center gap-2 text-dark small fw-bold">
                        <span className="bg-light rounded p-1 text-muted">
                          📞
                        </span>{" "}
                        {req.phone}
                      </div>
                      {req.email && (
                        <div className="d-flex align-items-center gap-2 text-dark small fw-bold">
                          <span className="bg-light rounded p-1 text-muted">
                            ✉️
                          </span>{" "}
                          {req.email}
                        </div>
                      )}
                    </div>

                    {/* Received Items Box (Only shows if helped AND itemsText successfully generated) */}
                    {isHelped && itemsText && (
                      <div className="bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 p-3 mt-auto">
                        <div className="d-flex align-items-start gap-2">
                          <span className="text-success fs-5 lh-1">📦</span>
                          <div>
                            <span
                              className="text-success small fw-bold text-uppercase d-block mb-1"
                              style={{ letterSpacing: "0.5px" }}
                            >
                              Aid Distributed
                            </span>
                            <span className="fw-bolder text-dark small">
                              {itemsText}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Empty spacer if not helped, to keep cards aligned */}
                    {(!isHelped || !itemsText) && (
                      <div className="mt-auto pt-3">
                        <span
                          className="text-muted small text-uppercase fw-bold"
                          style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                        >
                          ID: {req._id.substring(0, 8)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyRequests;
