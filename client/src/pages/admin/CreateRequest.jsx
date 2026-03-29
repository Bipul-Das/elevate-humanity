// client/src/pages/admin/CreateRequest.jsx
import { useState, useEffect } from "react";
import { createCase } from "../../services/caseService";
import toast from "react-hot-toast";

const CreateRequest = () => {
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // purely for interactive UI feedback

    try {
      // We only send the description. The backend handles the rest!
      await createCase({ description });
      toast.success("Resource Request Successfully Transmitted!");
      setDescription(""); // Clear the form
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enterprise-Grade Custom Styles
  const customStyles = `
    .hover-lift-card {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .hover-lift-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08) !important;
    }

    .animate-fade-up {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }

    .form-control-custom {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 1rem 1.25rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      color: #0F172A;
    }

    .form-control-custom:focus {
      background-color: #FFFFFF;
      border-color: #2563EB;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      outline: none;
    }

    .form-control-custom::placeholder {
      color: #94A3B8;
    }
  `;

  return (
    <div className="container-fluid p-4 p-md-5 bg-light min-vh-100 d-flex flex-column align-items-center">
      <style>{customStyles}</style>

      {/* Header Section */}
      <div
        className={`w-100 mb-4 animate-fade-up ${isVisible ? "" : "d-none"}`}
        style={{ maxWidth: "800px" }}
      >
        <h2 className="fw-bolder text-dark mb-2 d-flex align-items-center gap-3">
          <div
            className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 fs-4 d-flex align-items-center justify-content-center"
            style={{ width: "45px", height: "45px" }}
          >
            ⊛
          </div>
          Initialize Resource Request
        </h2>
        <p className="text-muted ms-1 mb-0">
          Submit a detailed operational deficit report to the coordination
          network.
        </p>
      </div>

      {/* Form Card */}
      <div
        className={`w-100 animate-fade-up ${isVisible ? "" : "d-none"}`}
        style={{ maxWidth: "800px", animationDelay: "0.1s" }}
      >
        <div className="card shadow-sm border-0 p-4 p-md-5 rounded-4 bg-white hover-lift-card">
          {/* Automated Intake Notice (Enterprise Style) */}
          <div className="bg-primary bg-opacity-10 border-start border-4 border-primary p-4 rounded-end mb-5 d-flex gap-3">
            <div className="text-primary fs-4 mt-1 lh-1">🛡️</div>
            <div>
              <strong
                className="text-dark fw-bold text-uppercase d-block mb-1"
                style={{ letterSpacing: "0.5px", fontSize: "0.85rem" }}
              >
                Automated Intake Active
              </strong>
              <span className="small text-muted lh-lg">
                Your registered profile telemetry (Name, Contact, and Geographic
                Location) will be securely and automatically attached to this
                request payload.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                className="fw-bold small text-dark text-uppercase mb-3"
                style={{ letterSpacing: "0.5px" }}
              >
                Operational Deficit / Justification
              </label>
              <textarea
                className="form-control-custom w-100"
                rows="7"
                placeholder="Detail the exact resources required, the current situation on the ground, and the estimated impact of fulfilling this request..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-dark w-100 py-3 fw-bold rounded-pill shadow-sm d-flex justify-content-center align-items-center gap-2 text-uppercase"
              style={{ letterSpacing: "1px", transition: "all 0.3s ease" }}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Transmitting to Network...
                </>
              ) : (
                "Submit Request for Clearance →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
