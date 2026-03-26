// server/controllers/eventController.js
const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Admin/Lead Dev)
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private (All logged-in users)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by closest date first
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Toggle participation in an event
// @route   POST /api/events/:id/join
// @access  Private (All logged-in users)
exports.toggleParticipation = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Determine target array based on role
    const isVolunteerRole = req.user.role === 'Volunteer';
    const targetArray = isVolunteerRole ? event.volunteers : event.attendees;
    
    // Check if user is already in the array
    const isJoined = targetArray.includes(req.user.id);

    if (isJoined) {
      // Remove them
      if (isVolunteerRole) {
        event.volunteers = event.volunteers.filter(id => id.toString() !== req.user.id);
      } else {
        event.attendees = event.attendees.filter(id => id.toString() !== req.user.id);
      }
    } else {
      // Add them
      if (isVolunteerRole) {
        event.volunteers.push(req.user.id);
      } else {
        event.attendees.push(req.user.id);
      }
    }

    await event.save();
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};