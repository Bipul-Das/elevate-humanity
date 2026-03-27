// client/src/pages/public/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLandingStats } from "../../services/publicService";

// --- INDUSTRY STANDARD ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // easeOutQuart easing function for a smooth, natural deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value); // Guarantee it lands on the exact final number
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </>
  );
};

const Home = () => {
  const [stats, setStats] = useState({
    livesImpacted: 1240,
    totalValueDistributed: 45000,
    fundsRaised: 12500,
    activeVolunteers: 85,
    networkMembers: 310,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const fetchStats = async () => {
      try {
        const res = await getLandingStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Failed to load live stats");
      }
    };
    fetchStats();
  }, []);

  // Enterprise-Grade Custom Styles
  const customStyles = `
    .premium-gradient-text {
      background: linear-gradient(135deg, #2563EB 0%, #60A5FA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hover-lift-card {
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .hover-lift-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
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
    
    .glass-panel {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
  `;

  return (
    <div className="bg-white overflow-hidden">
      <style>{customStyles}</style>

      {/* ================= HERO SECTION ================= */}
      <section
        className="container text-center pt-5 pb-4"
        style={{ marginTop: "80px" }}
      >
        <div className={`animate-fade-up ${isVisible ? "" : "d-none"}`}>
          <div
            className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-4 fw-bold shadow-sm"
            style={{ letterSpacing: "1px" }}
          >
            ELEVATE HUMANITY PLATFORM v2.0
          </div>
          <h1
            className="fw-bolder text-dark mb-2 lh-sm"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              letterSpacing: "-1.5px",
            }}
          >
            Uniting Purpose With
          </h1>
          <h1
            className="fw-bolder mb-4 premium-gradient-text lh-sm"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              letterSpacing: "-1.5px",
            }}
          >
            Measurable Impact.
          </h1>
          <p
            className="text-muted mx-auto mb-5 fs-5"
            style={{ maxWidth: "720px", lineHeight: "1.7" }}
          >
            A secure, enterprise-grade coordination network empowering global
            organizations, field volunteers, and strategic donors to route
            essential aid directly to verified communities in crisis.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/apply"
              className="btn btn-dark px-5 py-3 fw-bold rounded-pill shadow-lg hover-lift-card"
              style={{
                backgroundColor: "#060A23",
                transition: "all 0.3s ease",
              }}
            >
              Partner With Us →
            </Link>
            <Link
              to="/about"
              className="btn btn-outline-dark px-5 py-3 fw-bold rounded-pill hover-lift-card border-2"
              style={{ transition: "all 0.3s ease" }}
            >
              Explore the Platform
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 5-COLUMN LIVE METRICS BANNER ================= */}
      <section className="container mb-5 pb-5 pt-4">
        <div
          className={`rounded-4 shadow-lg p-4 p-md-5 text-white animate-fade-up delay-1 ${
            isVisible ? "" : "d-none"
          }`}
          style={{
            backgroundColor: "#060A23",
            backgroundImage:
              "radial-gradient(circle at top right, rgba(99, 160, 232, 0.15), transparent 50%)",
          }}
        >
          <div className="row text-center g-4 justify-content-center">
            <div className="col-6 col-md-4 col-lg flex-lg-grow-1">
              <h2 className="fw-bolder mb-1 fs-1">
                <AnimatedCounter value={stats.livesImpacted} suffix="+" />
              </h2>
              <div
                className="small fw-bold text-uppercase text-primary text-opacity-75"
                style={{ letterSpacing: "1px" }}
              >
                Lives Impacted
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg flex-lg-grow-1">
              <h2 className="fw-bolder mb-1 fs-1">
                <AnimatedCounter
                  value={stats.totalValueDistributed}
                  prefix="$"
                />
              </h2>
              <div
                className="small fw-bold text-uppercase text-primary text-opacity-75"
                style={{ letterSpacing: "1px" }}
              >
                Value Distributed
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg flex-lg-grow-1">
              <h2 className="fw-bolder mb-1 fs-1 text-success">
                <AnimatedCounter value={stats.fundsRaised} prefix="$" />
              </h2>
              <div
                className="small fw-bold text-uppercase text-success text-opacity-75"
                style={{ letterSpacing: "1px" }}
              >
                Capital Raised
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg flex-lg-grow-1">
              <h2 className="fw-bolder mb-1 fs-1">
                <AnimatedCounter value={stats.activeVolunteers} />
              </h2>
              <div
                className="small fw-bold text-uppercase text-primary text-opacity-75"
                style={{ letterSpacing: "1px" }}
              >
                Field Personnel
              </div>
            </div>

            <div className="col-12 col-md-4 col-lg flex-lg-grow-1">
              <h2 className="fw-bolder mb-1 fs-1">
                <AnimatedCounter value={stats.networkMembers} />
              </h2>
              <div
                className="small fw-bold text-uppercase text-primary text-opacity-75"
                style={{ letterSpacing: "1px" }}
              >
                Network Members
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ECOSYSTEM SECTION ================= */}
      <section
        className="bg-light py-5 border-top border-bottom"
        style={{ backgroundColor: "#F8FAFC" }}
      >
        <div className="container py-5">
          <div
            className={`text-center mb-5 animate-fade-up delay-2 ${
              isVisible ? "" : "d-none"
            }`}
          >
            <h2 className="fw-bolder text-dark mb-3 fs-2">
              The Elevate Humanity Ecosystem
            </h2>
            <p
              className="text-muted mx-auto fs-6"
              style={{ maxWidth: "700px", lineHeight: "1.7" }}
            >
              Our strict Role-Based Access Control (RBAC) ensures seamless,
              secure coordination between the three core operational pillars of
              our humanitarian network.
            </p>
          </div>

          <div className="row g-4">
            {/* Card 1 */}
            <div
              className={`col-lg-4 animate-fade-up delay-2 ${
                isVisible ? "" : "d-none"
              }`}
            >
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-lift-card">
                <div
                  className="mb-4 bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-3 text-primary fs-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  🤝
                </div>
                <h5 className="fw-bold text-dark fs-5">Strategic Sponsors</h5>
                <p className="text-muted small mb-0 lh-lg">
                  Organizations and philanthropists can seamlessly manage
                  resource pledges, allocate capital, and monitor the real-time,
                  tangible impact of their contributions across active crisis
                  zones.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className={`col-lg-4 animate-fade-up delay-3 ${
                isVisible ? "" : "d-none"
              }`}
            >
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-lift-card">
                <div
                  className="mb-4 bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-3 text-success fs-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  🏠
                </div>
                <h5 className="fw-bold text-dark fs-5">
                  Verified Beneficiaries
                </h5>
                <p className="text-muted small mb-0 lh-lg">
                  Vetted community leaders and NGOs can broadcast structured aid
                  requests with calculated urgency thresholds, ensuring
                  resources are routed algorithmically to areas of critical
                  need.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className={`col-lg-4 animate-fade-up delay-4 ${
                isVisible ? "" : "d-none"
              }`}
            >
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white hover-lift-card">
                <div
                  className="mb-4 bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-3 text-warning fs-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  🏃
                </div>
                <h5 className="fw-bold text-dark fs-5">
                  Active Response Teams
                </h5>
                <p className="text-muted small mb-0 lh-lg">
                  Registered field personnel and volunteers are mobilized to
                  specific geographic zones to facilitate logistics, manage
                  events, and safely execute the final-mile delivery of aid.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VERIFICATION SECTION ================= */}
      <section className="container py-5 my-5">
        <div
          className={`row align-items-center g-5 animate-fade-up delay-3 ${
            isVisible ? "" : "d-none"
          }`}
        >
          <div className="col-lg-6 pe-lg-5">
            <div
              className="mb-4 bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-circle text-primary fs-3"
              style={{ width: "60px", height: "60px" }}
            >
              🛡️
            </div>
            <h2 className="fw-bolder text-dark mb-4 fs-2">
              Uncompromising Operational Security
            </h2>
            <p className="text-muted mb-4 fs-6" style={{ lineHeight: "1.8" }}>
              To maintain the highest tier of operational integrity and
              safeguard our beneficiaries, there is no automated "Sign Up".
              Every prospective network participant undergoes a rigorous manual
              clearance protocol by our Coordination team before dashboard
              access is provisioned.
            </p>
            <Link
              to="/apply"
              className="fw-bold text-decoration-none text-uppercase small d-inline-flex align-items-center gap-2"
              style={{ letterSpacing: "1px", color: "#2563EB" }}
            >
              Review Compliance & Onboarding
              <span className="fs-5">→</span>
            </Link>
          </div>

          <div className="col-lg-6">
            <div
              className="glass-panel shadow-sm rounded-4 p-4 p-md-5 bg-white hover-lift-card"
              style={{ transition: "transform 0.4s ease" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-4">
                <span
                  className="fw-bold text-secondary text-uppercase small"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Network Acceptance Rate
                </span>
                <span className="fw-bolder text-dark fs-3">42%</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-4">
                <span
                  className="fw-bold text-secondary text-uppercase small"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Average Clearance Time
                </span>
                <span className="fw-bolder text-dark fs-3">&lt; 24h</span>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-2">
                <span
                  className="fw-bold text-secondary text-uppercase small"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Total Dynamic Capital Raised
                </span>
                <span className="fw-bolder text-success fs-3">
                  <AnimatedCounter value={stats.fundsRaised} prefix="$" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
