import express from 'express';
import request from 'supertest';
import router from '../backEnd/api/bibleVerse.js';

const app = express();
app.use('/', router);

describe('BibleVerse API', () => {
    test('should return a 200 status code', async () => {
        const response = await request(app).get('/random/Genesis');
        expect(response.status).toBe(200);
        
    });
});  

describe("data returned back from the api", () => {
    test("should have fields like verseNumber, value,", async () => {
        const response = await request(app).get('/random/Genesis');
        
        expect(response.body.VerseNumber).toBeDefined;

    });
});



describe("testing the length of the response", () => {
    test("should return the first six verses", async () => {
        
        const response = await request(app).get('/random/Genesis');
        
        expect(response.body.final).toHaveLength(6);
    });
});


