// client/src/pages/public/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImpactStats } from "../../services/publicService";

const Home = () => {
  const [stats, setStats] = useState({
    casesSolved: 0,
    volunteerCount: 0,
    totalRaised: 0,
  });

  useEffect(() => {
    // Fetch live data when page loads
    getImpactStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-light">
      {/* 1. PUBLIC NAVBAR */}
      

      {/* 2. HERO SECTION */}
      <header
        className="bg-primary text-white text-center py-5"
        style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}
      >
        <div className="container">
          <h1 className="display-3 fw-bold mb-3">
            Restoring Hope, One Life at a Time.
          </h1>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: "600px" }}>
            We provide emergency relief, medical aid, and education to those who
            need it most. Join our movement today.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link
              to="/donate"
              className="btn btn-warning btn-lg px-5 fw-bold shadow"
            >
              Give Hope (Donate)
            </Link>

            <Link
              to="/volunteer-apply"
              className="btn btn-outline-light btn-lg px-5"
            >
              Volunteer
            </Link>
          </div>
        </div>
      </header>

      {/* 3. LIVE IMPACT TICKER */}
      <section
        className="py-5 bg-white shadow-sm"
        style={{ marginTop: "-50px", position: "relative", zIndex: 10 }}
      >
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <h2 className="display-4 fw-bold text-primary">
                {stats.casesSolved}
              </h2>
              <p className="text-muted text-uppercase fw-bold">
                Lives Impacted
              </p>
            </div>
            <div className="col-md-4 border-start border-end">
              <h2 className="display-4 fw-bold text-success">
                ${stats.totalRaised.toLocaleString()}
              </h2>
              <p className="text-muted text-uppercase fw-bold">Funds Raised</p>
            </div>
            <div className="col-md-4">
              <h2 className="display-4 fw-bold text-warning">
                {stats.volunteerCount}
              </h2>
              <p className="text-muted text-uppercase fw-bold">
                Active Volunteers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR SERVICES */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How We Help</h2>
            <p className="text-muted">Direct action where it matters most.</p>
          </div>
          <div className="row g-4">
            <ServiceCard
              title="Food Security"
              icon="🍞"
              desc="Emergency grocery packs for families facing starvation."
            />
            <ServiceCard
              title="Medical Aid"
              icon="💊"
              desc="Funding surgeries and providing essential medicines."
            />
            <ServiceCard
              title="Education"
              icon="🎓"
              desc="School fees and supplies for underprivileged children."
            />
            <ServiceCard
              title="Crisis Support"
              icon="🤝"
              desc="Immediate shelter and counseling for eviction cases."
            />
          </div>
        </div>
      </section>

      
    </div>
  );
};

// Helper Component for Cards
const ServiceCard = ({ title, icon, desc }) => (
  <div className="col-md-3">
    <div className="card h-100 border-0 shadow-sm text-center p-4 hover-shadow">
      <div className="display-4 mb-3">{icon}</div>
      <h5 className="fw-bold">{title}</h5>
      <p className="text-muted small">{desc}</p>
    </div>
  </div>
);

export default Home;
