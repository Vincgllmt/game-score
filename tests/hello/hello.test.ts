import supertest from 'supertest';
import { app } from '../../src/app';
        
describe('Test /api/hello', () => {
    test('GET /api/hello/world', async () => {
        const response = await supertest(app).get('/api/hello/world');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ message: 'Hello, world!' });
    });
    test('GET /api/hello/square/5', async () => {
        const response = await supertest(app).get('/api/hello/square/5');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ result: 25 });
    });
});