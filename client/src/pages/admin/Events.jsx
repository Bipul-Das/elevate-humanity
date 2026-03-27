// client/src/pages/admin/Events.jsx
import { useState, useEffect } from "react";
import { getEvents, toggleJoinEvent } from "../../services/eventService";
import toast from "react-hot-toast";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("New");
  const [now, setNow] = useState(new Date().getTime());

  const user = JSON.parse(localStorage.getItem("user"));
  const isVolunteer = user?.role === "Volunteer";

  // Real-time clock for countdowns
  useEffect(() => {
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
      toast.success("Event participation updated!");
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

  return (
    <div className="container-fluid p-4">
      {/* Tabs Layout matching wireframe */}
      <ul className="nav nav-tabs mb-4 border-bottom border-dark">
        <li className="nav-item">
          <button
            className={`nav-link px-4 rounded-0 ${
              activeTab === "New"
                ? "active border-dark border-bottom-0 fw-bold text-dark"
                : "text-muted border-0"
            }`}
            onClick={() => setActiveTab("New")}
          >
            New
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link px-4 rounded-0 ${
              activeTab === "Older"
                ? "active border-dark border-bottom-0 fw-bold text-dark"
                : "text-muted border-0"
            }`}
            onClick={() => setActiveTab("Older")}
          >
            Older
          </button>
        </li>
      </ul>

      <div className="d-flex flex-column gap-4 align-items-center">
        {displayEvents.length === 0 ? (
          <div className="text-muted p-5">
            No events found in this category.
          </div>
        ) : (
          displayEvents.map((event) => {
            const userId = user?._id || user?.id;

            const hasJoined = isVolunteer
              ? event.volunteers.includes(userId)
              : event.attendees.includes(userId);

            const countdown = getCountdown(event.date);

            return (
              <div
                key={event._id}
                className="card border border-dark rounded-0 w-100 p-3"
                style={{ maxWidth: "800px" }}
              >
                {/* Top Row: Info Boxes */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  {/* Left: Time Status */}
                  <div
                    className="border border-dark p-2 text-center"
                    style={{ minWidth: "150px" }}
                  >
                    {event.status === "Ended" && (
                      <div className="small">This event ended on</div>
                    )}
                    <div className="fw-bold">
                      {event.status === "Upcoming" && countdown}
                      {event.status === "Ongoing" && "Ongoing"}
                      {event.status === "Ended" &&
                        new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Middle: Core Details */}
                  <div className="text-center px-3">
                    <h5 className="fw-bold mb-1">{event.title}</h5>
                    <div className="mb-0">{event.location}</div>
                    <div>Date: {new Date(event.date).toLocaleDateString()}</div>
                  </div>

                  {/* Right: Confirmed Stats */}
                  <div
                    className="border border-dark p-2 text-center"
                    style={{ minWidth: "150px" }}
                  >
                    <div className="fw-bold border-bottom border-dark mb-1 pb-1">
                      {event.status === "Ended" ? "Total joined" : "confirmed"}
                    </div>
                    <div className="small">
                      {event.volunteers.length} volunteers
                    </div>
                    <div className="small">
                      {event.attendees.length} attendees
                    </div>
                  </div>
                </div>

                {/* Middle: Description Box */}
                <div
                  className="border border-dark p-3 mb-3 bg-light text-center"
                  style={{ minHeight: "100px" }}
                >
                  {event.description}
                </div>

                {/* Bottom: Action Button (Only for New/Ongoing) */}
                {/* Bottom: Action Button (Only for New/Ongoing) */}
                {event.status !== "Ended" && (
                  <div className="text-center mt-3 pt-3 border-top">
                    {hasJoined ? (
                      // --- STATE: USER HAS ALREADY JOINED ---
                      <div className="d-flex flex-column align-items-center gap-2">
                        <span className="badge bg-success px-4 py-2 fs-6 rounded-pill shadow-sm">
                          ✓ Already joined
                        </span>
                        <button
                          onClick={() => handleJoin(event._id)}
                          disabled={event.status === "Ongoing"}
                          className="btn btn-outline-danger btn-sm mt-2 fw-bold rounded-0 px-4"
                        >
                          Cancel participation
                        </button>
                      </div>
                    ) : (
                      // --- STATE: USER HAS NOT JOINED YET ---
                      <div className="d-flex flex-column align-items-center gap-2">
                        <span
                          className="text-muted small fw-bold text-uppercase"
                          style={{ letterSpacing: "1px" }}
                        >
                          Haven't joined yet
                        </span>
                        <button
                          onClick={() => handleJoin(event._id)}
                          disabled={event.status === "Ongoing"}
                          className="btn btn-dark rounded-0 px-5 py-2 fw-bold shadow-sm"
                        >
                          {isVolunteer ? "Volunteer" : "Interested"}
                        </button>
                      </div>
                    )}

                    {/* Lock message for ongoing events */}
                    {event.status === "Ongoing" && (
                      <div className="small text-danger mt-3 fw-bold">
                        🔒 Registration locked (Event is Ongoing)
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        
      </div>
    </div>
  );
};

export default Events;
