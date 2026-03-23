// client/src/services/caseService.js
import api from './api';

// Get all cases (Sorted by Urgency)
export const getCases = async () => {
  const response = await api.get('/cases');
  return response.data;
};

// Create a new Help Request
export const createCase = async (caseData) => {
  const response = await api.post('/cases', caseData);
  return response.data;
};

// Update Status (Approve/Reject)
export const updateCaseStatus = async (id, status) => {
  const response = await api.put(`/cases/${id}/status`, { status });
  return response.data;
};