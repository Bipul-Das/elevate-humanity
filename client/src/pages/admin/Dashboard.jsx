// client/src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { getAdminStats, getUserStats } from "../../services/dashboardService";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// ==========================================
// 1. MEMBER / VOLUNTEER DASHBOARD COMPONENT
// ==========================================
const MemberDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    upcomingEvents: [],
    activeCampaigns: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await getUserStats();
        setStats(res.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  if (loading)
    return (
      <div className="p-5 text-center text-muted">Loading your portal...</div>
    );

  return (
    <div className="container-fluid p-4 p-md-5">
      <div className="row g-4">
        {/* LEFT COLUMN: User Full Profile */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
            <div className="mb-4">
              <img
                src={
                  user?.profileImage
                    ? `http://localhost:5000${user.profileImage}`
                    : `https://ui-avatars.com/api/?name=${
                        user?.name || "U"
                      }&background=1E293B&color=fff&size=120&bold=true`
                }
                alt="Profile"
                className="rounded-circle shadow-sm object-fit-cover border mb-3"
                width="120"
                height="120"
              />
              <h4 className="fw-bold text-dark mb-1">{user?.name}</h4>
              <span
                className="badge bg-secondary px-3 py-2 text-uppercase mb-3"
                style={{ letterSpacing: "1px" }}
              >
                {user?.role || "Member"}
              </span>
            </div>

            <div className="text-start border-top pt-4">
              <h6 className="fw-bold text-muted mb-3 text-uppercase small">
                Identity Information
              </h6>
              <div className="mb-2">
                <strong className="text-dark">Email:</strong> {user?.email}
              </div>
              <div className="mb-2">
                <strong className="text-dark">Phone:</strong>{" "}
                {user?.phone || "Not provided"}
              </div>
              <div className="mb-2">
                <strong className="text-dark">City:</strong>{" "}
                {user?.city || "Not provided"}
              </div>
              <div className="mb-2">
                <strong className="text-dark">Address:</strong>{" "}
                {user?.area || user?.address || "Not provided"}
              </div>
              {user?.organization && (
                <div className="mb-2">
                  <strong className="text-dark">Organization:</strong>{" "}
                  {user?.organization}
                </div>
              )}
            </div>

            <Link
              to="/settings"
              className="btn btn-outline-dark w-100 mt-4 rounded-3 fw-bold"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Campaigns & Events */}
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-4 h-100">
            {/* Ongoing Campaigns Panel */}
            <div className="card border-0 shadow-sm rounded-4 p-4 flex-grow-1">
              <h5 className="fw-bold text-dark mb-4 d-flex justify-content-between align-items-center">
                <span>📢 Ongoing Campaigns</span>
                <Link to="/campaigns" className="btn btn-sm btn-light fw-bold">
                  View All
                </Link>
              </h5>
              <div className="row g-3">
                {stats.activeCampaigns.length === 0 ? (
                  <div className="col-12 text-muted small">
                    No active campaigns at the moment.
                  </div>
                ) : (
                  stats.activeCampaigns.map((campaign) => (
                    <div className="col-md-6" key={campaign._id}>
                      <div className="border p-3 rounded-3 bg-light h-100">
                        <h6 className="fw-bold text-primary text-truncate">
                          {campaign.title}
                        </h6>
                        <p className="small text-muted mb-0 text-truncate">
                          {campaign.description || "Support our latest cause."}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Events Panel */}
            <div className="card border-0 shadow-sm rounded-4 p-4 flex-grow-1">
              <h5 className="fw-bold text-dark mb-4 d-flex justify-content-between align-items-center">
                <span>📅 New Upcoming Events</span>
                <Link to="/events" className="btn btn-sm btn-light fw-bold">
                  View All
                </Link>
              </h5>
              <div className="d-flex flex-column gap-3">
                {stats.upcomingEvents.length === 0 ? (
                  <div className="text-muted small">
                    No upcoming events scheduled.
                  </div>
                ) : (
                  stats.upcomingEvents.map((event) => {
                    // 1. Get the user ID and role
                    const userId = user?._id || user?.id;
                    const isVolunteer = user?.role === "Volunteer";

                    // 2. Check if the user's ID exists in the relevant array
                    const hasJoined = isVolunteer
                      ? event.volunteers?.includes(userId)
                      : event.attendees?.includes(userId);

                    return (
                      <div
                        key={event._id}
                        className="d-flex justify-content-between align-items-center border p-3 rounded-3"
                      >
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">
                            {event.title}
                          </h6>
                          <div className="small text-muted">
                            📍 {event.location} | 🕒{" "}
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                        </div>

                        {/* 3. Conditionally render Badge vs Button */}
                        {hasJoined ? (
                          <span
                            className="badge bg-success px-3 py-2 rounded-pill shadow-sm"
                            style={{ fontSize: "0.8rem" }}
                          >
                            ✓ Already joined
                          </span>
                        ) : (
                          <Link
                            to="/events"
                            className="btn btn-sm btn-dark px-3 fw-bold"
                          >
                            Join
                          </Link>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. ADMIN / LEAD DEV DASHBOARD COMPONENT
// ==========================================
const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (error) {
        toast.error("Failed to load system statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="p-5 text-center text-muted">
        Synchronizing network data...
      </div>
    );

  return (
    <div className="container-fluid p-4 p-md-5">
      {/* 1. WELCOME BANNER & IDENTITY */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white d-flex flex-column flex-md-row align-items-md-center justify-content-between">
        <div className="d-flex align-items-center gap-4">
          <img
            src={
              user?.profileImage
                ? `http://localhost:5000${user.profileImage}`
                : `https://ui-avatars.com/api/?name=${
                    user?.name || "U"
                  }&background=1E293B&color=fff&size=80&bold=true`
            }
            alt="Profile"
            className="rounded-circle shadow-sm object-fit-cover border"
            width="75"
            height="75"
          />
          <div>
            <h3 className="fw-bold text-dark mb-0">
              Welcome back, {user?.name}
            </h3>
            <span
              className="badge bg-primary mt-2 px-3 py-2 text-uppercase"
              style={{ letterSpacing: "1px" }}
            >
              {user?.role === "Lead Developer"
                ? "DEV MODE ACTIVE"
                : "ADMINISTRATOR"}
            </span>
          </div>
        </div>
        <div className="text-md-end mt-4 mt-md-0">
          <p className="text-muted small mb-0 fw-bold text-uppercase">
            System Status
          </p>
          <div className="text-success fw-bold d-flex align-items-center gap-2 justify-content-md-end">
            <span
              className="spinner-grow spinner-grow-sm"
              role="status"
              aria-hidden="true"
            ></span>
            All systems operational
          </div>
        </div>
      </div>

      {/* 2. TOP LEVEL METRICS GRID */}
      <div className="row g-4 mb-4">
        {[
          {
            label: "Total Network Users",
            value: stats?.system.totalUsers,
            color: "primary",
            icon: "👥",
          },
          {
            label: "New Cases (Pending)",
            value: stats?.system.newCases,
            color: "warning",
            icon: "📂",
          },
          {
            label: "Active Campaigns",
            value: stats?.system.activeCampaigns,
            color: "success",
            icon: "📢",
          },
          {
            label: "Upcoming Events",
            value: stats?.system.upcomingEvents,
            color: "info",
            icon: "📅",
          },
          {
            label: "Pending Applications",
            value: stats?.system.pendingApps,
            color: "danger",
            icon: "📄",
          },
        ].map((metric, idx) => (
          <div className="col-sm-6 col-lg-3 flex-grow-1" key={idx}>
            <div
              className={`card border-0 shadow-sm rounded-4 p-4 h-100 border-start border-4 border-${metric.color}`}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">
                  {metric.label}
                </span>
                <span className="fs-4">{metric.icon}</span>
              </div>
              <h2 className="fw-bold mb-0 text-dark">{metric.value || 0}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* 3. DETAILED ANALYTICS (Charts & Tables) */}
      <div className="row g-4">
        {/* User Distribution */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h6 className="fw-bold text-dark mb-4 text-uppercase border-bottom pb-2">
              Network Distribution
            </h6>
            <div className="d-flex flex-column gap-3">
              {stats?.userDistribution.map((dist, idx) => (
                <div
                  key={idx}
                  className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3"
                >
                  <span className="fw-bold text-secondary">
                    {dist._id || "Unassigned"}
                  </span>
                  <span className="badge bg-dark rounded-pill px-3 py-2 fs-6">
                    {dist.count}
                  </span>
                </div>
              ))}
              {stats?.userDistribution.length === 0 && (
                <p className="text-muted small">No user data available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Top 5 Provided Assets */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h6 className="fw-bold text-dark mb-4 text-uppercase border-bottom pb-2">
              Top Distributed Assets
            </h6>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-muted small text-uppercase">
                  <tr>
                    <th>Asset Classification</th>
                    <th className="text-end">Total Distributed</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.topAssets.map((asset, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold text-capitalize text-dark py-3">
                        {/* Medals removed for clean consistency */}
                        {asset._id || "Unknown Asset"}
                      </td>
                      <td className="text-end fw-bold text-primary py-3 fs-5">
                        {asset.totalQuantity.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!stats?.topAssets || stats.topAssets.length === 0) && (
                    <tr>
                      <td colSpan="2" className="text-center py-4 text-muted">
                        No distribution data recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. THE TRAFFIC COP (Main Export)
// ==========================================
const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = ["Lead Developer", "Admin"].includes(user?.role);

  // Routes the user to the correct component based on role
  if (isAdmin) {
    return <AdminDashboard user={user} />;
  } else {
    return <MemberDashboard user={user} />;
  }
};

export default Dashboard;
