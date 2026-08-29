const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const { initReminderScheduler } = require('./services/reminderScheduler');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const petRoutes = require('./routes/petRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

// Connect to database
connectDB();

const app = express();

// Global Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/reminders', reminderRoutes);

// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Start Background Reminder Scheduler
initReminderScheduler();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
