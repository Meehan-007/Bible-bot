import { User } from '../backEnd/models/user.js';





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