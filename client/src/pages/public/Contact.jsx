// client/src/pages/public/Contact.jsx
import toast from "react-hot-toast";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message Sent! We will reply shortly.");
  };

  return (
    <div className="container py-5">
      <div className="row g-5">
        {/* Left: Contact Info */}
        <div className="col-md-5">
          <h2 className="fw-bold mb-4">Get in Touch</h2>
          <p className="text-muted mb-4">
            Have questions? We'd love to hear from you.
          </p>

          <div className="d-flex mb-3">
            <span className="fs-4 me-3">📍</span>
            <div>
              <h6 className="fw-bold mb-0">Address</h6>
              <p className="text-muted">123 Hope Street, Dhaka, Bangladesh</p>
            </div>
          </div>

          <div className="d-flex mb-3">
            <span className="fs-4 me-3">📞</span>
            <div>
              <h6 className="fw-bold mb-0">Phone</h6>
              <p className="text-muted">+880 1700 000000</p>
            </div>
          </div>

          <div className="d-flex mb-3">
            <span className="fs-4 me-3">📧</span>
            <div>
              <h6 className="fw-bold mb-0">Email</h6>
              <p className="text-muted">info@elevatehumanity.org</p>
            </div>
          </div>

          {/* Mock Map */}
          <div
            className="bg-secondary rounded mt-4 d-flex align-items-center justify-content-center text-white"
            style={{ height: "200px" }}
          >
            [ Google Map Integration Would Go Here ]
          </div>
        </div>

        {/* Right: Form */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="mb-3">Send a Message</h4>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your Email"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Message"
                  required
                ></textarea>
              </div>
              <button className="btn btn-primary w-100">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
