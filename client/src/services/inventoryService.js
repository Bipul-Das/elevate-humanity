// client/src/services/inventoryService.js
import api from './api';

// Get all items (Backend sorts by Expiry Date)
export const getInventory = async () => {
  const response = await api.get('/inventory');
  return response.data;
};

// Add new item (Admin Only)
export const addItem = async (itemData) => {
  const response = await api.post('/inventory', itemData);
  return response.data;
};

// Redeem item via QR Code (Volunteer/Admin)
export const redeemItem = async (batchNumber, quantityToRedeem = 1) => {
  const response = await api.post('/inventory/redeem', {
    batchNumber,
    quantityToRedeem
  });
  return response.data;
};