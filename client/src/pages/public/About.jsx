// client/src/pages/public/About.jsx
const About = () => {
  return (
    <div className="bg-light">
      {/* Header */}
      <header className="bg-secondary text-white text-center py-5">
        <h1 className="fw-bold">Who We Are</h1>
        <p className="lead">Transparency, Integrity, and Compassion.</p>
      </header>

      <div className="container py-5">
        {/* Mission */}
        <div className="row mb-5 align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold text-primary">Our Mission</h2>
            <p className="lead text-muted">
              To bridge the gap between abundance and need. We believe that no
              one should go hungry, uneducated, or without medical care in a
              world of plenty.
            </p>
            <p>
              Founded in 2020, Elevate Humanity has grown from a small church
              pantry to a city-wide support network.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <div className="p-5 bg-white shadow rounded">
              <span className="display-1">🤝</span>
            </div>
          </div>
        </div>

        {/* Leadership */}
        <h2 className="text-center fw-bold mb-4">Meet the Leadership</h2>
        <div className="row g-4 text-center mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3">
              <div className="h1">👨‍💼</div>
              <h5 className="fw-bold">John Doe</h5>
              <p className="text-muted small">Executive Director</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3">
              <div className="h1">👩‍⚕️</div>
              <h5 className="fw-bold">Dr. Jane Smith</h5>
              <p className="text-muted small">Medical Director</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3">
              <div className="h1">👨‍💻</div>
              <h5 className="fw-bold">Lead Developer</h5>
              <p className="text-muted small">Technology & Operations</p>
            </div>
          </div>
        </div>

        {/* Transparency Section */}
        <div className="bg-white p-5 rounded shadow-sm border text-center">
          <h2 className="fw-bold mb-3">Where does your money go?</h2>
          <p className="text-muted mb-4">
            We believe in radical transparency. Here is our breakdown:
          </p>
          <div className="row justify-content-center">
            <div className="col-md-3">
              <h3 className="text-success fw-bold">85%</h3>
              <p>Direct Aid (Food, Meds, Education)</p>
            </div>
            <div className="col-md-3">
              <h3 className="text-primary fw-bold">10%</h3>
              <p>Logistics & Transport</p>
            </div>
            <div className="col-md-3">
              <h3 className="text-secondary fw-bold">5%</h3>
              <p>Admin & Operations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
