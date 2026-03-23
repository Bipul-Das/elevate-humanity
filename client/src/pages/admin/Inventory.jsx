// client/src/pages/admin/Inventory.jsx
import { useState, useEffect } from "react";
import {
  getInventory,
  addItem,
  redeemItem,
} from "../../services/inventoryService";
import toast from "react-hot-toast";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for "Add Item" Form
  const [newItem, setNewItem] = useState({
    itemName: "",
    category: "Food",
    quantity: "",
    batchNumber: "",
    unit: "pcs",
  });

  // State for "Redeem" (QR Scanner)
  const [qrCode, setQrCode] = useState("");

  // 1. Fetch Data on Load
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

  // 2. Handle Adding Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addItem(newItem);
      toast.success("Item Added Successfully");
      setNewItem({
        itemName: "",
        category: "Food",
        quantity: "",
        batchNumber: "",
        unit: "pcs",
      }); // Reset form
      loadInventory(); // Refresh table
    } catch (error) {
      toast.error(error.response?.data?.error || "Error adding item");
    }
  };

  // 3. Handle Redemption (Simulate QR Scan)
  const handleRedeem = async () => {
    if (!qrCode) return;
    try {
      const res = await redeemItem(qrCode);
      toast.success(`Redeemed: ${res.data.itemName}`);

      // Check for backend alerts (Low Stock Warning)
      if (res.alert) {
        toast(res.alert, { icon: "⚠️", style: { background: "#fff3cd" } });
      }

      setQrCode("");
      loadInventory(); // Refresh table to see dropped stock
    } catch (error) {
      toast.error(error.response?.data?.error || "Redemption Failed");
    }
  };

  if (loading)
    return <div className="p-5 text-center">Loading Logistics...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 Logistics & Inventory</h2>
        <span className="badge bg-primary fs-6">
          {items.length} Items Tracked
        </span>
      </div>

      <div className="row g-4">
        {/* LEFT: Inventory Table */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">
              Current Stock (FIFO)
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Batch</th>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Qty</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item._id}
                        className={item.isLowStock ? "table-danger" : ""}
                      >
                        <td className="fw-mono text-uppercase">
                          {item.batchNumber}
                        </td>
                        <td className="fw-bold">{item.itemName}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {item.category}
                          </span>
                        </td>
                        <td>
                          {item.quantity} {item.unit}
                        </td>
                        <td>
                          {item.isLowStock ? (
                            <span className="text-danger fw-bold">
                              LOW STOCK
                            </span>
                          ) : (
                            <span className="text-success">In Stock</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No inventory yet. Add items!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Actions Panel */}
        <div className="col-md-4">
          {/* Action 1: QR Redemption Simulation */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              📲 QR Scanner (Simulator)
            </div>
            <div className="card-body">
              <label className="form-label text-muted small">
                Scan Code (Enter Batch #)
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. B23"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                />
                <button className="btn btn-success" onClick={handleRedeem}>
                  Redeem
                </button>
              </div>
            </div>
          </div>

          {/* Action 2: Add New Item */}
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">➕ Add Stock</div>
            <div className="card-body">
              <form onSubmit={handleAddItem}>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Batch # (e.g. B23)"
                    value={newItem.batchNumber}
                    onChange={(e) =>
                      setNewItem({ ...newItem, batchNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Item Name"
                    value={newItem.itemName}
                    onChange={(e) =>
                      setNewItem({ ...newItem, itemName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Qty"
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem({ ...newItem, quantity: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-6">
                    <select
                      className="form-select"
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                    >
                      <option>Food</option>
                      <option>Medicine</option>
                      <option>Bibles</option>
                      <option>Clothes</option>
                    </select>
                  </div>
                </div>
                <button className="btn btn-dark w-100">Add to Warehouse</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
