// client/src/services/inventoryService.js
import api from './api';

// Get all items
export const getInventory = async () => {
  const response = await api.get('/inventory');
  return response.data;
};

// Add new item (Admin Only)
export const addItem = async (itemData) => {
  const response = await api.post('/inventory', itemData);
  return response.data;
};

// Update existing item (Admin Only)
export const updateItem = async (id, itemData) => {
  const response = await api.put(`/inventory/${id}`, itemData);
  return response.data;
};

// Delete item (Admin Only)
export const deleteItem = async (id) => {
  const response = await api.delete(`/inventory/${id}`);
  return response.data;
};