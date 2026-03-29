// client/src/pages/admin/CaseManager.jsx
import { useState, useEffect } from "react";
import { getCases, rejectCase, provideHelp } from "../../services/caseService";
import { getInventory } from "../../services/inventoryService";
import toast from "react-hot-toast";

const CaseManager = () => {
  const [cases, setCases] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("New"); // 'New' | 'Older'
  const [isVisible, setIsVisible] = useState(false);

  // Modal State
  const [activeCase, setActiveCase] = useState(null);
  const [invCategoryTab, setInvCategoryTab] = useState("Clothes");
  const [selectedItems, setSelectedItems] = useState([]); // Cart for providing help

  useEffect(() => {
    setIsVisible(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [caseRes, invRes] = await Promise.all([getCases(), getInventory()]);
      setCases(caseRes.data);
      setInventory(invRes.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this request?")) return;
    try {
      await rejectCase(id);
      toast.success("Request Rejected");
      fetchData();
    } catch (err) {
      toast.error("Failed to reject");
    }
  };

  const openHelpModal = (c) => {
    setActiveCase(c);
    setSelectedItems([]); // Reset cart
    setInvCategoryTab("Clothes");
  };

  // Add/Update item in the "Cart"
  const handleQuantityChange = (invItem, qty) => {
    const amount = Number(qty);
    if (amount > invItem.quantity)
      return toast.error(`Only ${invItem.quantity} available.`);

    let updatedCart = [...selectedItems];
    const existingIndex = updatedCart.findIndex(
      (i) => i.inventoryId === invItem._id
    );

    if (amount <= 0) {
      if (existingIndex > -1) updatedCart.splice(existingIndex, 1);
    } else {
      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity = amount;
      } else {
        updatedCart.push({
          inventoryId: invItem._id,
          itemName: invItem.itemName,
          quantity: amount,
          unit: invItem.unit,
        });
      }
    }
    setSelectedItems(updatedCart);
  };

  const submitHelp = async () => {
    if (selectedItems.length === 0)
      return toast.error("Select at least one item to provide.");
    try {
      await provideHelp(activeCase._id, selectedItems);
      toast.success("Help Provided! Inventory Deducted.");
      document.getElementById("closeHelpModal").click();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to provide help");
    }
  };

  const displayCases =
    activeTab === "New"
      ? cases.filter((c) => c.status === "Pending")
      : cases.filter((c) => c.status !== "Pending");

  // Enterprise-Grade Custom Styles
  const customStyles = `
    .hover-lift-card {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .hover-lift-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08) !important;
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

    .tab-custom:hover {
      opacity: 1;
    }

    .category-pill {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .category-pill.active {
      background-color: rgba(37, 99, 235, 0.1);
      color: #2563EB !important;
      border-color: #2563EB;
      font-weight: 700;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #F1F5F9;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #CBD5E1;
      border-radius: 4px;
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
        <h5 className="text-muted fw-bold">Synchronizing Request Ledger...</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 p-md-5 bg-light min-vh-100">
      <style>{customStyles}</style>

      {/* HEADER */}
      <div className={`mb-5 animate-fade-up ${isVisible ? "" : "d-none"}`}>
        <h2 className="fw-bolder text-dark mb-2 d-flex align-items-center gap-3">
          <div
            className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 fs-4 d-flex align-items-center justify-content-center"
            style={{ width: "45px", height: "45px" }}
          >
            📥
          </div>
          Case Manager
        </h2>
        <p className="text-muted ms-1">
          Review incoming operational deficits and allocate network resources.
        </p>
      </div>

      {/* TABS */}
      <div
        className={`d-flex gap-4 mb-5 border-bottom animate-fade-up ${
          isVisible ? "" : "d-none"
        }`}
        style={{ animationDelay: "0.1s" }}
      >
        <div
          className={`tab-custom text-secondary ${
            activeTab === "New" ? "active" : ""
          }`}
          onClick={() => setActiveTab("New")}
        >
          New
        </div>
        <div
          className={`tab-custom text-secondary ${
            activeTab === "Older" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Older")}
        >
          Older
        </div>
      </div>

      {/* CASES GRID */}
      <div className="row g-4 pb-5">
        {displayCases.length === 0 ? (
          <div
            className={`col-12 animate-fade-up ${isVisible ? "" : "d-none"}`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-white rounded-4 shadow-sm p-5 border text-center">
              <h5 className="fw-bold text-muted mb-0">No requests found.</h5>
            </div>
          </div>
        ) : (
          displayCases.map((c, index) => (
            <div
              className={`col-md-6 col-xl-4 animate-fade-up`}
              key={c._id}
              style={{ animationDelay: `${0.1 * (index + 2)}s` }}
            >
              <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white hover-lift-card d-flex flex-column overflow-hidden position-relative">
                {/* Status Color Bar */}
                <div
                  className={`position-absolute top-0 start-0 w-100 ${
                    c.status === "Pending"
                      ? "bg-warning"
                      : c.status === "Rejected"
                      ? "bg-danger"
                      : "bg-success"
                  }`}
                  style={{ height: "4px" }}
                ></div>

                <div className="d-flex justify-content-between align-items-start mb-3 mt-2">
                  <div>
                    <h5 className="fw-bolder mb-1 text-dark lh-sm">
                      {c.applicantName}
                    </h5>
                    <p className="text-muted small fw-bold d-flex align-items-center gap-1 m-0">
                      <span className="text-primary">📍</span> {c.area},{" "}
                      {c.city}
                    </p>
                  </div>
                  {/* Small Badges for Older Tab */}
                  {c.status !== "Pending" && (
                    <span
                      className={`badge ${
                        c.status === "Rejected" ? "bg-danger" : "bg-success"
                      } bg-opacity-10 text-${
                        c.status === "Rejected" ? "danger" : "success"
                      } border border-${
                        c.status === "Rejected" ? "danger" : "success"
                      } border-opacity-25 px-2 py-1 rounded-pill small fw-bold text-uppercase`}
                      style={{ letterSpacing: "0.5px" }}
                    >
                      {c.status}
                    </span>
                  )}
                </div>

                <div className="bg-light p-3 rounded-3 border mb-4 flex-grow-1">
                  <p
                    className="mb-0 small text-dark lh-lg font-monospace"
                    style={{ fontSize: "0.85rem" }}
                  >
                    "{c.description}"
                  </p>
                </div>

                <div className="d-flex flex-column gap-2 mb-4 border-bottom pb-4">
                  <div className="d-flex align-items-center gap-2 text-dark small fw-bold">
                    <span className="bg-light rounded p-1 text-muted">📞</span>{" "}
                    {c.phone}
                  </div>
                  {c.email && (
                    <div className="d-flex align-items-center gap-2 text-dark small fw-bold">
                      <span className="bg-light rounded p-1 text-muted">
                        📧
                      </span>{" "}
                      {c.email}
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS OR STATUS */}
                <div className="mt-auto">
                  {c.status === "Pending" ? (
                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-primary flex-grow-1 py-2 fw-bold shadow-sm rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target="#helpModal"
                        onClick={() => openHelpModal(c)}
                      >
                        help
                      </button>
                      <button
                        className="btn btn-outline-danger flex-grow-1 py-2 fw-bold rounded-pill"
                        onClick={() => handleReject(c._id)}
                      >
                        reject
                      </button>
                    </div>
                  ) : c.status === "Rejected" ? (
                    <div
                      className="text-center text-danger fw-bold small text-uppercase"
                      style={{ letterSpacing: "1px" }}
                    >
                      rejected
                    </div>
                  ) : (
                    <div>
                      <div
                        className="text-center text-success fw-bold small text-uppercase mb-2"
                        style={{ letterSpacing: "1px" }}
                      >
                        helped
                      </div>
                      <div className="bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 p-3">
                        <span
                          className="text-success small fw-bold text-uppercase d-block mb-1"
                          style={{ letterSpacing: "0.5px" }}
                        >
                          Provided:
                        </span>
                        <span className="fw-bolder text-dark small">
                          {c.aidProvided
                            .map((item) => `${item.itemName} ${item.quantity}`)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* THE HELP MODAL (Inventory Selection) */}
      {/* ========================================================= */}
      <div className="modal fade" id="helpModal" tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
            <div className="modal-header bg-dark text-white border-0 p-4">
              <div>
                <h5 className="modal-title fw-bolder mb-1">
                  Resource Allocation
                </h5>
                <p className="text-light text-opacity-75 small mb-0 fw-bold">
                  Routing assets to: {activeCase?.applicantName}
                </p>
              </div>
              <button
                id="closeHelpModal"
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body p-0 bg-white">
              <div className="row g-0 h-100">
                {/* LEFT: INVENTORY SELECTION */}
                <div className="col-md-7 border-end p-4 p-md-5">
                  <h6
                    className="fw-bold text-dark text-uppercase small mb-4"
                    style={{ letterSpacing: "1px" }}
                  >
                    Select Inventory Assets
                  </h6>

                  {/* Inventory Tabs */}
                  <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3">
                    {["Clothes", "Foods", "Cash", "Shelter"].map((cat) => (
                      <span
                        key={cat}
                        className={`category-pill px-3 py-1 rounded-pill small fw-semibold text-muted ${
                          invCategoryTab === cat ? "active" : ""
                        }`}
                        onClick={() => setInvCategoryTab(cat)}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Inventory List */}
                  <div
                    className="custom-scrollbar pe-2"
                    style={{ height: "350px", overflowY: "auto" }}
                  >
                    {inventory.filter((i) => i.category === invCategoryTab)
                      .length === 0 ? (
                      <div className="text-center p-5 text-muted bg-light rounded-3 border">
                        <span className="fs-3 mb-2 d-block">📦</span>
                        <p className="mb-0 fw-bold small">
                          No stock in this category.
                        </p>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {inventory
                          .filter((i) => i.category === invCategoryTab)
                          .map((invItem) => {
                            const cartItem = selectedItems.find(
                              (i) => i.inventoryId === invItem._id
                            );
                            const currentVal = cartItem
                              ? cartItem.quantity
                              : "";

                            return (
                              <div
                                className="d-flex align-items-center justify-content-between p-3 bg-light border rounded-3"
                                key={invItem._id}
                              >
                                <div>
                                  <span className="fw-bold text-dark d-block mb-1">
                                    {invItem.itemName}
                                  </span>
                                  <span className="badge bg-secondary bg-opacity-10 text-secondary border">
                                    Stock: {invItem.quantity} {invItem.unit}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <input
                                    type="number"
                                    className="form-control border-secondary text-center fw-bold"
                                    style={{ width: "80px" }}
                                    placeholder="0"
                                    value={currentVal}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        invItem,
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: CART PREVIEW & CASE DETAILS */}
                <div className="col-md-5 bg-light d-flex flex-column">
                  {/* Case Details Box */}
                  <div className="p-4 p-md-5 border-bottom bg-white">
                    <h6
                      className="fw-bold text-dark text-uppercase small mb-3"
                      style={{ letterSpacing: "1px" }}
                    >
                      Case Context
                    </h6>
                    <div
                      className="bg-light p-3 rounded-3 border font-monospace small text-muted lh-lg"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      "{activeCase?.description}"
                    </div>
                  </div>

                  {/* Allocation Payload (Cart) */}
                  <div className="p-4 p-md-5 flex-grow-1 d-flex flex-column">
                    <h6
                      className="fw-bold text-dark text-uppercase small mb-4"
                      style={{ letterSpacing: "1px" }}
                    >
                      Allocation Payload
                    </h6>

                    <div
                      className="border p-3 rounded-3 bg-white flex-grow-1 mb-4 custom-scrollbar"
                      style={{ overflowY: "auto" }}
                    >
                      {selectedItems.length === 0 ? (
                        <div className="h-100 d-flex align-items-center justify-content-center text-muted small fw-bold">
                          No items selected yet.
                        </div>
                      ) : (
                        <div className="d-flex flex-wrap gap-2">
                          {selectedItems.map((item, idx) => (
                            <span
                              key={idx}
                              className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 fs-6"
                            >
                              {item.itemName.toLowerCase()}{" "}
                              <span className="fw-bolder ms-1 text-dark">
                                {item.quantity}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm text-uppercase"
                      style={{ letterSpacing: "1px" }}
                      onClick={submitHelp}
                    >
                      provide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseManager;
