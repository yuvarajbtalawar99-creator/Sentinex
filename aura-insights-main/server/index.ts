import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*',
    credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || '';

// Disable buffering to see errors immediately instead of timing out
mongoose.set('bufferCommands', false);

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'SENTINEX API is Live', version: '1.0.0' });
});

import authRoutes from './routes/auth';
import moodRoutes from './routes/mood';
import dashboardRoutes from './routes/dashboard';
import orgRoutes from './routes/org';
import universityRoutes from './routes/university';
import corporateRoutes from './routes/corporate';
import healthcareRoutes from './routes/healthcare';
import governmentRoutes from './routes/government';
import adminRoutes from './routes/admin';
import reportRoutes from './routes/reports';
import notificationRoutes from './routes/notifications';

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/corporate', corporateRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// Startup Function
const startServer = async () => {
    try {
        const sanitizedUri = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
        console.log('🔌 Attempting MongoDB connection...');

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
            tls: true,
            family: 4
        });

        console.log('✅ Connected to MongoDB Atlas');

        app.listen(PORT, () => {
            console.log(`🚀 SENTINEX Server running on port ${PORT}`);
        });
    } catch (err: any) {
        console.error('❌ Failed to start server:', err.message);
        if (err.message.includes('IP address is not whitelisted')) {
            console.error('👉 TIP: Your current IP address might not be whitelisted in MongoDB Atlas.');
        }
        process.exit(1);
    }
};

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Runtime Error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB Disconnected');
});

startServer();
