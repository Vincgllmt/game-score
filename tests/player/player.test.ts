import supertest from 'supertest';
import { app } from '../../src/app';
import { mongoClient } from '../../src/services/mongodb';
import { playerRepository } from '../../src/player/player.repository';
import { createPlayer } from '../../src/player/player.fixtures';
describe('Test /api/player', () => {
    test('GET /api/player', async () => {
        await playerRepository.clear();
        const player = createPlayer();
        await playerRepository.insert(player);
        
        const response = await supertest(app).get("/api/player");
        
        expect(response.statusCode).toBe(200); 
        expect(response.body[0]).toEqual(player);
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

    afterAll(async () => {
        await mongoClient.close();
    })
})