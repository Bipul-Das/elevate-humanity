// client/src/pages/admin/Campaigns.jsx
import { useState, useEffect } from 'react';
import { getCampaigns, createCampaign, donate } from '../../services/donationService';
import toast from 'react-hot-toast';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  // State for Creating Campaign (Admin)
  const [newCamp, setNewCamp] = useState({ title: '', description: '', targetAmount: '', deadline: '' });

  // State for Donating (Donor)
  const [donation, setDonation] = useState({ id: '', amount: '', isAnonymous: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getCampaigns();
      setCampaigns(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load campaigns');
      setLoading(false);
    }
  };

  // 1. Admin Logic: Create Campaign
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCampaign(newCamp);
      toast.success('Campaign Launched! 🚀');
      setNewCamp({ title: '', description: '', targetAmount: '', deadline: '' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Creation failed');
    }
  };

  // 2. Donor Logic: Process Donation
  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donation.amount || donation.amount <= 0) return toast.error("Enter a valid amount");

    try {
      await donate({
        campaignId: donation.id,
        amount: donation.amount,
        isAnonymous: donation.isAnonymous
      });
      toast.success('Donation Successful! 🎉');
      setDonation({ id: '', amount: '', isAnonymous: false }); // Reset
      loadData(); // Refresh progress bars
    } catch (err) {
      toast.error(err.response?.data?.error || 'Donation failed');
    }
  };

  if (loading) return <div className="p-5 text-center">Loading Financial Data...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>💰 Active Campaigns</h2>
        {/* Only Admins see the Create Button */}
        {["Lead Developer", "Org Admin"].includes(user?.role) && (
          <button
            className="btn btn-dark"
            data-bs-toggle="modal"
            data-bs-target="#createModal"
          >
            + New Campaign
          </button>
        )}
      </div>

      <div className="row g-4">
        {campaigns.map((camp) => {
          // Calculate Percentage
          const percent = Math.min(
            (camp.raisedAmount / camp.targetAmount) * 100,
            100
          ).toFixed(1);
          const isFull = camp.raisedAmount >= camp.targetAmount;

          return (
            <div className="col-md-4" key={camp._id}>
              <div
                className={`card h-100 shadow-sm ${
                  isFull ? "border-success" : ""
                }`}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold">{camp.title}</h5>
                  <p className="card-text text-muted small">
                    {camp.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="d-flex justify-content-between small fw-bold">
                      <span>${camp.raisedAmount} raised</span>
                      <span>Goal: ${camp.targetAmount}</span>
                    </div>
                    <div className="progress" style={{ height: "10px" }}>
                      <div
                        className={`progress-bar ${
                          isFull ? "bg-success" : "bg-primary"
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isFull ? (
                    <button className="btn btn-success w-100" disabled>
                      ✅ Fully Funded
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => setDonation({ ...donation, id: camp._id })}
                      data-bs-toggle="modal"
                      data-bs-target="#donateModal"
                    >
                      Donate Now
                    </button>
                  )}
                </div>
                <div className="card-footer bg-white small text-muted">
                  Deadline: {new Date(camp.deadline).toLocaleDateString()}
                </div>
              </div>
            </div>
          ); // <--- Add semicolon here
        })}
      </div>

      {/* MODAL 1: Create Campaign (Admin) */}
      <div className="modal fade" id="createModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">Launch New Cause</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreate}>
                <input
                  className="form-control mb-2"
                  placeholder="Title (e.g. Medical Fund)"
                  value={newCamp.title}
                  onChange={(e) =>
                    setNewCamp({ ...newCamp, title: e.target.value })
                  }
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={newCamp.description}
                  onChange={(e) =>
                    setNewCamp({ ...newCamp, description: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Goal Amount ($)"
                  value={newCamp.targetAmount}
                  onChange={(e) =>
                    setNewCamp({ ...newCamp, targetAmount: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="form-control mb-3"
                  value={newCamp.deadline}
                  onChange={(e) =>
                    setNewCamp({ ...newCamp, deadline: e.target.value })
                  }
                />
                <button className="btn btn-dark w-100" data-bs-dismiss="modal">
                  Launch Campaign
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 2: Donate (Everyone) */}
      <div className="modal fade" id="donateModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Make a Donation</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label>Amount ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={donation.amount}
                  onChange={(e) =>
                    setDonation({ ...donation, amount: e.target.value })
                  }
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="anonCheck"
                  checked={donation.isAnonymous}
                  onChange={(e) =>
                    setDonation({ ...donation, isAnonymous: e.target.checked })
                  }
                />
                <label className="form-check-label" htmlFor="anonCheck">
                  Donate Anonymously (Hide my name)
                </label>
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={handleDonate}
                data-bs-dismiss="modal"
              >
                Confirm Payment (Secure)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;