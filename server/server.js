// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path'); // Moved to the top for best practices

const connectDB = require('./config/db'); 
const authRoutes = require('./routes/authRoutes'); 
const inventoryRoutes = require('./routes/inventoryRoutes'); 
const caseRoutes = require('./routes/caseRoutes'); 

// 1. Load Config
dotenv.config();

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middlewares
app.use(express.json()); 
app.use(cors());         

// 🔥 HELMET FIX: Allow images to be loaded by the React frontend on a different port
app.use(helmet({
  crossOriginResourcePolicy: false, 
}));

app.use(morgan('dev'));  

// 4. Serve Static Files (The Profile Images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Test Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Elevate Humanity API is Running 🚀' });
});

// 6. Mount API Routes
app.use('/api/auth', authRoutes); 
app.use('/api/inventory', inventoryRoutes); 
app.use('/api/finance', require('./routes/donationRoutes'));
app.use('/api/cases', caseRoutes); // Cleaned this up to use your import at the top
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 7. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});