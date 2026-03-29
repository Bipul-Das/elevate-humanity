// client/src/pages/admin/Events.jsx
import { useState, useEffect } from "react";
import { getEvents, toggleJoinEvent } from "../../services/eventService";
import toast from "react-hot-toast";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("New");
  const [now, setNow] = useState(new Date().getTime());
  const [isVisible, setIsVisible] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isVolunteer = user?.role === "Volunteer";

  // Real-time clock for countdowns
  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to load events");
    }
  };

  const handleJoin = async (eventId) => {
    try {
      await toggleJoinEvent(eventId);
      loadEvents(); // Refresh data to update counts
      toast.success("Operational participation updated!");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Helper function to format the countdown timer
  const getCountdown = (eventDate) => {
    const startOfEventDay = new Date(eventDate).setHours(0, 0, 0, 0);
    const distance = startOfEventDay - now;

    if (distance <= 0) return null; // Event day has arrived

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Process and categorize events
  const categorizedEvents = events.map((event) => {
    const startOfEventDay = new Date(event.date).setHours(0, 0, 0, 0);
    // 00:00 of the NEXT day
    const endOfEventDay = new Date(startOfEventDay).setDate(
      new Date(startOfEventDay).getDate() + 1
    );

    let status = "Upcoming";
    if (now >= endOfEventDay) status = "Ended";
    else if (now >= startOfEventDay) status = "Ongoing";

    return { ...event, status, startOfEventDay };
  });

  const newEvents = categorizedEvents.filter((e) => e.status !== "Ended");
  const olderEvents = categorizedEvents
    .filter((e) => e.status === "Ended")
    .sort((a, b) => b.startOfEventDay - a.startOfEventDay);

  const displayEvents = activeTab === "New" ? newEvents : olderEvents;

  // Enterprise-Grade Custom Styles
  const customStyles = `
    .hover-lift-card {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .hover-lift-card:hover {
      transform: translateY(-4px);
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

    .telemetry-box {
      background-color: #0F172A;
      color: #38BDF8;
      font-family: 'Courier New', Courier, monospace;
      letter-spacing: 1px;
    }
  `;

  return (
    <div className="container-fluid p-4 p-md-5 bg-light min-vh-100">
      <style>{customStyles}</style>

      {/* Header Section */}
      <div className={`mb-5 animate-fade-up ${isVisible ? "" : "d-none"}`}>
        <h2 className="fw-bolder text-dark mb-2 d-flex align-items-center gap-3">
          <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 fs-4 d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px" }}>
            ⏱️
          </div>
          Field Deployments
        </h2>
        <p className="text-muted ms-1">Monitor upcoming operations, track live logistics, and manage network participation.</p>
      </div>

      {/* Modern Segmented Tabs */}
      <div className={`d-flex gap-4 mb-5 border-bottom animate-fade-up ${isVisible ? "" : "d-none"}`} style={{ animationDelay: "0.1s" }}>
        <div
          className={`tab-custom text-secondary ${activeTab === "New" ? "active" : ""}`}
          onClick={() => setActiveTab("New")}
        >
          Active Operations
        </div>
        <div
          className={`tab-custom text-secondary ${activeTab === "Older" ? "active" : ""}`}
          onClick={() => setActiveTab("Older")}
        >
          Archived Operations
        </div>
      </div>

      {/* Event Feed */}
      <div className="d-flex flex-column gap-4 align-items-center pb-5">
        {displayEvents.length === 0 ? (
          <div className={`w-100 animate-fade-up ${isVisible ? "" : "d-none"}`} style={{ maxWidth: "800px", animationDelay: "0.2s" }}>
            <div className="bg-white rounded-4 shadow-sm p-5 border text-center">
              <div className="text-muted fs-1 mb-3">📅</div>
              <h4 className="fw-bold text-dark">No Deployments Found</h4>
              <p className="text-muted mb-0">There are currently no operations categorized under this filter.</p>
            </div>
          </div>
        ) : (
          displayEvents.map((event, index) => {
            const userId = user?._id || user?.id;

            const hasJoined = isVolunteer
              ? event.volunteers.includes(userId)
              : event.attendees.includes(userId);

            const countdown = getCountdown(event.date);

            return (
              <div
                key={event._id}
                className={`card border-0 shadow-sm rounded-4 w-100 hover-lift-card bg-white animate-fade-up overflow-hidden`}
                style={{
                  maxWidth: "800px",
                  animationDelay: `${0.1 * (index + 2)}s`,
                }}
              >
                {/* Top Colored Bar Indicator */}
                <div
                  style={{ height: "4px" }}
                  className={`w-100 ${
                    event.status === "Ongoing"
                      ? "bg-success"
                      : event.status === "Ended"
                      ? "bg-secondary"
                      : "bg-primary"
                  }`}
                ></div>

                <div className="card-body p-0">
                  <div className="row g-0">
                    {/* Left Panel: Details */}
                    <div className="col-md-8 p-4 p-md-5">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        {event.status === "Upcoming" && (
                          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill small fw-bold text-uppercase">
                            Upcoming
                          </span>
                        )}
                        {event.status === "Ongoing" && (
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill small fw-bold text-uppercase d-flex align-items-center gap-2">
                            <span
                              className="spinner-grow spinner-grow-sm text-success"
                              style={{ width: "8px", height: "8px" }}
                            ></span>
                            Operation Active
                          </span>
                        )}
                        {event.status === "Ended" && (
                          <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-3 py-2 rounded-pill small fw-bold text-uppercase">
                            Operation Concluded
                          </span>
                        )}

                        <span className="text-muted small fw-bold d-flex align-items-center gap-1">
                          🗓 {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="fw-bolder text-dark mb-2 lh-sm">
                        {event.title}
                      </h4>
                      <div className="text-muted small fw-bold mb-4 d-flex align-items-center gap-1">
                        <span className="text-primary">📍</span>{" "}
                        {event.location}
                      </div>

                      <div className="bg-light p-3 rounded-3 border mb-4">
                        <p
                          className="mb-0 small text-dark lh-lg font-monospace"
                          style={{ fontSize: "0.85rem" }}
                        >
                          "{event.description}"
                        </p>
                      </div>

                      {/* Action Area (Only for New/Ongoing) */}
                      {event.status !== "Ended" && (
                        <div className="mt-2">
                          {hasJoined ? (
                            <div className="d-flex align-items-center gap-3">
                              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-4 py-2 fs-6 rounded-pill">
                                ✓ Roster Confirmed
                              </span>
                              <button
                                onClick={() => handleJoin(event._id)}
                                disabled={event.status === "Ongoing"}
                                className="btn btn-link text-danger small fw-bold px-0 text-decoration-none"
                              >
                                Withdraw Commitment
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                              <button
                                onClick={() => handleJoin(event._id)}
                                disabled={event.status === "Ongoing"}
                                className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm text-uppercase"
                                style={{ letterSpacing: "1px" }}
                              >
                                {isVolunteer
                                  ? "Mobilize for Event"
                                  : "Pledge Support"}
                              </button>
                              <span
                                className="text-muted small fw-bold text-uppercase"
                                style={{ letterSpacing: "1px" }}
                              >
                                Awaiting Confirmation
                              </span>
                            </div>
                          )}

                          {event.status === "Ongoing" && (
                            <div className="small text-danger mt-3 fw-bold d-flex align-items-center gap-2">
                              🔒 Deployment Locked (Operation Active)
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Panel: Telemetry & Stats */}
                    <div className="col-md-4 bg-light border-start p-4 p-md-5 d-flex flex-column justify-content-center h-100">
                      {/* Telemetry Clock */}
                      {event.status === "Upcoming" && countdown && (
                        <div className="mb-5">
                          <span
                            className="small text-muted fw-bold text-uppercase mb-2 d-block"
                            style={{ letterSpacing: "1px" }}
                          >
                            Launch Window
                          </span>
                          <div className="telemetry-box p-3 rounded-3 text-center fw-bold fs-6 shadow-inner">
                            {countdown}
                          </div>
                        </div>
                      )}

                      {/* Network Participation Stats */}
                      <div>
                        <span
                          className="small text-muted fw-bold text-uppercase mb-3 d-block"
                          style={{ letterSpacing: "1px" }}
                        >
                          {event.status === "Ended"
                            ? "Final Participation"
                            : "Confirmed Roster"}
                        </span>

                        <div className="d-flex flex-column gap-3">
                          <div className="d-flex align-items-center justify-content-between bg-white p-3 rounded-3 border shadow-sm">
                            <span className="fw-bold text-dark small">
                              🏃 Volunteers
                            </span>
                            <span className="badge bg-primary fs-6 rounded-pill">
                              {event.volunteers.length}
                            </span>
                          </div>

                          <div className="d-flex align-items-center justify-content-between bg-white p-3 rounded-3 border shadow-sm">
                            <span className="fw-bold text-dark small">
                              🤝 Attendees
                            </span>
                            <span className="badge bg-success fs-6 rounded-pill">
                              {event.attendees.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default Events;