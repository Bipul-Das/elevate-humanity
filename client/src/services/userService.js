// client/src/services/userService.js
import api from './api';

export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const updatePassword = async (passwordData) => {
  const response = await api.put('/users/password', passwordData);
  return response.data;
};

export const uploadPhoto = async (formData) => {
  const response = await api.post('/users/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};



export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};