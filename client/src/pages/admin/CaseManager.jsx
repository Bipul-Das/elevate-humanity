// client/src/pages/admin/CaseManager.jsx
import { useState, useEffect } from "react";
import {
  getCases,
  createCase,
  updateCaseStatus,
} from "../../services/caseService";
import toast from "react-hot-toast";

const CaseManager = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIXED STATE: Matches Backend Schema (title, type)
  const [newRequest, setNewRequest] = useState({
    title: "", // <--- Added Title
    type: "Food", // <--- Renamed from 'category' to 'type'
    beneficiaryName: "",
    phone: "",
    description: "",
    address: "",
  });

  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const res = await getCases();
      setCases(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load cases");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the data exactly as the Backend expects
      await createCase(newRequest);
      toast.success("Request Submitted. AI Calculating Urgency...");

      // Reset Form
      setNewRequest({
        title: "",
        type: "Food",
        beneficiaryName: "",
        phone: "",
        description: "",
        address: "",
      });

      loadCases();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Submission failed");
    }
  };

  const handleDecision = async (id, status) => {
    try {
      await updateCaseStatus(id, status);
      toast.success(`Case ${status}`);
      setSelectedCase(null);
      loadCases();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const getUrgencyColor = (score) => {
    if (score >= 8) return "bg-danger text-white";
    if (score >= 5) return "bg-warning text-dark";
    return "bg-success text-white";
  };

  if (loading)
    return <div className="p-5 text-center">Loading Humanitarian Data...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🚑 Case Management (Blind Review)</h2>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#requestModal"
        >
          + Simulate Request
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Priority Score</th>
                <th>Type</th>
                <th>Title</th>
                <th>Beneficiary</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c._id}>
                  <td>
                    <span
                      className={`badge rounded-pill ${getUrgencyColor(
                        c.priorityScore
                      )}`}
                    >
                      Score: {c.priorityScore}/10
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold">{c.type}</span>
                  </td>
                  <td>{c.title}</td>
                  <td className="text-secondary fst-italic">**** (Blind)</td>
                  <td>
                    <span
                      className={`badge ${
                        c.status === "Pending"
                          ? "bg-secondary"
                          : c.status === "Approved"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => setSelectedCase(c)}
                      data-bs-toggle="modal"
                      data-bs-target="#viewModal"
                    >
                      View & Decide
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Request Form (UPDATED) */}
      <div className="modal fade" id="requestModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">New Help Request</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* NEW TITLE FIELD */}
                <input
                  className="form-control mb-2"
                  placeholder="Title (e.g. Needs Insulin)"
                  value={newRequest.title}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, title: e.target.value })
                  }
                  required
                />

                <input
                  className="form-control mb-2"
                  placeholder="Beneficiary Name"
                  value={newRequest.beneficiaryName}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      beneficiaryName: e.target.value,
                    })
                  }
                  required
                />

                <input
                  className="form-control mb-2"
                  placeholder="Phone"
                  value={newRequest.phone}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, phone: e.target.value })
                  }
                  required
                />

                {/* RENAMED TO TYPE */}
                <select
                  className="form-select mb-2"
                  value={newRequest.type}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, type: e.target.value })
                  }
                >
                  <option>Food</option>
                  <option>Medical</option>
                  <option>Education</option>
                  <option>Housing</option>
                </select>

                <textarea
                  className="form-control mb-3"
                  rows="3"
                  placeholder="Description (Keywords: Starvation, Eviction)"
                  value={newRequest.description}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      description: e.target.value,
                    })
                  }
                  required
                ></textarea>

                <input
                  className="form-control mb-3"
                  placeholder="Address"
                  value={newRequest.address}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, address: e.target.value })
                  }
                  required
                />

                <button
                  className="btn btn-primary w-100"
                  data-bs-dismiss="modal"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: View Details */}
      {selectedCase && (
        <div className="modal fade" id="viewModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Case Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <strong>
                    Urgency Score: {selectedCase.priorityScore}/10
                  </strong>
                </div>
                <h4>{selectedCase.title}</h4>
                <p>
                  <strong>Type:</strong> {selectedCase.type}
                </p>
                <p>
                  <strong>Description:</strong> {selectedCase.description}
                </p>
                <hr />
                <p className="text-muted small">Revealed Identity:</p>
                <p>
                  <strong>Name:</strong> {selectedCase.beneficiaryName}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedCase.phone}
                </p>
                <p>
                  <strong>Address:</strong> {selectedCase.address}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDecision(selectedCase._id, "Rejected")}
                  data-bs-dismiss="modal"
                >
                  Reject
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleDecision(selectedCase._id, "Approved")}
                  data-bs-dismiss="modal"
                >
                  Approve Aid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManager;
