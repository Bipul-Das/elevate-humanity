// client/src/services/caseService.js
import api from './api';

export const getCases = async () => {
  const response = await api.get('/cases');
  return response.data;
};

export const createCase = async (caseData) => {
  const response = await api.post('/cases', caseData);
  return response.data;
};

export const rejectCase = async (id) => {
  const response = await api.put(`/cases/${id}/reject`);
  return response.data;
};

export const provideHelp = async (id, providedItems) => {
  const response = await api.post(`/cases/${id}/provide`, { providedItems });
  return response.data;
};