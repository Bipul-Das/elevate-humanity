// client/src/pages/admin/Campaigns.jsx
import { useState, useEffect } from "react";
import {
  getCampaigns,
  createCampaign,
  donate,
} from "../../services/donationService";
import toast from "react-hot-toast";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = ["Lead Developer", "Admin"].includes(user?.role);

  // View States
  const [activeTab, setActiveTab] = useState("ongoing"); // 'ongoing' | 'ended'

  // Form States
  const [newCamp, setNewCamp] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
  });

  // Checkout/Payment States
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

  // Ledger State (For View Donations Modal)
  const [viewingDonations, setViewingDonations] = useState(null);
  // Mock data to match sketch requirements until backend endpoint is built
  const mockDonationsLedger = [
    { id: 1, date: "2.2.2026", email: "jenny@mail.com", amount: 500 },
    { id: 2, date: "1.2.2026", email: "jemma@mail.com", amount: 800 },
    { id: 3, date: "2.1.2026", email: "jenny@mail.com", amount: 500 },
    { id: 4, date: "1.1.2026", email: "jemma@mail.com", amount: 800 },
    { id: 5, date: "12.12.2025", email: "jenny@mail.com", amount: 500 },
    { id: 6, date: "11.12.2025", email: "jemma@mail.com", amount: 800 },
  ];

  useEffect(() => {
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

  // Non-admins only ever see ongoing campaigns
  const displayCampaigns =
    isAdmin && activeTab === "ended" ? endedCampaigns : ongoingCampaigns;

  // --- ACTIONS ---
  const handleCreate = async (e) => {
    e.preventDefault();

    // Strict Date Validation
    const selectedDate = new Date(newCamp.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day-to-day comparison

    if (selectedDate <= today) {
      return toast.error("Campaign deadline must be a future date");
    }

    try {
      await createCampaign(newCamp);
      toast.success("Campaign Launched! 🚀");
      setNewCamp({
        title: "",
        description: "",
        targetAmount: "",
        deadline: "",
      });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Creation failed");
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

    // Strict Validation for the Mock Gateway
    if (!donation.amount || donation.amount <= 0)
      return toast.error("Enter a valid amount");
    if (paymentDetails.cardNumber.replace(/\s/g, "").length !== 16)
      return toast.error("Invalid 16-digit Card Number");
    if (paymentDetails.expiry.length !== 5)
      return toast.error("Invalid Expiry Date (MM/YY)");
    if (paymentDetails.cvv.length < 3) return toast.error("Invalid CVV");

    try {
      await donate({
        campaignId: donation.id,
        amount: donation.amount,
        isAnonymous: donation.isAnonymous,
      });
      toast.success("Payment Verified & Donation Successful! 🎉");

      // Reset Forms
      setDonation({ id: "", amount: "", isAnonymous: false, title: "" });
      setPaymentDetails({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment gateway failed");
    }
  };

  if (loading)
    return (
      <div className="p-5 text-center text-muted">
        Securely Loading Financial Data...
      </div>
    );

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>💳 Campaign Center</h2>
        {isAdmin && (
          <button
            className="btn btn-dark shadow-sm px-4 rounded-pill"
            data-bs-toggle="modal"
            data-bs-target="#createModal"
          >
            + New Campaign
          </button>
        )}
      </div>

      {/* TABS (Admin Only) */}
      {isAdmin && (
        <ul className="nav nav-tabs mb-4 border-bottom-2">
          <li className="nav-item">
            <button
              className={`nav-link px-4 ${
                activeTab === "ongoing"
                  ? "active fw-bold border-primary border-bottom-0 text-dark"
                  : "text-muted border-0"
              }`}
              onClick={() => setActiveTab("ongoing")}
            >
              Ongoing
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link px-4 ${
                activeTab === "ended"
                  ? "active fw-bold border-primary border-bottom-0 text-dark"
                  : "text-muted border-0"
              }`}
              onClick={() => setActiveTab("ended")}
            >
              Ended
            </button>
          </li>
        </ul>
      )}

      {/* CAMPAIGN GRID */}
      <div className="row g-4">
        {displayCampaigns.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">
            <h5>No campaigns found in this section.</h5>
          </div>
        ) : (
          displayCampaigns.map((camp) => {
            const percent = Math.min(
              (camp.raisedAmount / camp.targetAmount) * 100,
              100
            ).toFixed(1);
            const isFull = camp.raisedAmount >= camp.targetAmount;

            return (
              <div className="col-md-4" key={camp._id}>
                <div
                  className={`card h-100 border-0 shadow-sm rounded-4 ${
                    isFull ? "bg-light" : ""
                  }`}
                >
                  <div className="card-body p-4">
                    <h4 className="card-title fw-bold text-dark mb-1">
                      {camp.title}
                    </h4>
                    <p
                      className="card-text text-secondary mb-4"
                      style={{ minHeight: "45px" }}
                    >
                      {camp.description}
                    </p>

                    {/* Progress Area */}
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
                        style={{ height: "12px", backgroundColor: "#e9ecef" }}
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
                          <div className="btn btn-success w-100 mb-2 rounded-3 disabled opacity-100 py-2">
                            ✅ Fully Funded
                          </div>
                        )}
                        <button
                          className="btn btn-primary w-100 rounded-3 py-2 fw-bold"
                          onClick={() => setViewingDonations(camp)}
                          data-bs-toggle="modal"
                          data-bs-target="#donationsModal"
                        >
                          View Donations
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          className="btn btn-outline-primary w-100 rounded-3 py-2 fw-bold"
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

                        {/* NEW: Admins can view donations for ongoing campaigns too */}
                        {isAdmin && (
                          <button
                            className="btn btn-primary w-100 rounded-3 py-2 fw-bold mt-2"
                            onClick={() => setViewingDonations(camp)}
                            data-bs-toggle="modal"
                            data-bs-target="#donationsModal"
                          >
                            View Donations
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="card-footer bg-transparent border-top-0 text-center text-muted small pb-4">
                    Deadline: {new Date(camp.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* MODALS AREA */}
      {/* ========================================================= */}

      {/* MODAL 1: Create Campaign (Admin) */}
      <div className="modal fade" id="createModal">
        <div className="modal-dialog">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header bg-dark text-white border-0 rounded-top-4 p-4">
              <h5 className="modal-title fw-bold">Launch New Cause</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body p-4">
              <form onSubmit={handleCreate}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control bg-light"
                    placeholder="Title"
                    value={newCamp.title}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, title: e.target.value })
                    }
                    required
                  />
                  <label>Campaign Title</label>
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    className="form-control bg-light"
                    placeholder="Description"
                    style={{ height: "100px" }}
                    value={newCamp.description}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, description: e.target.value })
                    }
                    required
                  />
                  <label>Detailed Description</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className="form-control bg-light"
                    placeholder="Goal"
                    value={newCamp.targetAmount}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, targetAmount: e.target.value })
                    }
                    required
                  />
                  <label>Target Goal ($)</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="date"
                    className="form-control bg-light"
                    value={newCamp.deadline}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, deadline: e.target.value })
                    }
                    required
                  />
                  <label>Funding Deadline</label>
                </div>
                <button
                  className="btn btn-dark w-100 py-3 fw-bold rounded-3"
                  data-bs-dismiss="modal"
                >
                  Launch Campaign
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 2: Checkout / Mock Payment Gateway */}
      <div className="modal fade" id="checkoutModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header bg-primary text-white border-0 rounded-top-4 p-4">
              <div>
                <h5 className="modal-title fw-bold">Secure Checkout</h5>
                <small className="opacity-75">
                  Supporting: {donation.title}
                </small>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body p-4">
              {/* Amount Input */}
              <div className="mb-4 text-center">
                <label className="form-label text-muted fw-bold text-uppercase small">
                  Donation Amount
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light fw-bold border-end-0 text-muted">
                    $
                  </span>
                  <input
                    type="number"
                    className="form-control border-start-0 fw-bold fs-3 text-center"
                    placeholder="0.00"
                    value={donation.amount}
                    onChange={(e) =>
                      setDonation({ ...donation, amount: e.target.value })
                    }
                    autoFocus
                  />
                </div>
              </div>

              {/* Credit Card Mock UI */}
              <div className="bg-light p-3 rounded-4 border mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold text-dark small">
                    Payment Details
                  </span>
                  <div className="d-flex gap-1">
                    <span className="badge bg-secondary">VISA</span>
                    <span className="badge bg-secondary">MC</span>
                  </div>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cardholder Name"
                    value={paymentDetails.cardName}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        cardName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control font-monospace"
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
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control text-center"
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
                      className="form-control text-center"
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

              {/* Anonymous Toggle */}
              <div className="form-check form-switch mb-4 bg-light p-3 rounded-3 border d-flex align-items-center justify-content-between">
                <label
                  className="form-check-label text-muted fw-bold m-0 ms-2"
                  htmlFor="anonCheck"
                >
                  Make donation anonymous
                </label>
                <input
                  className="form-check-input m-0"
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
                className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex justify-content-center align-items-center gap-2"
                onClick={handleDonate}
                data-bs-dismiss="modal"
              >
                <span>🔒 Pay ${donation.amount || "0"} Securely</span>
              </button>
              <div
                className="text-center mt-3 text-muted"
                style={{ fontSize: "0.75rem" }}
              >
                Payments are processed via 256-bit encrypted mockup gateway.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 3: View Donations Ledger (Admin Ended Tab) */}
      <div className="modal fade" id="donationsModal">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header bg-white border-bottom p-4">
              <div>
                <h5 className="modal-title fw-bold text-dark">
                  Donation Ledger
                </h5>
                <small className="text-muted">{viewingDonations?.title}</small>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body p-0">
              <ul className="list-group list-group-flush">
                {mockDonationsLedger.map((tx) => (
                  <li
                    key={tx.id}
                    className="list-group-item p-4 d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-bold text-dark mb-1">{tx.email}</div>
                      <small className="text-muted">On {tx.date}</small>
                    </div>
                    <div className="fs-5 fw-bold text-success">
                      +${tx.amount}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-4 text-center border-top">
                <button className="btn btn-outline-secondary px-4 rounded-pill">
                  Load more
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
