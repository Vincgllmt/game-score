import supertest from 'supertest';
import { app } from '../../src/app';
        
describe('Test /api/hello', () => {
    test('GET /api/hello/world', async () => {
        const response = await supertest(app).get('/api/hello/world');
        expect(response.statusCode).toBe(200);
    });
});