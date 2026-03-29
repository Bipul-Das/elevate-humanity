// client/src/pages/admin/CreateEvent.jsx
import { useState, useEffect } from "react";
import { createEvent } from "../../services/eventService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Purely for interactive UI feedback

    try {
      await createEvent(formData);
      toast.success("Deployment Initialized Successfully!");
      navigate("/events"); // Redirect to the view events page
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to initialize deployment"
      );
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
            ➕
          </div>
          Create An Event
        </h2>
        <p className="text-muted ms-1 mb-0">
          Configure parameters for a new logistical operation or network event.
        </p>
      </div>

      {/* Form Card */}
      <div
        className={`w-100 animate-fade-up ${isVisible ? "" : "d-none"}`}
        style={{ maxWidth: "800px", animationDelay: "0.1s" }}
      >
        <div className="card shadow-sm border-0 p-4 p-md-5 rounded-4 bg-white hover-lift-card">
          {/* Admin Broadcast Notice */}
          <div className="bg-warning bg-opacity-10 border-start border-4 border-warning p-4 rounded-end mb-5 d-flex gap-3">
            <div className="text-warning fs-4 mt-1 lh-1">📡</div>
            <div>
              <strong
                className="text-dark fw-bold text-uppercase d-block mb-1"
                style={{ letterSpacing: "0.5px", fontSize: "0.85rem" }}
              >
                Network Broadcast Notice
              </strong>
              <span className="small text-muted lh-lg">
                Once initialized, this operation will be immediately visible to
                all cleared network participants. Ensure all geographic and
                temporal parameters are strictly accurate before authorization.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4 mb-4">
              <div className="col-12">
                <label
                  className="fw-bold small text-muted text-uppercase mb-2"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Operation Title
                </label>
                <input
                  type="text"
                  className="form-control-custom w-100"
                  placeholder="e.g., Downtown Food Distribution Drive"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label
                  className="fw-bold small text-muted text-uppercase mb-2"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Geographic Zone / Location
                </label>
                <input
                  type="text"
                  className="form-control-custom w-100"
                  placeholder="e.g., Central Community Center"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label
                  className="fw-bold small text-muted text-uppercase mb-2"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Scheduled Launch Date
                </label>
                <input
                  type="date"
                  className="form-control-custom w-100 text-dark"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                className="fw-bold small text-muted text-uppercase mb-2"
                style={{ letterSpacing: "0.5px" }}
              >
                Operational Parameters / Description
              </label>
              <textarea
                className="form-control-custom w-100"
                rows="6"
                placeholder="Detail the logistical requirements, target demographics, and specific duties for responding volunteers..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
                  Configuring Network...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
