import supertest from 'supertest';
import { app } from '../../src/app';
import { mongoClient } from '../../src/services/mongodb';
import { gameRepository } from '../../src/game/game.repository';
import { createGame } from '../../src/game/game.fixtures';

describe('Test /api/game', () => {
    test('GET /api/game', async () => {
        gameRepository.clear();
        gameRepository.populate(10, createGame);

        const response = await supertest(app).get('/api/game');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(10);
    });
    afterAll(async () => {
        await mongoClient.close();
    })
    
}); 
