import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI must be defined');
    }
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.connection.close();
}); 