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

  // Modal State
  const [activeCase, setActiveCase] = useState(null);
  const [invCategoryTab, setInvCategoryTab] = useState("Clothes");
  const [selectedItems, setSelectedItems] = useState([]); // Cart for providing help

  useEffect(() => {
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

  if (loading) return <div className="p-5 text-center">Loading Data...</div>;

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* HEADER & TABS */}
      <div className="mb-4">
        <ul className="nav nav-tabs fs-5 border-dark">
          <li className="nav-item">
            <button
              className={`nav-link text-dark ${
                activeTab === "New"
                  ? "fw-bold border-dark border-bottom-0"
                  : "border-0"
              }`}
              onClick={() => setActiveTab("New")}
            >
              New
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-dark ${
                activeTab === "Older"
                  ? "fw-bold border-dark border-bottom-0"
                  : "border-0"
              }`}
              onClick={() => setActiveTab("Older")}
            >
              Older
            </button>
          </li>
        </ul>
      </div>

      {/* CASES GRID */}
      <div className="row g-4">
        {displayCases.length === 0 ? (
          <p className="text-muted mt-5 text-center">No requests found.</p>
        ) : (
          displayCases.map((c) => (
            <div className="col-md-6" key={c._id}>
              <div className="card shadow-sm border-dark rounded-0 p-4 h-100 text-center bg-white">
                <h5 className="fw-normal mb-0">{c.applicantName}</h5>
                <p className="text-muted mb-3">
                  {c.area}, {c.city}
                </p>

                <div
                  className="border border-dark p-3 mb-3"
                  style={{ minHeight: "100px" }}
                >
                  {c.description}
                </div>

                <div className="border border-dark py-2 mb-2">
                  📞  {c.phone}
                </div>
                {c.email && (
                  <div className="border border-dark py-2 mb-3">
                    📧  {c.email}
                  </div>
                )}

                {/* ACTION BUTTONS */}
                {c.status === "Pending" ? (
                  <div className="d-flex justify-content-center gap-4">
                    <button
                      className="btn btn-outline-dark px-4 py-2 rounded-0"
                      data-bs-toggle="modal"
                      data-bs-target="#helpModal"
                      onClick={() => openHelpModal(c)}
                    >
                      help
                    </button>
                    <button
                      className="btn btn-outline-dark px-4 py-2 rounded-0"
                      onClick={() => handleReject(c._id)}
                    >
                      reject
                    </button>
                  </div>
                ) : c.status === "Rejected" ? (
                  <div className="border border-dark py-2 px-4 mx-auto d-inline-block">
                    rejected
                  </div>
                ) : (
                  <>
                    <div className="border border-dark py-2 px-4 mx-auto d-inline-block mb-3">
                      helped
                    </div>
                    <div className="border border-dark p-3 text-start bg-light">
                      <strong>Received or provided:</strong>{" "}
                      {c.aidProvided
                        .map((item) => `${item.itemName} ${item.quantity}`)
                        .join(", ")}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* LOAD MORE */}
      <div className="text-center mt-5">
        <button className="btn btn-outline-dark rounded-0 px-4 py-2">
          Load more
        </button>
      </div>

      {/* ========================================================= */}
      {/* THE HELP MODAL (Inventory Selection) */}
      {/* ========================================================= */}
      <div className="modal fade" id="helpModal" tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div
            className="modal-content rounded-0 border-dark"
            style={{ border: "2px solid black" }}
          >
            <div className="modal-body p-0">
              <div className="row g-0">
                {/* LEFT: INVENTORY SELECTION */}
                <div className="col-md-7 border-end border-dark p-4">
                  {/* Inventory Tabs */}
                  <div className="d-flex gap-3 mb-4 border-bottom pb-2 fs-5 fw-bold">
                    {["Clothes", "Foods", "Cash", "Shelter"].map((cat) => (
                      <span
                        key={cat}
                        style={{
                          cursor: "pointer",
                          color: invCategoryTab === cat ? "#0d6efd" : "gray",
                        }}
                        onClick={() => setInvCategoryTab(cat)}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Inventory List */}
                  <div
                    className="border border-dark p-3 mb-4"
                    style={{ height: "300px", overflowY: "auto" }}
                  >
                    {inventory.filter((i) => i.category === invCategoryTab)
                      .length === 0 ? (
                      <p className="text-muted">No stock in this category.</p>
                    ) : null}
                    {inventory
                      .filter((i) => i.category === invCategoryTab)
                      .map((invItem) => {
                        // Find if this item is already in our cart to display current qty
                        const cartItem = selectedItems.find(
                          (i) => i.inventoryId === invItem._id
                        );
                        const currentVal = cartItem ? cartItem.quantity : "";

                        return (
                          <div
                            className="d-flex align-items-center justify-content-between mb-3 w-75 mx-auto"
                            key={invItem._id}
                          >
                            <span className="fs-5">{invItem.itemName}</span>
                            <span className="fs-5 me-auto ms-4">
                              {invItem.quantity}
                            </span>
                            <input
                              type="number"
                              className="form-control rounded-0 border-dark text-center"
                              style={{ width: "60px" }}
                              value={currentVal}
                              onChange={(e) =>
                                handleQuantityChange(invItem, e.target.value)
                              }
                            />
                          </div>
                        );
                      })}
                  </div>

                  {/* CART PREVIEW */}
                  <div className="border border-dark p-3 mb-4 d-flex flex-wrap gap-3 bg-light">
                    {selectedItems.length === 0 ? (
                      <span className="text-muted small">
                        No items selected yet.
                      </span>
                    ) : null}
                    {selectedItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-secondary bg-opacity-25 px-2 py-1"
                      >
                        {item.itemName.toLowerCase()} {item.quantity}
                      </span>
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      className="btn btn-outline-dark rounded-0 px-5 py-2 fs-5"
                      onClick={submitHelp}
                    >
                      provide
                    </button>
                    <button
                      id="closeHelpModal"
                      className="d-none"
                      data-bs-dismiss="modal"
                    ></button>
                  </div>
                </div>

                {/* RIGHT: CASE DETAILS */}
                <div className="col-md-5 p-5 bg-light d-flex align-items-center">
                  <div className="card shadow-sm border-dark rounded-0 p-4 text-center w-100 bg-white">
                    <h5 className="fw-normal mb-0">
                      {activeCase?.applicantName}
                    </h5>
                    <p className="text-muted mb-3">
                      {activeCase?.area}, {activeCase?.city}
                    </p>

                    <div
                      className="border border-dark p-4 bg-white"
                      style={{ minHeight: "150px" }}
                    >
                      {activeCase?.description}
                    </div>
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
