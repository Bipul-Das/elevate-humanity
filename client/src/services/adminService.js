import api from './api';

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getApplications = async () => {
  const response = await api.get('/admin/applications');
  return response.data;
};

export const approveApp = async (id) => {
  const response = await api.post(`/admin/approve/${id}`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const addHours = async (id, hours) => {
  const response = await api.put(`/admin/users/${id}/hours`, { hours });
  return response.data;
};

// ... existing functions

export const createStaff = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

export const updateStaff = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};