import supertest from 'supertest';
import { app } from '../../src/app';
import { mongoClient } from '../../src/services/mongodb';
import { gameRepository } from '../../src/game/game.repository';
import { playerRepository } from '../../src/player/player.repository';
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
    test('POST /api/game/new', async () => {
        gameRepository.clear();
        playerRepository.clear();
        const player1 = createPlayer();
        const player2 = createPlayer();

        const result = await playerRepository.insert(player1, player2);
        const players = { id1: result.insertedIds[0], id2: result.insertedIds[1] };
        const response = await supertest(app)
            .post('/api/game/new')
            .send({players, config: {tour: 'ATP', sets: 5}});
        expect(response.statusCode).toBe(201);
        expect(response.body.players.player1._id).toEqual(`${players.id1}`);
        expect(response.body.players.player2._id).toEqual(`${players.id2}`);
        expect(response.body.config.tour).toEqual('ATP');
        expect(response.body.config.sets).toEqual(5);
        expect(response.body).toHaveProperty('state');
    });

    afterAll(async () => {
        await mongoClient.close();
    })
    
}); 
