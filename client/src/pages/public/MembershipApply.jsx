// client/src/pages/public/MembershipApply.jsx
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MembershipApply = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would hit a new API endpoint
    toast.success("Membership Application Received! Pastor will contact you.");
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white p-4 text-center">
              <h3>Church Membership Application</h3>
              <p className="mb-0">
                Commit to the spiritual family of Elevate Humanity.
              </p>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" required />
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" required />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Marital Status</label>
                    <select className="form-select">
                      <option>Single</option>
                      <option>Married</option>
                      <option>Widowed</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Have you been baptized?</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="baptized"
                      id="yes"
                    />
                    <label className="form-check-label" htmlFor="yes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="baptized"
                      id="no"
                    />
                    <label className="form-check-label" htmlFor="no">
                      No
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Statement of Faith (Brief)
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Why do you wish to join this church body?"
                    required
                  ></textarea>
                </div>

                <button className="btn btn-dark w-100 btn-lg">
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipApply;
