// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db'); // Import the connection logic
const authRoutes = require('./routes/authRoutes'); // <--- ADD THIS

const inventoryRoutes = require('./routes/inventoryRoutes'); // <--- ADD THIS
const caseRoutes = require('./routes/caseRoutes'); // <--- Import this

// 1. Load Config
dotenv.config();

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middlewares
app.use(express.json()); 
app.use(cors());         
app.use(helmet());       
app.use(morgan('dev'));  

// 4. Routes (We will add these later)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Elevate Humanity API is Running 🚀' });
});

// 5. Start Server
const PORT = process.env.PORT || 5000;

// Mount Routes
app.use('/api/auth', authRoutes); // <--- ADD THIS
app.use('/api/inventory', inventoryRoutes); // <--- ADD THIS
app.use('/api/finance', require('./routes/donationRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});