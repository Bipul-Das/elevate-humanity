// client/src/services/publicService.js
import api from './api';

export const getLandingStats = async () => {
  const response = await api.get('/public/stats');
  return response.data;
};