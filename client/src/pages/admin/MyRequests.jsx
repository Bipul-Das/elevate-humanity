// client/src/pages/admin/MyRequests.jsx
import { useState, useEffect } from "react";
import { getMyRequests } from "../../services/caseService";
import toast from "react-hot-toast";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getMyRequests();
      // Console log added so you can see exactly what the database is sending!
      console.log("My Requests Data:", res.data);
      setRequests(res.data);
    } catch (error) {
      toast.error("Failed to load your requests.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5 text-center text-muted">Loading your requests...</div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4 fw-bold">📂 My Requests</h2>

      <div className="row g-4">
        {requests.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">
            <h5>You have not submitted any requests yet.</h5>
          </div>
        ) : (
          requests.map((req) => {
            // 1. Check all possible success statuses
            const isHelped = [
              "Resolved",
              "Approved",
              "Helped",
              "Completed",
              "Success",
            ].includes(req.status);

            // 2. Safely extract and format the 'aidProvided' array of objects
            let itemsText = "";

            if (
              req.aidProvided &&
              Array.isArray(req.aidProvided) &&
              req.aidProvided.length > 0
            ) {
              // Map through the objects and format them as "ItemName Quantity"
              itemsText = req.aidProvided
                .map((aid) => {
                  // We check the most common database key names for items and quantities
                  const name =
                    aid.item || aid.itemName || aid.name || aid.title || "Item";
                  const qty =
                    aid.quantity || aid.qty || aid.amount || aid.count || "";
                  return `${name} ${qty}`.trim();
                })
                .join(", ");
            } else {
              // Fallback just in case some older records used a simple string
              const rawItems =
                req.providedItems ||
                req.itemsProvided ||
                req.receivedItems ||
                req.items;
              itemsText = Array.isArray(rawItems)
                ? rawItems.join(", ")
                : rawItems;
            }

            return (
              <div className="col-md-6 col-lg-4" key={req._id}>
                <div className="card h-100 border shadow-sm rounded-0">
                  <div className="card-body p-4 text-center">
                    {/* Header: Name & Location */}
                    <h5 className="fw-bold mb-1 text-dark">
                      {req.applicantName}
                    </h5>
                    <p className="text-muted small mb-3">
                      {req.area}, {req.city}
                    </p>

                    {/* Description Box */}
                    <div
                      className="border p-3 mb-3 text-start bg-light"
                      style={{ minHeight: "100px" }}
                    >
                      <p className="mb-0 small text-dark">{req.description}</p>
                    </div>

                    {/* Contact Information */}
                    <div className="d-flex flex-column gap-2 mb-4">
                      <div className="border p-2 text-dark small fw-bold">
                        📞 {req.phone}
                      </div>
                      {req.email && (
                        <div className="border p-2 text-dark small fw-bold">
                          ✉️ {req.email}
                        </div>
                      )}
                    </div>

                    {/* Status Badges */}
                    <div className="mb-3 d-flex justify-content-center">
                      {req.status === "Pending" && (
                        <div className="border border-dark px-4 py-2 small">
                          pending
                        </div>
                      )}
                      {req.status === "Rejected" && (
                        <div className="border border-dark px-4 py-2 small">
                          rejected
                        </div>
                      )}
                      {isHelped && (
                        <div className="border border-dark px-4 py-2 small">
                          helped
                        </div>
                      )}
                    </div>

                    {/* Received Items Box (Only shows if helped AND itemsText successfully generated) */}
                    {isHelped && itemsText && (
                      <div className="border border-dark p-3 text-start bg-white">
                        <span className="text-dark">Received </span>
                        <span className="fw-bold text-dark">{itemsText}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      
    </div>
  );
};

export default MyRequests;
