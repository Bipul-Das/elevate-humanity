// client/src/services/applicationService.js
import api from './api';

export const submitApplication = async (appData) => {
  const response = await api.post('/applications', appData);
  return response.data;
};

export const getApplications = async () => {
  const response = await api.get('/applications');
  return response.data;
};

export const updateAppStatus = async (id, status) => {
  const response = await api.put(`/applications/${id}`, { status });
  return response.data;
};