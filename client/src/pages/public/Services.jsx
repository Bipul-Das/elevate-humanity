// client/src/pages/public/Services.jsx
const Services = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Our Impact Areas</h1>
        <p className="text-muted">
          Comprehensive support for body, mind, and soul.
        </p>
      </div>

      <div className="row g-4">
        {/* Service 1 */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4">
              <div className="display-4 text-primary mb-3">🍞</div>
              <h3>Food Security Drive</h3>
              <p className="text-muted">
                Our flagship program. We distribute 500+ grocery packs weekly.
                Each pack contains rice, lentils, oil, and canned goods—enough
                to feed a family of four for a week.
              </p>
            </div>
          </div>
        </div>

        {/* Service 2 */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4">
              <div className="display-4 text-danger mb-3">💊</div>
              <h3>Medical Aid Fund</h3>
              <p className="text-muted">
                Healthcare is a right, not a privilege. We partner with local
                clinics to sponsor surgeries, provide insulin for diabetics, and
                cover emergency hospital bills for the uninsured.
              </p>
            </div>
          </div>
        </div>

        {/* Service 3 */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4">
              <div className="display-4 text-warning mb-3">🎓</div>
              <h3>Education Support</h3>
              <p className="text-muted">
                Breaking the cycle of poverty. We provide scholarships, school
                uniforms, and textbooks to children in underserved communities.
              </p>
            </div>
          </div>
        </div>

        {/* Service 4 */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4">
              <div className="display-4 text-info mb-3">🕊️</div>
              <h3>Spiritual Counseling</h3>
              <p className="text-muted">
                We don't just feed the body. Our team of pastors and counselors
                offers spiritual guidance, grief counseling, and community
                prayer groups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
