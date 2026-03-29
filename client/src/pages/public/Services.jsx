// client/src/pages/public/Services.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("sponsors");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Enterprise-Grade Custom Styles for advanced animations and interactions
  const customStyles = `
    .hover-lift-card {
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .hover-lift-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
      border-color: rgba(37, 99, 235, 0.3) !important;
    }

    .animate-fade-up {
      opacity: 0;
      transform: translateY(30px);
      animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
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

    .glass-panel {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }

    /* Interactive Tab Styling */
    .role-tab {
      cursor: pointer;
      transition: all 0.3s ease;
      border-bottom: 3px solid transparent;
      padding-bottom: 1rem;
      opacity: 0.6;
    }
    
    .role-tab.active {
      border-bottom: 3px solid #2563EB;
      opacity: 1;
    }

    .role-tab:hover {
      opacity: 1;
    }

    .feature-icon-box {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: rgba(37, 99, 235, 0.1);
      color: #2563EB;
      font-weight: bold;
      font-size: 1.25rem;
    }
  `;

  // Dynamic Content for the Interactive Module
  const roleCapabilities = {
    sponsors: {
      title: "Strategic Asset Allocation",
      description:
        "For corporate donors, philanthropic entities, and logistics partners.",
      features: [
        {
          name: "Pledge Lifecycle Management",
          detail:
            "Track resource pledges from initial commitment to final-mile delivery in real-time.",
        },
        {
          name: "Dynamic Tax Reporting",
          detail:
            "Generate immutable, audited ledgers of all capital and material contributions.",
        },
        {
          name: "Targeted Campaign Funding",
          detail:
            "Allocate capital directly to algorithmic deficits or specific emergency broadcasts.",
        },
      ],
    },
    beneficiaries: {
      title: "Algorithmic Needs Broadcasting",
      description:
        "For verified NGOs, community kitchens, and disaster response leaders.",
      features: [
        {
          name: "Urgency-Weighted Requests",
          detail:
            "Broadcast highly structured resource deficits that algorithmically prioritize based on critical need.",
        },
        {
          name: "Secure Receiving Logbooks",
          detail:
            "Maintain operational integrity through mandated, digital chain-of-custody signatures.",
        },
        {
          name: "Predictive Supply Alerts",
          detail:
            "Receive automated notifications when required aid enters your designated availability zone.",
        },
      ],
    },
    responders: {
      title: "Tactical Field Coordination",
      description:
        "For active field personnel, logistics drivers, and on-ground volunteers.",
      features: [
        {
          name: "Geographic Zone Mapping",
          detail:
            "Receive dynamically generated delivery routes optimized for your specific availability zone.",
        },
        {
          name: "Encrypted Action Protocols",
          detail:
            "Access secure instructions for high-risk delivery environments and vulnerable population handling.",
        },
        {
          name: "Event Participation Ledger",
          detail:
            "Build an immutable record of field service and operational impact for your professional portfolio.",
        },
      ],
    },
  };

  return (
    <div className="bg-light overflow-hidden">
      <style>{customStyles}</style>

      {/* ================= 1. HERO SECTION (DARK ENTERPRISE) ================= */}
      <section
        className="text-center text-white position-relative"
        style={{
          backgroundColor: "#040718",
          backgroundImage: "linear-gradient(180deg, #040718 0%, #060A23 100%)",
          marginTop: "-0px",
          paddingBottom: "6rem",
          paddingTop: "7rem",
        }}
      >
        <div
          className={`container animate-fade-up ${isVisible ? "" : "d-none"}`}
        >
          <div
            className="badge border border-primary text-primary px-3 py-2 rounded-pill mb-4 fw-bold"
            style={{
              letterSpacing: "2px",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
            }}
          >
            PLATFORM CAPABILITIES
          </div>
          <h1
            className="fw-bolder mb-4 lh-sm"
            style={{
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              letterSpacing: "-1.5px",
            }}
          >
            Engineered For <span className="text-gradient">Impact.</span>
          </h1>
          <p
            className="mx-auto fs-5 text-light text-opacity-75"
            style={{ maxWidth: "800px", lineHeight: "1.8" }}
          >
            Elevate Humanity provides an enterprise-grade technical
            infrastructure designed to eliminate logistical friction, secure
            data integrity, and accelerate the delivery of life-saving resources
            globally.
          </p>
        </div>
      </section>

      {/* ================= 2. CORE INFRASTRUCTURE PILLARS ================= */}
      <section
        className="container py-5"
        style={{ marginTop: "3rem", position: "relative", zIndex: 10 }}
      >
        <div className="row g-4">
          <div
            className={`col-lg-6 animate-fade-up delay-1 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <div className="glass-panel shadow-sm rounded-4 p-5 h-100 hover-lift-card">
              <div className="feature-icon-box mb-4">⟡</div>
              <h3 className="fw-bolder text-dark mb-3">
                Immutable Chain of Custody
              </h3>
              <p className="text-muted lh-lg mb-0">
                Every transaction on the platform—from a corporate resource
                pledge to the final confirmation signature by a ground-level
                NGO—is recorded in a secure, transparent ledger. This absolute
                accountability prevents resource mismanagement and guarantees
                donor trust.
              </p>
            </div>
          </div>

          <div
            className={`col-lg-6 animate-fade-up delay-2 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <div className="glass-panel shadow-sm rounded-4 p-5 h-100 hover-lift-card">
              <div
                className="feature-icon-box mb-4 text-success"
                style={{ background: "rgba(16, 185, 129, 0.1)" }}
              >
                ⚡
              </div>
              <h3 className="fw-bolder text-dark mb-3">
                Real-Time Data Telemetry
              </h3>
              <p className="text-muted lh-lg mb-0">
                Our dashboard ecosystem ingests continuous data from field
                operatives and community broadcasts. This enables network
                administrators to visualize macro-level crisis patterns and
                re-route logistical supply chains instantaneously to areas
                facing critical deficits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. INTERACTIVE SOLUTIONS ARCHITECTURE ================= */}
      <section className="py-5 my-4 bg-white border-top border-bottom">
        <div className="container py-5">
          <div
            className={`text-center mb-5 animate-fade-up delay-1 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <h2 className="fw-bolder text-dark mb-3 fs-2">
              Solutions Architecture
            </h2>
            <p
              className="text-muted mx-auto fs-5"
              style={{ maxWidth: "700px" }}
            >
              Our strictly governed Role-Based Access Control (RBAC) environment
              ensures that each network participant accesses a tailored,
              high-performance interface suited to their mandate.
            </p>
          </div>

          {/* Interactive Role Tabs */}
          <div
            className={`d-flex flex-column flex-md-row justify-content-center gap-4 gap-md-5 mb-5 border-bottom animate-fade-up delay-2 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <div
              className={`role-tab ${activeTab === "sponsors" ? "active" : ""}`}
              onClick={() => setActiveTab("sponsors")}
            >
              <h5 className="fw-bold mb-0">01. Resource Sponsors</h5>
            </div>
            <div
              className={`role-tab ${
                activeTab === "beneficiaries" ? "active" : ""
              }`}
              onClick={() => setActiveTab("beneficiaries")}
            >
              <h5 className="fw-bold mb-0">02. Verified Beneficiaries</h5>
            </div>
            <div
              className={`role-tab ${
                activeTab === "responders" ? "active" : ""
              }`}
              onClick={() => setActiveTab("responders")}
            >
              <h5 className="fw-bold mb-0">03. Field Responders</h5>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="row justify-content-center min-vh-25">
            <div className="col-lg-10">
              <div
                className="card bg-light border-0 rounded-4 p-4 p-lg-5 shadow-sm"
                style={{ transition: "opacity 0.3s ease" }}
              >
                <div className="row g-5 align-items-center">
                  <div className="col-lg-5">
                    <h3 className="fw-bolder text-dark mb-3">
                      {roleCapabilities[activeTab].title}
                    </h3>
                    <p className="text-muted lh-lg fs-6">
                      {roleCapabilities[activeTab].description}
                    </p>
                    <Link
                      to="/apply"
                      className="fw-bold text-decoration-none text-uppercase small d-inline-flex align-items-center gap-2 mt-3"
                      style={{ letterSpacing: "1px", color: "#2563EB" }}
                    >
                      Request Authorization <span>→</span>
                    </Link>
                  </div>
                  <div className="col-lg-7">
                    <div className="d-flex flex-column gap-4">
                      {roleCapabilities[activeTab].features.map(
                        (feature, idx) => (
                          <div
                            key={idx}
                            className="d-flex gap-3 align-items-start"
                          >
                            <div className="text-primary mt-1">⊛</div>
                            <div>
                              <h6 className="fw-bold text-dark mb-1">
                                {feature.name}
                              </h6>
                              <p className="text-muted small mb-0 lh-lg">
                                {feature.detail}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. TECHNICAL STANDARDS (GRID) ================= */}
      <section className="container py-5 my-5">
        <div
          className={`text-center mb-5 animate-fade-up delay-2 ${
            isVisible ? "" : "d-none"
          }`}
        >
          <h2 className="fw-bolder text-dark mb-3">
            Enterprise Security & Compliance
          </h2>
        </div>

        <div
          className={`row g-4 animate-fade-up delay-3 ${
            isVisible ? "" : "d-none"
          }`}
        >
          <div className="col-md-4">
            <div className="border border-secondary border-opacity-25 rounded-4 p-4 h-100 bg-white">
              <h6
                className="fw-bold text-dark text-uppercase mb-3"
                style={{ letterSpacing: "1px" }}
              >
                Data Encryption
              </h6>
              <p className="text-muted small lh-lg mb-0">
                All platform traffic is secured via AES-256 encryption.
                Sensitive beneficiary data and geographic coordinates are
                protected under strict zero-trust operational protocols.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border border-secondary border-opacity-25 rounded-4 p-4 h-100 bg-white">
              <h6
                className="fw-bold text-dark text-uppercase mb-3"
                style={{ letterSpacing: "1px" }}
              >
                Identity Verification
              </h6>
              <p className="text-muted small lh-lg mb-0">
                Automated sign-ups are disabled. Every node in the network
                requires manual validation by our Coordination team to prevent
                supply chain contamination and fraud.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border border-secondary border-opacity-25 rounded-4 p-4 h-100 bg-white">
              <h6
                className="fw-bold text-dark text-uppercase mb-3"
                style={{ letterSpacing: "1px" }}
              >
                System Resilience
              </h6>
              <p className="text-muted small lh-lg mb-0">
                Engineered for high availability. In crisis scenarios, our
                backend architecture scales dynamically to handle massive
                influxes of coordination traffic without latency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. CALL TO ACTION ================= */}
      <section
        className="py-5 text-center position-relative bg-white"
        style={{ overflow: "hidden" }}
      >
        <div className="position-absolute top-0 start-50 translate-middle w-100 h-100"></div>
        <div
          className={`container py-5 position-relative z-1 animate-fade-up delay-4 ${
            isVisible ? "" : "d-none"
          }`}
        >
          <h2 className="fw-bolder text-dark mb-3 fs-1">
            Integrate With Our Network
          </h2>
          <p
            className="text-muted mx-auto mb-5 fs-5"
            style={{ maxWidth: "650px", lineHeight: "1.7" }}
          >
            Operational capacity is scaling rapidly. Submit your application to
            our Coordination team to begin the clearance protocol.
          </p>
          <Link
            to="/apply"
            className="btn btn-primary px-5 py-4 fw-bold rounded-pill shadow-lg hover-lift-card text-uppercase"
            style={{ letterSpacing: "1px" }}
          >
            Initialize Onboarding →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
