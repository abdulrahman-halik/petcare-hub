const mongoose = require('mongoose');

const connectDB = async (retries = 5, delayMs = 3000) => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/petcare';

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const conn = await mongoose.connect(mongoUri);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return conn;
        } catch (error) {
            console.error(`[Database] Connection attempt ${attempt}/${retries} failed: ${error.message}`);
            if (attempt === retries) {
                console.error('[Database] All connection attempts exhausted.');
                throw error;
            }
            console.log(`[Database] Retrying connection in ${delayMs / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB connection lost.');
});

mongoose.connection.on('reconnected', () => {
    console.log('[Database] MongoDB connection restored.');
});

module.exports = connectDB;

