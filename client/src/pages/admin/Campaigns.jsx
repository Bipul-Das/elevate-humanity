// client/src/pages/admin/Campaigns.jsx
import { useState, useEffect, useRef } from "react";
import {
  getCampaigns,
  createCampaign,
  donate,
  getAdminDonations,
} from "../../services/donationService";
import toast from "react-hot-toast";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = ["Lead Developer", "Admin"].includes(user?.role);

  // UI & Animation States
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Refs for auto-closing modals after success
  const checkoutCloseRef = useRef(null);
  const createCloseRef = useRef(null);

  // View States
  const [activeTab, setActiveTab] = useState("ongoing");

  // Form States
  const [newCamp, setNewCamp] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
  });

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

  // Ledger States
  const [viewingCampaign, setViewingCampaign] = useState(null);
  const [ledgerData, setLedgerData] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getCampaigns();
      setCampaigns(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load campaigns");
      setLoading(false);
    }
  };

  // --- FILTERING LOGIC ---
  const isEnded = (camp) =>
    camp.raisedAmount >= camp.targetAmount ||
    new Date(camp.deadline) < new Date();

  const ongoingCampaigns = campaigns.filter((c) => !isEnded(c));
  const endedCampaigns = campaigns.filter((c) => isEnded(c));
  const displayCampaigns =
    isAdmin && activeTab === "ended" ? endedCampaigns : ongoingCampaigns;

  // --- ACTIONS ---
  const handleCreate = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(newCamp.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return toast.error("Campaign deadline must be a future date");
    }

    setIsCreating(true);
    try {
      await createCampaign(newCamp);
      toast.success("Campaign Launched! 🚀");
      setNewCamp({
        title: "",
        description: "",
        targetAmount: "",
        deadline: "",
      });
      if (createCloseRef.current) createCloseRef.current.click();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Creation failed");
    } finally {
      setIsCreating(false);
    }
  };

  // Fetch Donations
  const fetchDonations = async (camp) => {
    setViewingCampaign(camp);
    setLedgerLoading(true);
    try {
      const res = await getAdminDonations(camp._id);
      setLedgerData(res.data);
    } catch (err) {
      toast.error("Failed to load donation ledger.");
      setLedgerData([]);
    } finally {
      setLedgerLoading(false);
    }
  };

  // Payment Formatter Helpers
  const formatCardNumber = (value) => {
    return value
      .replace(/\W/gi, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .substring(0, 19);
  };

  const formatExpiry = (value) => {
    return value
      .replace(/\W/gi, "")
      .replace(/(.{2})/, "$1/")
      .substring(0, 5);
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!donation.amount || donation.amount <= 0)
      return toast.error("Enter a valid amount");
    if (!paymentDetails.cardName)
      return toast.error("Cardholder Name is required");
    if (paymentDetails.cardNumber.replace(/\s/g, "").length !== 16)
      return toast.error("Invalid 16-digit Card Number");
    if (paymentDetails.expiry.length !== 5)
      return toast.error("Invalid Expiry Date (MM/YY)");
    if (paymentDetails.cvv.length < 3) return toast.error("Invalid CVV");

    setIsProcessingCheckout(true);
    try {
      await donate({
        campaignId: donation.id,
        amount: donation.amount,
        isAnonymous: donation.isAnonymous,
        guestName: user?.name || paymentDetails.cardName,
        guestEmail: user?.email || "guest@donation.com",
      });

      toast.success("Payment Verified & Donation Successful! 🎉");

      if (checkoutCloseRef.current) checkoutCloseRef.current.click();
      setDonation({ id: "", amount: "", isAnonymous: false, title: "" });
      setPaymentDetails({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment gateway failed");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // Enterprise-Grade Custom Styles
  const customStyles = `
    .hover-lift-card {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .hover-lift-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
      border-color: rgba(37, 99, 235, 0.2) !important;
    }

    .animate-fade-up {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }

    .tab-custom {
      cursor: pointer;
      transition: all 0.3s ease;
      border-bottom: 3px solid transparent;
      padding-bottom: 0.75rem;
      opacity: 0.6;
      font-weight: 600;
    }
    
    .tab-custom.active {
      border-bottom: 3px solid #2563EB;
      opacity: 1;
      color: #0F172A !important;
    }

    .form-control-custom {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 0.8rem 1.2rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }

    .form-control-custom:focus {
      background-color: #FFFFFF;
      border-color: #2563EB;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      outline: none;
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
          Securely Loading Financial Data...
        </h5>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 p-md-5 bg-light min-vh-100">
      <style>{customStyles}</style>

      {/* Header Section */}
      <div
        className={`d-flex justify-content-between align-items-end mb-5 animate-fade-up ${
          isVisible ? "" : "d-none"
        }`}
      >
        <div>
          <h2 className="fw-bolder text-dark mb-0">💳 Campaign Center</h2>
        </div>
        {isAdmin && (
          <button
            className="btn btn-dark shadow-sm px-4 py-2 rounded-pill fw-bold hover-lift-card"
            data-bs-toggle="modal"
            data-bs-target="#createModal"
          >
            + New Campaign
          </button>
        )}
      </div>

      {/* TABS (Admin Only) */}
      {isAdmin && (
        <div
          className={`d-flex gap-4 mb-5 border-bottom animate-fade-up ${
            isVisible ? "" : "d-none"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          <div
            className={`tab-custom text-secondary ${
              activeTab === "ongoing" ? "active" : ""
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing
          </div>
          <div
            className={`tab-custom text-secondary ${
              activeTab === "ended" ? "active" : ""
            }`}
            onClick={() => setActiveTab("ended")}
          >
            Ended
          </div>
        </div>
      )}

      {/* CAMPAIGN GRID */}
      <div className="row g-4 pb-5">
        {displayCampaigns.length === 0 ? (
          <div
            className={`col-12 animate-fade-up ${isVisible ? "" : "d-none"}`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-white rounded-4 shadow-sm p-5 border text-center">
              <h5 className="fw-bold text-muted mb-0">
                No campaigns found in this section.
              </h5>
            </div>
          </div>
        ) : (
          displayCampaigns.map((camp, index) => {
            const percent = Math.min(
              (camp.raisedAmount / camp.targetAmount) * 100,
              100
            ).toFixed(1);
            const isFull = camp.raisedAmount >= camp.targetAmount;

            return (
              <div
                className={`col-md-6 col-xl-4 animate-fade-up`}
                key={camp._id}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div
                  className={`card h-100 border-0 shadow-sm rounded-4 hover-lift-card overflow-hidden ${
                    isFull ? "bg-light" : "bg-white"
                  }`}
                >
                  {/* Top Colored Indicator */}
                  <div
                    style={{ height: "4px" }}
                    className={`w-100 ${isFull ? "bg-success" : "bg-primary"}`}
                  ></div>

                  <div className="card-body p-4 p-md-5 d-flex flex-column">
                    <h4 className="card-title fw-bolder text-dark mb-3 lh-sm">
                      {camp.title}
                    </h4>
                    <p
                      className="card-text text-muted mb-4 lh-lg flex-grow-1"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {camp.description}
                    </p>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between small fw-bold text-dark mb-2">
                        <span className={isFull ? "text-success" : ""}>
                          ${camp.raisedAmount.toLocaleString()} raised
                        </span>
                        <span className="text-muted">
                          Goal: ${camp.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div
                        className="progress rounded-pill shadow-sm"
                        style={{ height: "10px", backgroundColor: "#E2E8F0" }}
                      >
                        <div
                          className={`progress-bar rounded-pill ${
                            isFull ? "bg-success" : "bg-primary"
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {activeTab === "ended" ? (
                      <div>
                        {isFull && (
                          <div className="btn btn-success bg-opacity-10 text-success border-success border-opacity-25 w-100 mb-3 rounded-pill disabled opacity-100 py-2 fw-bold">
                            ✅ Fully Funded
                          </div>
                        )}
                        <button
                          className="btn btn-outline-dark w-100 rounded-pill py-2 fw-bold"
                          onClick={() => fetchDonations(camp)}
                          data-bs-toggle="modal"
                          data-bs-target="#donationsModal"
                        >
                          View Donations
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        <button
                          className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm"
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
                        {isAdmin && (
                          <button
                            className="btn btn-light border w-100 rounded-pill py-2 fw-bold"
                            onClick={() => fetchDonations(camp)}
                            data-bs-toggle="modal"
                            data-bs-target="#donationsModal"
                          >
                            View Donations
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    className="card-footer bg-transparent border-top p-3 text-center text-muted small fw-bold text-uppercase"
                    style={{ letterSpacing: "0.5px" }}
                  >
                    Deadline: {new Date(camp.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Create Campaign */}
      <div className="modal fade" id="createModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header bg-dark text-white border-0 p-4">
              <h5 className="modal-title fw-bolder">Launch New Cause</h5>
              <button
                ref={createCloseRef}
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body p-4 p-md-5">
              <form onSubmit={handleCreate}>
                <div className="mb-4">
                  <label className="fw-bold small text-dark mb-2">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    className="form-control-custom w-100"
                    placeholder="Title"
                    value={newCamp.title}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="fw-bold small text-dark mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    className="form-control-custom w-100"
                    placeholder="Description"
                    rows="4"
                    value={newCamp.description}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="fw-bold small text-dark mb-2">
                    Target Goal ($)
                  </label>
                  <input
                    type="number"
                    className="form-control-custom w-100"
                    placeholder="Goal"
                    value={newCamp.targetAmount}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, targetAmount: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="fw-bold small text-dark mb-2">
                    Funding Deadline
                  </label>
                  <input
                    type="date"
                    className="form-control-custom w-100"
                    value={newCamp.deadline}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, deadline: e.target.value })
                    }
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn btn-dark w-100 py-3 fw-bold rounded-pill shadow-sm"
                >
                  {isCreating ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    "Launch Campaign"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 2: Checkout */}
      <div className="modal fade" id="checkoutModal">
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
                      Secure Checkout
                    </h4>
                    <p className="text-light text-opacity-75 small mb-0 fw-bold">
                      Supporting: {donation.title}
                    </p>
                  </div>
                  <button
                    ref={checkoutCloseRef}
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
                <label className="form-label text-muted fw-bold text-uppercase small mb-3">
                  Donation Amount
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
                    className="form-control-custom w-100 fs-6 bg-white"
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
                    className="form-control-custom w-100 font-monospace fs-6 bg-white"
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
                        className="form-control-custom w-100 text-center fs-6 bg-white"
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
                        className="form-control-custom w-100 text-center fs-6 bg-white"
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
                  Make donation anonymous
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
                disabled={isProcessingCheckout}
              >
                {isProcessingCheckout ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                ) : (
                  <>🔒 Pay ${donation.amount || "0"} Securely</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 3: View Real Donations Ledger (Admin) */}
      <div className="modal fade" id="donationsModal">
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header bg-light border-bottom p-4">
              <div>
                <h5 className="modal-title fw-bolder text-dark mb-1">
                  Donation Ledger
                </h5>
                <small className="text-muted fw-bold">
                  {viewingCampaign?.title}
                </small>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body p-0 bg-white">
              {ledgerLoading ? (
                <div className="p-5 text-center text-muted">
                  Fetching Records...
                </div>
              ) : ledgerData.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  No donations found for this campaign.
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {ledgerData.map((tx) => (
                    <li
                      key={tx._id}
                      className="list-group-item p-4 d-flex justify-content-between align-items-center hover-lift-card border-bottom"
                    >
                      <div>
                        <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                          {tx.isAnonymous ? "Anonymous Donor" : tx.donorName}
                          {tx.isAnonymous && (
                            <span
                              className="badge bg-secondary bg-opacity-10 text-secondary border"
                              style={{ fontSize: "0.6rem" }}
                            >
                              ANON
                            </span>
                          )}
                        </div>
                        <div className="small text-muted mb-2">
                          {tx.isAnonymous
                            ? "Hidden for Privacy"
                            : tx.donorEmail || "No Email"}
                        </div>
                        <small
                          className="text-muted font-monospace bg-light px-2 py-1 rounded"
                          style={{ fontSize: "0.70rem" }}
                        >
                          {tx.transactionId} •{" "}
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="fs-5 fw-bolder text-success text-end">
                        +${tx.amount.toLocaleString()}
                        <div
                          className="text-muted small fw-bold text-uppercase mt-1"
                          style={{
                            fontSize: "0.65rem",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {tx.paymentGateway}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
