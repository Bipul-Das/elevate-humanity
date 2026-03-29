// client/src/pages/public/Contact.jsx
import { useState, useEffect } from "react";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call for the enterprise feel
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  // Enterprise-Grade Custom Styles
  const customStyles = `
    .hover-lift-card {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .hover-lift-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08) !important;
      border-color: rgba(37, 99, 235, 0.3) !important;
    }

    .animate-fade-up {
      opacity: 0;
      transform: translateY(30px);
      animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }

    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }

    .text-gradient {
      background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .form-control-custom {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 0.8rem 1.2rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }

    .form-control-custom:focus {
      background-color: #FFFFFF;
      border-color: #2563EB;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      outline: none;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
  `;

  return (
    <div className="bg-light overflow-hidden min-vh-100">
      <style>{customStyles}</style>

      {/* ================= 1. HERO SECTION ================= */}
      <section
        className="text-center text-white position-relative"
        style={{
          backgroundColor: "#040718",
          backgroundImage: "linear-gradient(180deg, #040718 0%, #060A23 100%)",
          marginTop: "0px",
          paddingBottom: "8rem",
          paddingTop: "6rem",
        }}
      >
        <div
          className="position-absolute top-0 start-50 translate-middle w-100 h-100"
          style={{
            background:
              "radial-gradient(circle at top, rgba(37,99,235,0.15) 0%, transparent 60%)",
          }}
        ></div>
        <div
          className={`container position-relative z-1 animate-fade-up ${
            isVisible ? "" : "d-none"
          }`}
        >
          <div
            className="badge border border-primary text-primary px-3 py-2 rounded-pill mb-4 fw-bold"
            style={{
              letterSpacing: "2px",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
            }}
          >
            COMMUNICATION PROTOCOL
          </div>
          <h1
            className="fw-bolder mb-4 lh-sm"
            style={{
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              letterSpacing: "-1.5px",
            }}
          >
            Initiate <span className="text-gradient">Contact.</span>
          </h1>
          <p
            className="mx-auto fs-5 text-light text-opacity-75"
            style={{ maxWidth: "700px", lineHeight: "1.8" }}
          >
            Our Coordination Center operates continuously to facilitate seamless
            collaboration between sponsors, field responders, and verified
            beneficiaries.
          </p>
        </div>
      </section>

      {/* ================= 2. MAIN CONTACT INTERFACE ================= */}
      <section
        className="container"
        style={{
          marginTop: "5rem",
          position: "relative",
          zIndex: 10,
          paddingBottom: "5rem",
        }}
      >
        <div className="row g-5">
          {/* LEFT COLUMN: Operational Channels & HQ Info */}
          <div className="col-lg-5">
            <div
              className={`d-flex flex-column gap-4 animate-fade-up delay-1 ${
                isVisible ? "" : "d-none"
              }`}
            >
              {/* Direct Channels */}
              <div className="glass-panel shadow-sm rounded-4 p-4 hover-lift-card">
                <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
                  <div className="bg-primary bg-opacity-10 text-primary rounded px-2 py-1 fs-5">
                    ◈
                  </div>
                  <h5 className="fw-bold text-dark mb-0">
                    Strategic Partnerships
                  </h5>
                </div>
                <p className="text-muted small mb-2">
                  For corporate sponsors and international NGO integrations.
                </p>
                <a
                  href="mailto:partners@elevatehumanity.org"
                  className="text-decoration-none fw-bold text-primary"
                >
                  partners@elevatehumanity.org
                </a>
              </div>

              <div className="glass-panel shadow-sm rounded-4 p-4 hover-lift-card">
                <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
                  <div className="bg-info bg-opacity-10 text-info rounded px-2 py-1 fs-5">
                    ⌖
                  </div>
                  <h5 className="fw-bold text-dark mb-0">
                    Technical Operations
                  </h5>
                </div>
                <p className="text-muted small mb-2">
                  For platform access issues, API integrations, and security
                  disclosures.
                </p>
                <a
                  href="mailto:sysadmin@elevatehumanity.org"
                  className="text-decoration-none fw-bold text-primary"
                >
                  sysadmin@elevatehumanity.org
                </a>
              </div>

              {/* HQ Information */}
              <div className="glass-panel shadow-sm rounded-4 p-4 p-md-5 mt-2 bg-white border-top border-4 border-primary">
                <h6
                  className="fw-bold text-uppercase text-secondary small mb-4"
                  style={{ letterSpacing: "1px" }}
                >
                  Global Coordination Hub
                </h6>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <strong className="text-dark d-block mb-1">
                      Central Logistics Office
                    </strong>
                    <span className="text-muted small">Dhaka, Bangladesh</span>
                  </div>
                  <div>
                    <strong className="text-dark d-block mb-1">
                      Network Uptime
                    </strong>
                    <span className="text-success small d-flex align-items-center gap-2 fw-bold">
                      <span
                        className="spinner-grow spinner-grow-sm text-success"
                        role="status"
                        style={{ width: "10px", height: "10px" }}
                      ></span>
                      24/7 Active Monitoring
                    </span>
                  </div>
                  <div>
                    <strong className="text-dark d-block mb-1">
                      SLA Target
                    </strong>
                    <span className="text-muted small">
                      &lt; 12 Hour Response Time
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Secure Messaging Portal */}
          <div
            className={`col-lg-7 animate-fade-up delay-2 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <div className="glass-panel shadow-lg rounded-4 p-4 p-md-5 bg-white h-100">
              <div className="mb-5">
                <h3 className="fw-bolder text-dark mb-2">
                  Secure Messaging Portal
                </h3>
                <p className="text-muted small">
                  Submit your inquiry via our encrypted routing system. Our
                  coordination team will triage your request immediately.
                </p>
              </div>

              {isSuccess ? (
                <div className="text-center py-5 animate-fade-up">
                  <div
                    className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                  >
                    ✓
                  </div>
                  <h4 className="fw-bold text-dark mb-2">
                    Transmission Successful
                  </h4>
                  <p className="text-muted">
                    Your message has been securely routed to our coordination
                    team. You will receive a response within our target SLA.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="fw-bold small text-dark mb-2">
                        Full Name / Entity
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control-custom w-100 border-0 shadow-sm"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="fw-bold small text-dark mb-2">
                        Secure Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control-custom w-100 border-0 shadow-sm"
                        placeholder="john@organization.org"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="fw-bold small text-dark mb-2">
                        Inquiry Classification
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-control-custom w-100 border-0 shadow-sm"
                      >
                        <option>General Inquiry</option>
                        <option>Sponsorship & Funding</option>
                        <option>NGO Registration Help</option>
                        <option>Technical Support</option>
                        <option>Press & Media</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="fw-bold small text-dark mb-2">
                        Transmission Details
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="form-control-custom w-100 border-0 shadow-sm"
                        rows="5"
                        placeholder="Detail your operational requirements..."
                        required
                      ></textarea>
                    </div>

                    <div className="col-12 mt-4 pt-2 border-top">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm hover-lift-card d-flex align-items-center justify-content-center gap-2"
                        style={{ transition: "all 0.3s ease" }}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Encrypting & Routing...
                          </>
                        ) : (
                          "Transmit Secure Message →"
                        )}
                      </button>
                      <p
                        className="text-center text-muted small mt-3 mb-0"
                        style={{ fontSize: "0.75rem" }}
                      >
                        By transmitting, you agree to our strictly governed data
                        privacy protocols.
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
