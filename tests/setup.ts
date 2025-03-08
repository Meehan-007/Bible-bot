import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI must be defined');
    }
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB in test environment');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
});

beforeEach(async () => {
    // Clean database before each test
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
}); 