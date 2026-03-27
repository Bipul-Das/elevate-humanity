// client/src/services/dashboardService.js
import api from './api';

export const getAdminStats = async () => {
  const response = await api.get('/dashboard/admin-stats');
  return response.data;
};

// NEW: Fetch user dashboard data
export const getUserStats = async () => {
  const response = await api.get('/dashboard/user-stats');
  return response.data;
};