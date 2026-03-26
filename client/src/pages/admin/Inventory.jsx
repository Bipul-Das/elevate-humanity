// client/src/pages/admin/Inventory.jsx
import { useState, useEffect } from "react";
import {
  getInventory,
  addItem,
  updateItem,
  deleteItem,
} from "../../services/inventoryService";
import toast from "react-hot-toast";

// THE MASTER ASSET MATRIX
const assetMatrix = {
  Clothes: [
    { name: "Shirts", unit: "pcs" },
    { name: "Pants", unit: "pcs" },
    { name: "Skirts", unit: "pcs" },
    { name: "Jackets", unit: "pcs" },
    { name: "Socks", unit: "pcs" },
    { name: "Shoes", unit: "pcs" },
    { name: "Sweaters", unit: "pcs" },
    { name: "Dresses", unit: "pcs" },
    { name: "Blankets", unit: "pcs" },
    { name: "Coats", unit: "pcs" },
    { name: "Gloves", unit: "pcs" },
    { name: "Hats", unit: "pcs" },
    { name: "Scarves", unit: "pcs" },
    { name: "Undergarments", unit: "pcs" },
    { name: "Belts", unit: "pcs" },
  ],
  Foods: [
    { name: "Rice", unit: "kg" },
    { name: "Lentils", unit: "kg" },
    { name: "Flour", unit: "kg" },
    { name: "Milk", unit: "liter" },
    { name: "Oil", unit: "liter" },
    { name: "Sugar", unit: "kg" },
    { name: "Salt", unit: "kg" },
    { name: "Canned Beans", unit: "cans" },
    { name: "Canned Fish", unit: "cans" },
    { name: "Bottled Water", unit: "liter" },
    { name: "Potatoes", unit: "kg" },
    { name: "Onions", unit: "kg" },
    { name: "Pasta", unit: "kg" },
    { name: "Bread", unit: "loaves" },
    { name: "Biscuits", unit: "packs" },
  ],
  Cash: [{ name: "USD", unit: "$" }],
  Shelter: [
    { name: "Beds", unit: "beds" },
    { name: "Family Rooms", unit: "rooms" },
  ],
};

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Clothes");

  const categories = Object.keys(assetMatrix);

  // Form State
  const [formData, setFormData] = useState({
    itemName: assetMatrix["Clothes"][0].name,
    category: "Clothes",
    quantity: "",
    unit: assetMatrix["Clothes"][0].unit,
  });
  const [isEditing, setIsEditing] = useState(null); // Holds ID of item being edited

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await getInventory();
      setItems(res.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load inventory");
      setLoading(false);
    }
  };

  // --- FORM HANDLERS (Dynamic Logic) ---
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const defaultItem = assetMatrix[newCategory][0]; // Grab the first item of the new category

    setFormData({
      ...formData,
      category: newCategory,
      itemName: defaultItem.name,
      unit: defaultItem.unit,
    });
  };

  const handleItemChange = (e) => {
    const selectedItemName = e.target.value;
    // Find the item object in the matrix to get its specific unit
    const itemConfig = assetMatrix[formData.category].find(
      (i) => i.name === selectedItemName
    );

    setFormData({
      ...formData,
      itemName: selectedItemName,
      unit: itemConfig ? itemConfig.unit : "",
    });
  };

  // --- ACTIONS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateItem(isEditing, formData);
        toast.success("Item Updated Successfully");
      } else {
        await addItem(formData);
        toast.success("Item Added Successfully");
      }

      // Close modal and reset form
      document.getElementById("closeInventoryModal").click();
      resetForm();
      loadInventory();
    } catch (error) {
      // This will catch the 400 Duplicate Error from the backend
      toast.error(error.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteItem(id);
      toast.success("Item Removed");
      loadInventory();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const openEditModal = (item) => {
    setIsEditing(item._id);
    setFormData({
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
    });
  };

  const resetForm = () => {
    setIsEditing(null);
    const defaultItem = assetMatrix[activeTab][0];
    setFormData({
      itemName: defaultItem.name,
      category: activeTab,
      quantity: "",
      unit: defaultItem.unit,
    });
  };

  if (loading)
    return (
      <div className="p-5 text-center text-muted">Loading Resource Data...</div>
    );

  // Filter items based on selected tab
  const displayedItems = items.filter((item) => item.category === activeTab);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Resource Management</h2>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        {/* TABS HEADER */}
        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 rounded-top-4">
          <ul className="nav nav-tabs border-bottom">
            {categories.map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link fs-5 px-4 ${
                    activeTab === tab
                      ? "active fw-bold border-primary border-bottom-0 text-dark"
                      : "text-muted border-0"
                  }`}
                  style={
                    activeTab === tab ? { borderTop: "3px solid #0d6efd" } : {}
                  }
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* TABLE BODY */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4 py-3 w-50 text-uppercase small fw-bold text-muted">
                    Item Description
                  </th>
                  <th className="py-3 text-uppercase small fw-bold text-muted">
                    Available Quantity
                  </th>
                  <th className="pe-4 py-3 text-end text-uppercase small fw-bold text-muted">
                    Manage Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-5 text-muted">
                      No assets found in {activeTab}.
                    </td>
                  </tr>
                ) : (
                  displayedItems.map((item) => (
                    <tr key={item._id}>
                      <td className="ps-4 py-3 fw-bold text-dark fs-5">
                        {item.itemName}
                      </td>
                      <td className="py-3 fs-5">
                        <span className="badge bg-light text-dark border px-3 py-2">
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="pe-4 py-3 text-end">
                        <button
                          className="btn btn-sm btn-outline-primary px-3 me-2 rounded-pill fw-bold"
                          data-bs-toggle="modal"
                          data-bs-target="#inventoryModal"
                          onClick={() => openEditModal(item)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger px-3 rounded-pill fw-bold"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="card-footer bg-white border-top p-4 text-center rounded-bottom-4">
          <button
            className="btn btn-dark btn-lg px-5 rounded-pill shadow-sm fw-bold"
            data-bs-toggle="modal"
            data-bs-target="#inventoryModal"
            onClick={resetForm}
          >
            + Add New {activeTab}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ADD/EDIT MODAL */}
      {/* ========================================================= */}
      <div className="modal fade" id="inventoryModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header bg-dark text-white border-0 rounded-top-4 p-4">
              <h5 className="modal-title fw-bold">
                {isEditing ? "Update Resource" : "Add New Resource"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                id="closeInventoryModal"
              ></button>
            </div>
            <div className="modal-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small text-uppercase">
                    Resource Category
                  </label>
                  <select
                    className="form-select bg-light"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    required
                    disabled={isEditing !== null} // Prevent changing category while editing
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small text-uppercase">
                    Predefined Asset
                  </label>
                  <select
                    className="form-select bg-light fw-bold"
                    value={formData.itemName}
                    onChange={handleItemChange}
                    required
                    disabled={isEditing !== null} // Prevent renaming the asset while editing
                  >
                    {assetMatrix[formData.category].map((asset) => (
                      <option key={asset.name} value={asset.name}>
                        {asset.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-8">
                    <label className="form-label fw-bold text-muted small text-uppercase">
                      Quantity {isEditing && "(Add or Remove)"}
                    </label>
                    <input
                      type="number"
                      className="form-control bg-light"
                      placeholder="e.g., 50"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-bold text-muted small text-uppercase">
                      Fixed Unit
                    </label>
                    <input
                      type="text"
                      className="form-control bg-light text-center fw-bold text-muted"
                      value={formData.unit}
                      readOnly // NEW: User can never manually type the unit!
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fw-bold rounded-3"
                >
                  {isEditing ? "Save Changes" : "Add to Inventory"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
