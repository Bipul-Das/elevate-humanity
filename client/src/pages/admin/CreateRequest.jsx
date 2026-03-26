// client/src/pages/admin/CreateRequest.jsx
import { useState } from "react";
import { createCase } from "../../services/caseService";
import toast from "react-hot-toast";

const CreateRequest = () => {
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // We only send the description. The backend handles the rest!
      await createCase({ description });
      toast.success("Help Request Submitted Successfully!");
      setDescription(""); // Clear the form
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit request.");
    }
  };

  return (
    <div className="container p-4" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4 fw-bold">📝 Request Assistance</h2>

      <div className="card shadow-sm border-0 p-4 rounded-4">
        {/* Automated Intake Notice */}
        <div className="alert alert-info border-0 bg-primary bg-opacity-10 text-primary mb-4 rounded-3 d-flex align-items-center gap-3">
          <span className="fs-4">🛡️</span>
          <div>
            <strong>Automated Intake Active</strong>
            <br />
            <span className="small">
              Your registered profile details (Name, Contact, and Location) will
              be securely and automatically attached to this request.
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="fw-bold small text-muted text-uppercase mb-2">
              Description / Reason for Request
            </label>
            <textarea
              className="form-control bg-light border-0 p-3"
              rows="6"
              placeholder="Please describe exactly what you need and why..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 py-3 fw-bold rounded-3 shadow-sm"
          >
            Submit Request for Review →
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;
