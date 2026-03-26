// server/routes/inventoryRoutes.js
const express = require('express');
const { 
  getInventory, 
  addItem, 
  updateItem, 
  deleteItem 
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Apply Base Protection to ALL inventory routes (Must be logged in)
router.use(protect); 

// 2. Define Allowed Roles (Strictly enforcing your sketch notes)
// Only Committee, Org Admins, and Lead Developers can access logistics
const inventoryAccess = authorize('Lead Developer', 'Admin');

// 3. Define Routes

// VIEW all inventory items
router.get('/', inventoryAccess, getInventory);

// ADD a new item to inventory
router.post('/', inventoryAccess, addItem);

// UPDATE an existing item's quantity
router.put('/:id', inventoryAccess, updateItem);

// DELETE an item from inventory
router.delete('/:id', inventoryAccess, deleteItem);

module.exports = router;