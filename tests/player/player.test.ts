import supertest from 'supertest';
import { app } from '../../src/app';
import { mongoClient } from '../../src/services/mongodb';
import { playerRepository } from '../../src/player/player.repository';
import { createPlayer } from '../../src/player/player.fixtures';
import exp from 'constants';
describe('Test /api/player', () => {
    test('GET /api/player', async () => {
        await playerRepository.clear();

        for (let i = 0; i < 10; i++) {
            await playerRepository.insert(createPlayer());
        }
        
        const response = await supertest(app).get("/api/player");

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(10);
        response.body.forEach((player: any) => {
            expect(player).toHaveProperty('firstName');
            expect(player).toHaveProperty('lastName');
            expect(player).toHaveProperty('country');
            expect(player).toHaveProperty('tour');
        });
    })
    test('GET /api/player?lastName=feldup', async () => {
        await playerRepository.clear();
        await playerRepository.insert(createPlayer({ lastName: "feldup"}));
        
        const response = await supertest(app).get("/api/player?lastName=feldup");
        
        expect(response.statusCode).toBe(200); 
        expect(response.body[0].lastName).toContain("feldup");
    })
    test('GET /api/player?tour=wta&country=feldupistan', async () => {
        await playerRepository.clear();
        await playerRepository.insert(createPlayer({ tour: 'WTA', country: 'feldupistan'}), createPlayer({ tour: 'ATP', country: 'feldupistan'}));
        
        
        const response = await supertest(app).get("/api/player?tour=WTA&country=feldupistan");
        
        expect(response.statusCode).toBe(200); 
        expect(response.body.length).toEqual(1);
        expect(response.body[0].country).toContain("feldupistan");
    })
    test('GET /api/player/{id}', async () => {
        await playerRepository.clear();
        const player = createPlayer();
        const inserted = await playerRepository.insert(player);
        
        const response = await supertest(app).get(`/api/player/${inserted.insertedIds[0]}`);
        
        expect(response.statusCode).toBe(200); 
        expect(response.body.firstName).toEqual(player.firstName);
        expect(response.body.lastName).toEqual(player.lastName);
        expect(response.body.country).toEqual(player.country);
        expect(response.body.tour).toEqual(player.tour);
    })
    test('GET /api/player/{id} Not found', async () => {
        await playerRepository.clear();
        
        const response = await supertest(app).get(`/api/player/6641d45e2607250013854265`);
        
        expect(response.statusCode).toBe(404); 
        expect(response.body).toStrictEqual({ error: 'Not found' });
    })
    test('GET /api/player/{id} invalid id', async () => {
        await playerRepository.clear();
        
        const response = await supertest(app).get(`/api/player/123456`);
        
        expect(response.statusCode).toBe(400); 
        expect(response.body).toStrictEqual({ error: 'Invalid input' });
    }),
    test('POST /api/player', async () => {
        await playerRepository.clear();
        const player = createPlayer();
        
        const response = await supertest(app)
            .post("/api/player")
            .send(player);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.firstName).toEqual(player.firstName);
        expect(response.body.lastName).toEqual(player.lastName);
        expect(response.body.country).toEqual(player.country);
        expect(response.body.tour).toEqual(player.tour);
    });
    test('POST /api/player invalid value', async () => {
        await playerRepository.clear();
        
        const response = await supertest(app)
            .post("/api/player");
        
        expect(response.statusCode).toBe(400);
        expect(response.body).toStrictEqual({ error: 'Invalid input' });
    });
    test('DELETE /api/player/{id}', async () => {
        await playerRepository.clear();
        const player = createPlayer();
        const inserted = await playerRepository.insert(player);

        const response = await supertest(app).delete(`/api/player/${inserted.insertedIds[0]}`);

        expect(response.statusCode).toBe(204);
        expect(await playerRepository.findAll()).toStrictEqual([]);
    })
    test('DELETE /api/player/{id} Not found', async () => {
        await playerRepository.clear();
        const response = await supertest(app).delete(`/api/player/6641d45e2607250013854265`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ error: 'Not found' });
    })
    afterAll(async () => {
        await mongoClient.close();
    })
})