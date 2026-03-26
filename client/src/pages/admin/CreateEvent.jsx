// client/src/pages/admin/CreateEvent.jsx
import { useState } from "react";
import { createEvent } from "../../services/eventService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      toast.success("Event Created Successfully!");
      navigate("/events"); // Redirect to the view events page
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create event");
    }
  };

  return (
    <div className="container p-4" style={{ maxWidth: "600px" }}>
      <h2 className="fw-bold mb-4">Create New Event</h2>
      <div className="card shadow-sm border-0 p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold small">Event Title</label>
            <input
              type="text"
              className="form-control bg-light"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold small">Location</label>
            <input
              type="text"
              className="form-control bg-light"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold small">Date</label>
            <input
              type="date"
              className="form-control bg-light"
              min={new Date().toISOString().split("T")[0]}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold small">Description</label>
            <textarea
              className="form-control bg-light"
              rows="5"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-bold py-2">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
