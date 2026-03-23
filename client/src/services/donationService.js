// client/src/services/donationService.js
import api from './api';

// Get All Campaigns
export const getCampaigns = async () => {
  const response = await api.get('/finance/campaigns');
  return response.data;
};

// Create Campaign (Admin)
export const createCampaign = async (campaignData) => {
  const response = await api.post('/finance/campaigns', campaignData);
  return response.data;
};

// Donate (Process Money)
export const donate = async (paymentData) => {
  // paymentData = { campaignId, amount, isAnonymous, paymentMethod }
  const response = await api.post('/finance/donate', paymentData);
  return response.data;
};