import supertest from 'supertest';
import { app } from '../../src/app';
import { mongoClient } from '../../src/services/mongodb';
import { gameRepository } from '../../src/game/game.repository';
import { createGame } from '../../src/game/game.fixtures';
import { Game } from '../../src/game/game';
import { createPlayer } from '../../src/player/player.fixtures';

describe('Test /api/game', () => {
    test('GET /api/game', async () => {
        gameRepository.populate(10, createGame);

        const response = await supertest(app).get('/api/game');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(10);
    });

    test('GET /api/game?tour=ATP', async () => {
        gameRepository.clear();
        const gamesATP = Array.from({ length: 10 }, () => createGame({ tour: 'ATP' }));
        const gamesWTA = Array.from({ length: 8 }, () => createGame({ tour: 'WTA' }));
        gameRepository.insert(...[...gamesATP, ...gamesWTA]);
        

        const response = await supertest(app).get('/api/game?tour=ATP');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(10);
        response.body.forEach((game: Game) => {
            expect(game.tour).toEqual('ATP');
        });
    });

    test('GET /api/game?state=ongoing', async () => {
        gameRepository.clear();
        const gamesOnGoing = Array.from({ length: 10 }, () => createGame({ winner: null }));
        const gamesCompleted = Array.from({ length: 8 }, () => createGame({ winner: 0}));
        gameRepository.insert(...[...gamesOnGoing, ...gamesCompleted]);
        

        const response = await supertest(app).get('/api/game?state=ongoing');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(10);
        response.body.forEach((game: Game) => {
            expect(game.state.winner).toBeNull();
        });
    });

    test('GET /api/game?lastName=feldup', async () => {
        gameRepository.clear();
        const gamesPlayer1 = Array.from({ length: 5 }, () => createGame({ players: { player1: createPlayer({ lastName: 'feldup' }), player2: createPlayer() } }));
        const gamesPlayer2 = Array.from({ length: 5 }, () => createGame({ players: { player1: createPlayer(), player2: createPlayer({ lastName: 'feldup' }) } }));
        const gamesOthers= Array.from({ length: 10 }, () => createGame());
        gameRepository.insert(...[...gamesPlayer1, ...gamesPlayer2, ...gamesOthers]);
        
        const response = await supertest(app).get('/api/game?lastName=feldup');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(10);
        response.body.forEach((game: Game) => {
            expect([game.players.player1.lastName, game.players.player2.lastName])
                .toContain('feldup');
        });
    });

    afterAll(async () => {
        await mongoClient.close();
    })
    
}); 
