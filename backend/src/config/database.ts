import mongoose from 'mongoose';
import logger from '../utils/logger';

export const initializeDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/openpaws';
        logger.info('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        logger.info('Connected to MongoDB successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', { error: error instanceof Error ? error.message : 'Unknown error' });
        throw error;
    }
}; 