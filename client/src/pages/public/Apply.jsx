// client/src/pages/public/Apply.jsx
import { useState } from "react";
import { submitApplication } from "../../services/applicationService";
import toast from "react-hot-toast";

const Apply = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneSuffix: "",
    city: "",
    area: "",
    roleRequested: "Volunteer",
    motivation: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phoneSuffix.length !== 5) {
      return toast.error("Phone number suffix must be exactly 5 digits.");
    }

    const payload = {
      ...formData,
      phone: `10${formData.phoneSuffix}`,
    };

    try {
      await submitApplication(payload);
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to submit application."
      );
    }
  };

  if (submitted) {
    return (
      <div
        className="container py-5 text-center"
        style={{ maxWidth: "600px", marginTop: "10vh" }}
      >
        <h2 className="fw-bold text-success mb-3">✅ Application Received</h2>
        <p className="text-muted fs-5">
          Thank you for applying to join the Elevate Humanity network. Our
          administration team will review your statement of motivation and
          operational details. You will be contacted via email regarding the
          next steps.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark">Participant Application</h2>
        <p className="text-muted">
          Please provide accurate operational details.
        </p>
      </div>

      <div className="card shadow-lg border-0 rounded-4 p-5">
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-4">
            <label className="fw-bold small text-muted text-uppercase mb-2">
              Requested Operational Role
            </label>
            <div className="d-flex gap-3">
              <label
                className={`btn flex-fill py-3 border ${
                  formData.roleRequested === "Volunteer"
                    ? "btn-primary border-primary"
                    : "btn-light text-muted"
                }`}
              >
                <input
                  type="radio"
                  className="d-none"
                  name="role"
                  value="Volunteer"
                  checked={formData.roleRequested === "Volunteer"}
                  onChange={(e) =>
                    setFormData({ ...formData, roleRequested: e.target.value })
                  }
                />
                🤝 Core Volunteer
              </label>
              <label
                className={`btn flex-fill py-3 border ${
                  formData.roleRequested === "Member"
                    ? "btn-primary border-primary"
                    : "btn-light text-muted"
                }`}
              >
                <input
                  type="radio"
                  className="d-none"
                  name="role"
                  value="Member"
                  checked={formData.roleRequested === "Member"}
                  onChange={(e) =>
                    setFormData({ ...formData, roleRequested: e.target.value })
                  }
                />
                🏛️ Committee Member
              </label>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fw-bold small text-muted">Full Name</label>
              <input
                type="text"
                className="form-control bg-light py-2"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-6">
              <label className="fw-bold small text-muted">Official Email</label>
              <input
                type="email"
                className="form-control bg-light py-2"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="fw-bold small text-muted">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted fw-bold">
                  10 -
                </span>
                <input
                  type="text"
                  className="form-control bg-light py-2"
                  maxLength="5"
                  value={formData.phoneSuffix}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneSuffix: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="fw-bold small text-muted">Area</label>
              <input
                type="text"
                className="form-control bg-light py-2"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-4">
              <label className="fw-bold small text-muted">City</label>
              <input
                type="text"
                className="form-control bg-light py-2"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="fw-bold small text-muted">
              Statement of Motivation
            </label>
            <textarea
              className="form-control bg-light"
              rows="4"
              placeholder="Please detail why you wish to join the network..."
              value={formData.motivation}
              onChange={(e) =>
                setFormData({ ...formData, motivation: e.target.value })
              }
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 py-3 fw-bold rounded-3"
          >
            Submit Application →
          </button>
          <div className="text-center mt-3 small text-muted">
            Note: No operational account is generated upon submission. All
            applications undergo manual review.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Apply;
