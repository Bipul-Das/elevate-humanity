// client/src/services/eventService.js
import api from './api';

export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const toggleJoinEvent = async (eventId) => {
  const response = await api.post(`/events/${eventId}/join`);
  return response.data;
};