// client/src/pages/public/VolunteerApply.jsx
import { useState } from "react";
import { submitVolunteerApp } from "../../services/publicService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VolunteerApply = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: "General Helper",
    availability: "",
    reason: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitVolunteerApp(formData);
      toast.success("Application Received! We will contact you soon.");
      navigate("/"); // Go back home
    } catch (err) {
      toast.error(err.response?.data?.error || "Submission failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center p-4">
              <h3>Join the Mission</h3>
              <p className="mb-0">Become a Volunteer at Elevate Humanity</p>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                {/* Personal Info */}
                <h5 className="mb-3 text-secondary">Personal Details</h5>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                {/* Skills & Logistics */}
                <h5 className="mb-3 text-secondary">How can you help?</h5>
                <div className="mb-3">
                  <label className="form-label">Primary Skill</label>
                  <select
                    className="form-select"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                  >
                    <option>General Helper</option>
                    <option>Medical</option>
                    <option>Teaching</option>
                    <option>Logistics/Driving</option>
                    <option>Tech/Admin</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Availability (Days/Hours)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Weekends only, Tuesday Mornings"
                    required
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Why do you want to join?</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    required
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Submit Application
                  </button>
                  <button
                    type="button"
                    className="btn btn-link text-muted mt-2"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerApply;
