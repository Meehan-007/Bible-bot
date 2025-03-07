import { User } from '../backEnd/models/user.js';
import request from 'supertest';
import express from 'express';
import app from '../backEnd/server.js';  // Use default import

   // Use the routes   

describe('Server create user', () => {
    it('should be able to make a user', () => {
        const user = new User({
            phone: '2234567890',
            url: 'http://localhost:3001/api/random/exodus'
        });
        expect(user.phone).toBe('2234567890');
        expect(user.url).toBe('http://localhost:3001/api/random/exodus');
    });
});

describe('Server signup', () => {
    it('should be able to return 200', async () => {
        const response = await request(app).post('/signup').send({
            phone: '2234567890',
            url: 'http://localhost:3001/api/random/exodus',
            message: ''
        });
        expect(response.status).toBe(200);
       
        
    });
}); 

describe("server signup", () => {
    it("should be able to return a the right phone number", async () => {
        const response = await request(app).post('/signup').send({
            phone: '2234567890',
            url: 'http://localhost:3001/api/random/exodus'
        });
        expect(response.body.user.phone).toBe('2234567890');
    });
});

describe("server signup", () => {
    it("should be able to return the right url", async () => {
        try {
            const response = await request(app).post('/signup').send({
                phone: '2234567890',
                url: 'http://localhost:3001/api/random/exodus'
            });
            
            // Debug logs
            console.log('Status:', response.status);
            console.log('Response:', response);
            console.log('Body:', response.body);
            
            // Check the correct response structure
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User saved successfully');
            expect(response.body.user.url).toBe('http://localhost:3001/api/random/exodus');
        } catch (error) {
            console.error('Test error:', error);
            throw error;
        }
    });
});

describe("server login", () => {
    it("should be able to login", async () => {
        const response = await request(app).post('/login').send({
            phone: '2234567890',
            url: 'http://localhost:3001/api/random/exodus'
        });
        expect(response.status).toBe(202);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.phone).toBe('1234567890');
        expect(response.body.url).toBe('http://localhost:3001/api/random/exodus');
    });
}); 

describe("server delete user", () => {
    it("should be able to delete a user", async () => {
        const response = await request(app).delete('/delete').send({
            phone: '2234567890',
            url: 'http://localhost:3001/api/random/exodus'
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });
}); 
     