// client/src/pages/public/About.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bipulProfilePic from "../../assets/bipul.png";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Enterprise-Grade Custom Styles for SaaS-level animations
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

    .check-list li {
      position: relative;
      padding-left: 2rem;
      margin-bottom: 1.25rem;
      color: #475569;
      line-height: 1.7;
    }
    
    .check-list li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      width: 18px;
      height: 18px;
      background-color: rgba(37, 99, 235, 0.15);
      border: 2px solid #2563EB;
      border-radius: 50%;
    }

    .check-list.danger-list li::before {
      background-color: rgba(220, 38, 38, 0.15);
      border-color: #DC2626;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
    }
    
    .text-gradient {
      background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `;

  return (
    <div className="bg-white overflow-hidden">
      <style>{customStyles}</style>

      {/* ================= 1. MISSION HERO ================= */}
      <section
        className="text-center text-white position-relative"
        style={{
          backgroundColor: "#040718",
          backgroundImage:
            "radial-gradient(circle at center, rgba(37, 99, 235, 0.15) 0%, transparent 70%)",
          marginTop: "-0px",
          paddingBottom: "8rem",
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
            OUR CORE MISSION
          </div>
          <h1
            className="fw-bolder mb-4 lh-sm"
            style={{
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              letterSpacing: "-1.5px",
            }}
          >
            Standing With The Vulnerable.
            <br />
            <span className="text-gradient">Elevating Humanity.</span>
          </h1>
          <p
            className="mx-auto fs-5 text-light text-opacity-75"
            style={{ maxWidth: "800px", lineHeight: "1.8" }}
          >
            When communities are struck by crisis or marginalized by poverty,
            they require more than just sympathy—they require definitive action.
            We engineer secure, transparent distribution networks that ensure
            life-saving aid reaches the people who need it most, without delay.
          </p>
        </div>
      </section>

      {/* ================= 2. PROBLEM & SOLUTION ================= */}
      <section
        className="container"
        style={{ marginTop: "-4rem", position: "relative", zIndex: 10 }}
      >
        <div className="row g-4">
          {/* The Problem */}
          <div
            className={`col-lg-6 animate-fade-up delay-1 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <div className="glass-card shadow-lg rounded-4 p-4 p-md-5 h-100 border border-light">
              <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-4">
                <div className="bg-danger text-white rounded px-3 py-2 fw-bold fs-5 shadow-sm">
                  01
                </div>
                <div>
                  <h6
                    className="text-danger fw-bold text-uppercase mb-0"
                    style={{ letterSpacing: "1px" }}
                  >
                    The Crisis
                  </h6>
                  <h3 className="fw-bolder mb-0 text-dark">Systemic Failure</h3>
                </div>
              </div>
              <ul className="list-unstyled check-list danger-list">
                <li>
                  Vulnerable populations in severe distress often face a
                  secondary crisis: the logistical breakdown of aid delivery.
                </li>
                <li>
                  Community leaders and ground-level NGOs lack verifiable,
                  real-time channels to signal urgent deficits to those with
                  resources.
                </li>
                <li>
                  Without a transparent coordination network, critical donations
                  are misallocated, delayed, or lost while families suffer.
                </li>
              </ul>
            </div>
          </div>

          {/* The Solution */}
          <div
            className={`col-lg-6 animate-fade-up delay-2 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <div className="glass-card shadow-lg rounded-4 p-4 p-md-5 h-100 border border-light">
              <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-4">
                <div className="bg-primary text-white rounded px-3 py-2 fw-bold fs-5 shadow-sm">
                  02
                </div>
                <div>
                  <h6
                    className="text-primary fw-bold text-uppercase mb-0"
                    style={{ letterSpacing: "1px" }}
                  >
                    Our Resolution
                  </h6>
                  <h3 className="fw-bolder mb-0 text-dark">
                    Algorithmic Compassion
                  </h3>
                </div>
              </div>
              <ul className="list-unstyled check-list">
                <li>
                  A centralized, enterprise-grade network that instantly
                  connects compassionate donors with verified, active crisis
                  zones.
                </li>
                <li>
                  Structured algorithms that route resources based strictly on
                  real-time urgency and calculated community distress levels.
                </li>
                <li>
                  Deployment of verified field personnel utilizing availability
                  zones to ensure the safe, dignified, and rapid delivery of
                  aid.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. GOVERNANCE & INTEGRITY ================= */}
      <section className="py-5 mt-5" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container py-5">
          <div
            className={`text-center mb-5 animate-fade-up delay-1 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <h2 className="fw-bolder text-dark mb-3">
              Institutional Integrity
            </h2>
            <p
              className="text-muted mx-auto fs-5"
              style={{ maxWidth: "700px" }}
            >
              To protect the vulnerable communities we serve, our platform
              operates under a strict Role-Based Access Control (RBAC)
              governance model, ensuring absolute accountability.
            </p>
          </div>

          <div
            className={`row g-4 animate-fade-up delay-2 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 h-100 bg-white hover-lift-card border-top border-4 border-primary">
                <h6 className="fw-bolder text-dark mb-3 fs-5">
                  Coordination Team
                </h6>
                <p className="small text-muted mb-0 lh-lg">
                  Maintains absolute platform security. Vets incoming
                  organizational applications, prevents fraudulent activity, and
                  ensures every network participant adheres to international
                  humanitarian protocols.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 h-100 bg-white hover-lift-card border-top border-4 border-info">
                <h6 className="fw-bolder text-dark mb-3 fs-5">
                  Verified Beneficiaries
                </h6>
                <p className="small text-muted mb-0 lh-lg">
                  Registered community leaders and NGOs operating in distress
                  zones. They define explicit needs, track inbound relief, and
                  maintain the daily logbooks required for transparency.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 h-100 bg-white hover-lift-card border-top border-4 border-success">
                <h6 className="fw-bolder text-dark mb-3 fs-5">
                  Active Response Units
                </h6>
                <p className="small text-muted mb-0 lh-lg">
                  Cleared volunteers and logistics personnel. They act as the
                  physical extension of the platform, safely executing the
                  final-mile delivery of resources directly into the hands of
                  the needy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. CORE VALUES (DARK) ================= */}
      <section className="py-5" style={{ backgroundColor: "#060A23" }}>
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div
              className={`col-lg-6 animate-fade-up delay-1 ${
                isVisible ? "" : "d-none"
              }`}
            >
              <h2 className="fw-bolder text-white mb-5 fs-1">
                Our Guiding Ethos
              </h2>
              <div className="row g-4">
                <div className="col-6">
                  <div className="border-top border-primary border-opacity-50 pt-3">
                    <h5 className="text-white fw-bold mb-2">
                      Unwavering Empathy
                    </h5>
                    <p className="text-muted small">
                      We prioritize human dignity above all operational metrics.
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border-top border-primary border-opacity-50 pt-3">
                    <h5 className="text-white fw-bold mb-2">
                      Radical Transparency
                    </h5>
                    <p className="text-muted small">
                      Immutable tracking from initial pledge to physical
                      delivery.
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border-top border-primary border-opacity-50 pt-3">
                    <h5 className="text-white fw-bold mb-2">Rapid Response</h5>
                    <p className="text-muted small">
                      Optimizing code and logistics to outpace the speed of
                      crisis.
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border-top border-primary border-opacity-50 pt-3">
                    <h5 className="text-white fw-bold mb-2">
                      Absolute Integrity
                    </h5>
                    <p className="text-muted small">
                      Zero tolerance for resource mismanagement or exploitation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`col-lg-6 animate-fade-up delay-2 ${
                isVisible ? "" : "d-none"
              }`}
            >
              <div
                className="card border-secondary border-opacity-25 rounded-4 p-5 h-100"
                style={{
                  backgroundColor: "#0F172A",
                  backgroundImage:
                    "linear-gradient(to bottom right, rgba(37, 99, 235, 0.05), transparent)",
                }}
              >
                <div
                  className="bg-primary text-white rounded px-3 py-2 fw-bold d-inline-block mb-4"
                  style={{ width: "fit-content" }}
                >
                  THE IMPACT
                </div>
                <h4 className="fw-bolder text-white mb-4 fs-2">
                  Empowering The Frontlines
                </h4>
                <p className="text-light text-opacity-75 fs-6 lh-lg mb-5">
                  By engineering out logistical friction, Elevate Humanity
                  serves as the digital backbone for crisis response. We don't
                  just move resources; we are building a resilient, global
                  support structure that ensures those facing starvation,
                  poverty, or displacement are never forced to stand alone.
                </p>
                <div className="d-flex justify-content-between align-items-end border-top border-secondary border-opacity-25 pt-4">
                  <span
                    className="text-light text-opacity-50 small fw-bold text-uppercase"
                    style={{ letterSpacing: "1px" }}
                  >
                    Network Status
                  </span>
                  <span className="text-success fw-bolder fs-5 d-flex align-items-center gap-2">
                    <span
                      className="spinner-grow spinner-grow-sm text-success"
                      role="status"
                    ></span>
                    Actively Distributing Aid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. PROJECT LEADERSHIP ================= */}
      <section className="py-5 bg-white">
        <div className="container py-5 mt-3">
          <div
            className={`text-center mb-5 animate-fade-up delay-1 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <h2 className="fw-bolder text-dark">Platform Architect</h2>
          </div>

          <div
            className={`row justify-content-center animate-fade-up delay-2 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <div className="col-lg-9">
              <div
                className="card border border-light-subtle shadow-lg rounded-4 p-4 p-md-5 hover-lift-card"
                style={{ backgroundColor: "#F8FAFC" }}
              >
                <div className="d-flex flex-column flex-md-row align-items-center gap-4 gap-md-5">
                  {/* Avatar */}
                  <div className="flex-shrink-0 position-relative">
                    <div
                      className="position-absolute w-100 h-100 rounded-circle border border-primary border-opacity-25"
                      style={{ top: "-8px", left: "-8px", padding: "8px" }}
                    ></div>
                    <img
                      src={bipulProfilePic}
                      alt="Bipul Das - Lead Developer"
                      className="rounded-circle shadow-sm position-relative z-1 object-fit-cover"
                      width="160"
                      height="160"
                    />
                  </div>

                  {/* Bio */}
                  <div className="text-center text-md-start">
                    <h3 className="fw-bolder text-dark mb-1">Bipul Das</h3>
                    <p
                      className="text-primary small fw-bold text-uppercase mb-3"
                      style={{ letterSpacing: "1px" }}
                    >
                      Lead Developer & Systems Architect
                    </p>
                    <p className="text-muted fs-6 lh-lg mb-4">
                      Currently in his final semester of a B.Sc. in Computer
                      Science and Engineering at CUET, Bipul engineered the
                      Elevate Humanity platform to serve as a high-performance
                      digital lifeline for marginalized communities.
                    </p>
                    <div className="border-start border-4 border-primary ps-4 py-2 ms-md-0 ms-auto me-auto bg-primary bg-opacity-10 rounded-end">
                      <p className="text-dark small fw-semibold fst-italic mb-0 lh-lg">
                        "He ensures the codebase is meticulously architected to
                        the highest industry standards, maintaining precise
                        coordination, absolute data integrity, and real-time
                        reliability when people need it most."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. CALL TO ACTION ================= */}
      <section
        className="py-5 text-center position-relative"
        style={{ backgroundColor: "#EFF6FF", overflow: "hidden" }}
      >
        <div
          className="position-absolute top-0 start-50 translate-middle w-100 h-100"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 60%)",
          }}
        ></div>
        <div
          className={`container py-5 position-relative z-1 animate-fade-up delay-3 ${
            isVisible ? "" : "d-none"
          }`}
        >
          <h2 className="fw-bolder text-dark mb-3 fs-1">
            Stand With The Needy
          </h2>
          <p
            className="text-muted mx-auto mb-5 fs-5"
            style={{ maxWidth: "650px", lineHeight: "1.7" }}
          >
            We invite ethical sponsors, established NGOs, and dedicated
            volunteers to integrate with our network. Together, we can outpace
            crisis.
          </p>
          <Link
            to="/apply"
            className="btn btn-primary px-5 py-4 fw-bold rounded-pill shadow-lg hover-lift-card text-uppercase"
            style={{ letterSpacing: "1px" }}
          >
            Submit Network Application →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
