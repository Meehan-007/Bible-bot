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

describe('signup user', () => {
    it('should be able to make a user', async () => {
        const response = await request(app).post('/signup').send({
            phone: '1234569899',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });
        
        expect(response.status).toBe(200);
        expect(response.body.user.phone).toBe('1234569899');
        expect(response.body.user.url).toBe('http://localhost:3001/api/random/exodus');
    });
});