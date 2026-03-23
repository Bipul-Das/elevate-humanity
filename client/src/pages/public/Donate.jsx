// client/src/pages/public/Donate.jsx
import { useState, useEffect } from "react";
import { getCampaigns, donate } from "../../services/donationService"; // Reusing existing services
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Donate = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Donation State
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const res = await getCampaigns();
      setCampaigns(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Could not load causes.");
      setLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0)
      return toast.error("Please enter a valid amount");

    try {
      await donate({
        campaignId: selectedCamp._id,
        amount: Number(amount),
        isAnonymous: true, // Public donations default to anonymous
        paymentMethod: "Stripe (Simulated)",
      });

      toast.success("Thank you for your generosity! ❤");
      setAmount("");
      setSelectedCamp(null); // Close modal
      loadCampaigns(); // Refresh progress bars
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment failed");
    }
  };

  if (loading) return <div className="text-center p-5">Loading Causes...</div>;

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <div className="bg-primary text-white text-center py-5">
        <h1 className="fw-bold">Make a Difference Today</h1>
        <p className="lead">
          100% of your donation goes directly to the cause.
        </p>
        <button
          className="btn btn-outline-light btn-sm mt-2"
          onClick={() => navigate("/")}
        >
          &larr; Back Home
        </button>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {campaigns.map((camp) => {
            const percent = Math.min(
              (camp.raisedAmount / camp.targetAmount) * 100,
              100
            ).toFixed(1);
            const isFull = camp.raisedAmount >= camp.targetAmount;

            return (
              <div className="col-md-4" key={camp._id}>
                <div className="card h-100 shadow-lg border-0">
                  <div className="card-body text-center">
                    <h3 className="text-primary mb-3">{camp.title}</h3>
                    <p className="text-muted">{camp.description}</p>

                    <div className="my-4">
                      <h2 className="fw-bold">${camp.raisedAmount}</h2>
                      <small className="text-muted">
                        raised of ${camp.targetAmount} goal
                      </small>
                      <div className="progress mt-2" style={{ height: "8px" }}>
                        <div
                          className={`progress-bar ${
                            isFull ? "bg-success" : "bg-warning"
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>

                    {isFull ? (
                      <button className="btn btn-success w-100" disabled>
                        Goal Reached! 🎉
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary w-100 btn-lg shadow-sm"
                        onClick={() => setSelectedCamp(camp)}
                        data-bs-toggle="modal"
                        data-bs-target="#paymentModal"
                      >
                        Donate Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Modal */}
      <div className="modal fade" id="paymentModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">Secure Donation</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <p className="text-muted">
                You are donating to: <strong>{selectedCamp?.title}</strong>
              </p>

              <div className="mb-3">
                <label className="form-label fw-bold">Enter Amount ($)</label>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  placeholder="50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* Simulated Stripe Element */}
              <div className="p-3 bg-light border rounded mb-3">
                <small className="text-muted d-block mb-1">
                  Card Details (Secured by Stripe)
                </small>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="**** **** **** 4242"
                    disabled
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MM/YY"
                    style={{ width: "80px" }}
                    disabled
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="CVC"
                    style={{ width: "70px" }}
                    disabled
                  />
                </div>
              </div>

              <button
                className="btn btn-success w-100 btn-lg"
                onClick={handleDonate}
                data-bs-dismiss="modal"
              >
                Confirm Donation
              </button>
              <small className="text-center d-block mt-2 text-muted">
                🔒 256-bit SSL Encrypted
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
