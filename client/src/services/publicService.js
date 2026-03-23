import api from './api';

export const getImpactStats = async () => {
  const response = await api.get('/public/stats');
  return response.data;
};

// ... existing getImpactStats import

export const submitVolunteerApp = async (formData) => {
  const response = await api.post('/public/apply', formData);
  return response.data;
};