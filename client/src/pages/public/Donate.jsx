// client/src/pages/public/Donate.jsx
import { useState, useEffect, useRef } from "react";
import { getCampaigns, donate } from "../../services/donationService";
import toast from "react-hot-toast";

const Donate = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Safely get user if logged in, otherwise null
  const user = JSON.parse(localStorage.getItem("user"));

  // Checkout States
  const [donation, setDonation] = useState({
    id: "",
    amount: "",
    isAnonymous: false,
    title: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getCampaigns();
      setCampaigns(res.data);
    } catch (err) {
      toast.error("Failed to load active campaigns");
    } finally {
      setLoading(false);
    }
  };

  // Only show ongoing campaigns to the public
  const isEnded = (camp) =>
    camp.raisedAmount >= camp.targetAmount ||
    new Date(camp.deadline) < new Date();
  const activeCampaigns = campaigns.filter((c) => !isEnded(c));

  // Payment Formatter Helpers
  const formatCardNumber = (value) =>
    value
      .replace(/\W/gi, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .substring(0, 19);
  const formatExpiry = (value) =>
    value
      .replace(/\W/gi, "")
      .replace(/(.{2})/, "$1/")
      .substring(0, 5);

  const handleDonate = async (e) => {
    e.preventDefault();

    // Validations
    if (!donation.amount || donation.amount <= 0)
      return toast.error("Enter a valid amount");
    if (!paymentDetails.cardName)
      return toast.error("Cardholder Name is required");
    if (paymentDetails.cardNumber.replace(/\s/g, "").length !== 16)
      return toast.error("Invalid 16-digit Card Number");
    if (paymentDetails.expiry.length !== 5)
      return toast.error("Invalid Expiry Date (MM/YY)");
    if (paymentDetails.cvv.length < 3) return toast.error("Invalid CVV");

    setIsProcessing(true);

    try {
      await donate({
        campaignId: donation.id,
        amount: donation.amount,
        isAnonymous: donation.isAnonymous,
        // If logged in, use their real name/email. If public, use the name they typed on the card.
        guestName: user?.name || paymentDetails.cardName,
        guestEmail: user?.email || "guest@donation.com",
      });

      toast.success("Payment Verified & Donation Successful! 🎉");

      if (closeBtnRef.current) {
        closeBtnRef.current.click();
      }

      // Reset Forms
      setDonation({ id: "", amount: "", isAnonymous: false, title: "" });
      setPaymentDetails({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment gateway failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Enterprise Custom Styles
  const customStyles = `
    .hover-lift-card {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
      to { opacity: 1; transform: translateY(0); }
    }

    .text-gradient {
      background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `;

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <span
          className="spinner-border text-primary mb-3"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        ></span>
        <h5 className="text-muted fw-bold">
          Synchronizing Campaign Network...
        </h5>
      </div>
    );
  }

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
          <h1
            className="fw-bolder mb-4 lh-sm"
            style={{
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              letterSpacing: "-1.5px",
            }}
          >
            Fund Real <span className="text-gradient">Impact.</span>
          </h1>
          <p
            className="mx-auto fs-5 text-light text-opacity-75"
            style={{ maxWidth: "700px", lineHeight: "1.8" }}
          >
            Directly sponsor active operations. All capital is routed securely
            via AES-256 encryption and tracked immutably within our coordination
            ledger.
          </p>
        </div>
      </section>

      {/* ================= 2. ACTIVE CAMPAIGNS GRID ================= */}
      <section
        className="container"
        style={{
          marginTop: "5rem",
          position: "relative",
          zIndex: 10,
          paddingBottom: "5rem",
        }}
      >
        <div className="row g-4 justify-content-center">
          {activeCampaigns.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="bg-white rounded-4 shadow-sm p-5 border">
                <h4 className="fw-bold text-dark">No Active Campaigns</h4>
                <p className="text-muted mb-0">
                  Our operational deficits are currently fully funded. Check
                  back soon.
                </p>
              </div>
            </div>
          ) : (
            activeCampaigns.map((camp, index) => {
              const percent = Math.min(
                (camp.raisedAmount / camp.targetAmount) * 100,
                100
              ).toFixed(1);

              return (
                <div
                  className={`col-md-6 col-lg-4 animate-fade-up`}
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  key={camp._id}
                >
                  <div className="card h-100 border-0 shadow-sm rounded-4 hover-lift-card bg-white">
                    <div className="card-body p-4 p-lg-5 d-flex flex-column">
                      <div className="mb-auto">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h4 className="card-title fw-bolder text-dark mb-0 lh-sm pe-3">
                            {camp.title}
                          </h4>
                          <span className="badge bg-primary bg-opacity-10 text-primary fs-6">
                            ● Active
                          </span>
                        </div>
                        <p
                          className="card-text text-muted mb-4 lh-lg"
                          style={{ minHeight: "80px" }}
                        >
                          {camp.description}
                        </p>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small fw-bold mb-2">
                          <span className="text-dark">
                            ${camp.raisedAmount.toLocaleString()}{" "}
                            <span className="text-muted fw-normal">raised</span>
                          </span>
                          <span className="text-muted">
                            Goal: ${camp.targetAmount.toLocaleString()}
                          </span>
                        </div>
                        <div
                          className="progress rounded-pill shadow-sm mb-4"
                          style={{ height: "10px", backgroundColor: "#F1F5F9" }}
                        >
                          <div
                            className="progress-bar rounded-pill bg-primary"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>

                        <button
                          className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow-sm text-uppercase"
                          style={{ letterSpacing: "1px" }}
                          onClick={() =>
                            setDonation({
                              id: camp._id,
                              amount: "",
                              isAnonymous: false,
                              title: camp.title,
                            })
                          }
                          data-bs-toggle="modal"
                          data-bs-target="#checkoutModal"
                        >
                          Donate Now
                        </button>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent border-top p-3 text-center text-muted small fw-bold">
                      DEADLINE: {new Date(camp.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ================= 3. SECURE CHECKOUT MODAL ================= */}
      <div
        className="modal fade"
        id="checkoutModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
            <div className="modal-header bg-dark text-white border-0 p-4 pb-5 position-relative">
              <div
                className="position-absolute top-0 start-50 translate-middle w-100 h-100"
                style={{
                  background:
                    "radial-gradient(circle at top right, rgba(37,99,235,0.3) 0%, transparent 70%)",
                }}
              ></div>
              <div className="position-relative z-1 w-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h4 className="modal-title fw-bolder mb-1">
                      Secure Capital Transfer
                    </h4>
                    <p className="text-light text-opacity-75 small mb-0 fw-bold">
                      Routing to: {donation.title}
                    </p>
                  </div>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
              </div>
            </div>

            <div
              className="modal-body p-4 p-md-5"
              style={{ marginTop: "-2rem" }}
            >
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4 position-relative z-2">
                <label
                  className="form-label text-muted fw-bold text-uppercase small mb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Pledge Amount (USD)
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-transparent fw-bold border-end-0 text-muted fs-4 ps-1">
                    $
                  </span>
                  <input
                    type="number"
                    className="form-control border-start-0 border-end-0 fw-bolder fs-1 p-0 shadow-none text-dark"
                    placeholder="0.00"
                    value={donation.amount}
                    onChange={(e) =>
                      setDonation({ ...donation, amount: e.target.value })
                    }
                  />
                  <span className="input-group-text bg-transparent border-start-0 text-muted fw-bold pe-1">
                    .00
                  </span>
                </div>
              </div>

              <div className="bg-light p-4 rounded-4 border mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span
                    className="fw-bold text-dark small text-uppercase"
                    style={{ letterSpacing: "1px" }}
                  >
                    Payment Details
                  </span>
                  <div className="d-flex gap-2">
                    <span className="badge bg-secondary bg-opacity-25 text-dark border">
                      VISA
                    </span>
                    <span className="badge bg-secondary bg-opacity-25 text-dark border">
                      MC
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  <input
                    type="text"
                    className="form-control form-control-lg bg-white fs-6"
                    placeholder="Cardholder Name"
                    value={paymentDetails.cardName}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        cardName: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="form-control form-control-lg bg-white font-monospace fs-6"
                    placeholder="0000 0000 0000 0000"
                    maxLength="19"
                    value={paymentDetails.cardNumber}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        cardNumber: formatCardNumber(e.target.value),
                      })
                    }
                  />
                  <div className="row g-3">
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control form-control-lg bg-white text-center fs-6"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={paymentDetails.expiry}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            expiry: formatExpiry(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="password"
                        className="form-control form-control-lg bg-white text-center fs-6"
                        placeholder="CVV"
                        maxLength="3"
                        value={paymentDetails.cvv}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cvv: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-check form-switch mb-4 p-3 rounded-4 border bg-white d-flex align-items-center justify-content-between shadow-sm">
                <label
                  className="form-check-label text-dark fw-bold m-0 ms-2"
                  htmlFor="anonCheck"
                >
                  Process as Anonymous Proxy
                </label>
                <input
                  className="form-check-input m-0 fs-5"
                  type="checkbox"
                  role="switch"
                  id="anonCheck"
                  checked={donation.isAnonymous}
                  onChange={(e) =>
                    setDonation({ ...donation, isAnonymous: e.target.checked })
                  }
                />
              </div>

              <button
                className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm d-flex justify-content-center align-items-center gap-2"
                onClick={handleDonate}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Authenticating...
                  </>
                ) : (
                  <>🔒 Authorize ${donation.amount || "0"} Transfer</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
