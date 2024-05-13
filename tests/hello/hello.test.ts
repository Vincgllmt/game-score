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
    test.each([
        {square: 1, expected: 1},
        {square: 4, expected: 16},
        {square: 5, expected: 25},
        {square: 10, expected: 100},
        {square: 12, expected: 144},
      ])('GET /api/hello/square/$square'
        , async ({square, expected}) => {
        const response = await supertest(app).get(`/api/hello/square/${square}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ result: expected });
      });
    test('GET /api/hello/square/XYZ', async () => {
        const response = await supertest(app).get('/api/hello/square/XYZ');
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ error: 'Invalid input' });
    });
}); 