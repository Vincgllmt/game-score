import supertest from 'supertest';
import { app } from '../../src/app';
import { mongoClient } from '../../src/services/mongodb';
import { helloRepository } from '../../src/hello/hello.repository';

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
    test("GET /api/hello", async () => {
        await helloRepository.clear();
        await helloRepository.insert(
            { message: "hello" },
            { message: "world" },
        ); 
        
        const response = await supertest(app).get("/api/hello");
        
        expect(response.statusCode).toBe(200); 
        expect(response.body.length).toEqual(2);
        expect(response.body[0].message).toEqual("hello");
        expect(response.body[1].message).toEqual("world"); 
    });

    test("POST /api/hello", async () => {
        await helloRepository.clear();
        
        const response = await supertest(app)
            .post("/api/hello")
            .send({ message: "feldiagonal" });
        
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual("feldiagonal");
    });

    test("POST /api/hello invalid value", async () => {
        await helloRepository.clear();
        
        const response = await supertest(app)
            .post("/api/hello");
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toEqual("Invalid input");
    });
    test("GET /api/hello/{id}", async () => {
        await helloRepository.clear();
        const result = await helloRepository.insert(
            { message: "feldiagonal" },
        ); 
        const response = await supertest(app).get(`/api/hello/${result.insertedIds[0]}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("feldiagonal");
    })
    test("GET /api/hello/{id} not found", async () => {
        await helloRepository.clear();
        const response = await supertest(app).get(`/api/hello/6641d45e2607250013854265`);

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toEqual("Message non trouvé.");
    })
    test("DELETE /api/hello/{id}", async () => {
        await helloRepository.clear();
        const result = await helloRepository.insert(
            { message: "feldiagonal" },
        ); 
        const response = await supertest(app).delete(`/api/hello/${result.insertedIds[0]}`);

        expect(response.statusCode).toBe(204);
        expect(await helloRepository.findAll()).toStrictEqual([]);
    })
    afterAll(async () => {
        await mongoClient.close();
    })
    
}); 
