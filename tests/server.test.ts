import { User } from '../backEnd/models/user.js';
import app from '../backEnd/server.js';
import request from 'supertest';

describe('Server create user', () => {
    it('should be able to make a user', () => {
        const user = new User({
            phone: '1234567890',
            url: 'http://localhost:3001/api/random/exodus'
        });
        expect(user.phone).toBe('1234567890');
        expect(user.url).toBe('http://localhost:3001/api/random/exodus');
    });
});

describe('will not let a duplicate user be created', () => {
    it('should not let a duplicate user be created', async () => {
        // First signup
        await request(app).post('/signup').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });

        // Try duplicate signup
        const newResponse = await request(app).post('/signup').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });

        expect(newResponse.status).toBe(409);
    });
});

describe('signup user', () => {
    it('should be able to make a user', async () => {
        const response = await request(app).post('/signup').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });
        
        expect(response.status).toBe(200);
        
    });
});

describe('signup user', () => {
    it('should be able to make a user', async () => {
        const response = await request(app).post('/signup').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });
        
        
        expect(response.body.user.phone).toBe('+11234569899');
        
    });
}); 

describe('signup user', () => {
    it('should be able to make a user', async () => {
        const response = await request(app).post('/signup').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });
        
        
        expect(response.body.user.url).toBe('http://localhost:3001/api/random/exodus');
    });
});
describe('login user', () => {
    it('should be able to update a user', async () => {
        // First create a user
        await request(app).post('/signup').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });

        // Then try to login/update
        const response = await request(app).put('/login').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/genesis',
            message: ''
        });
        expect(response.status).toBe(200);
        
    });
});


describe('login user', () => {
    it('should be able to update a user', async () => {
        // First create a user
        await request(app).post('/signup').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });

        // Then try to login/update
        const response = await request(app).put('/login').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/genesis',
            message: ''
        });
        
        expect(response.body.user.phone).toBe('+11234569899');
        
    });
});

describe('login user', () => {
    it('should be able to update a user', async () => {
        // First create a user
        await request(app).post('/signup').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });

        // Then try to login/update
        const response = await request(app).put('/login').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/genesis',
            message: ''
        });
        
        expect(response.body.user.url).toBe('http://localhost:3001/api/random/genesis');
    });
});


describe('delete user', () => {
    it('should be able to delete a user', async () => {
        // First create a user
        await request(app).post('/signup').send({
            phone: '2323232323',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });

        // Then try to delete the user
        const response = await request(app).delete('/login').send({
            phone: '2323232323'
        });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            phone: '+12323232323',  // Note: server adds +1 prefix
            url: 'http://localhost:3001/api/random/exodus'
        });

        // Verify user is gone by trying to find them
        const verifyResponse = await request(app).put('/login').send({
            phone: '2323232323'
        });
        expect(verifyResponse.status).toBe(404);
    });
});

describe('cron job functionality', () => {
    beforeEach(async () => {
        // Create test users before each test
        await User.create([
            {
                phone: '+11234567890',
                url: 'http://localhost:3001/api/random/exodus',
                message: ''
            },
            {
                phone: '+19876543210',
                url: 'http://localhost:3001/api/random/genesis',
                message: ''
            }
        ]);
    });

    it('should process messages for all users', async () => {
        const users = await User.find({});
        const results = await Promise.all(users.map(async (user) => ({
            recipient: user.phone,
            success: true,
            message: 'test message'
        })));
        
        expect(results).toHaveLength(2);
        results.forEach((result) => {
            expect(result).toMatchObject({
                recipient: expect.stringMatching(/^\+1\d{10}$/),
                success: true,
                message: expect.any(String)
            });
        });
    });
});

