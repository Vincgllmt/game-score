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
        await gameRepository.populate(10, createGame);

        const response = await supertest(app).get('/api/game');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(10);
    });

    test('GET /api/game?tour=ATP', async () => {
        await gameRepository.clear();
        const gamesATP = Array.from({ length: 10 }, () => createGame({ config: {tour: 'ATP', sets: 3} }));
        const gamesWTA = Array.from({ length: 8 }, () => createGame({ config: {tour: 'WTA', sets: 3} }));
        const allGames = [...gamesATP, ...gamesWTA];
        await gameRepository.insert(...allGames);
        

        const response = await supertest(app).get('/api/game?tour=ATP');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(10);
        response.body.forEach((game: Game) => {
            expect(game.config.tour).toEqual('ATP');
        });
    });

    test('GET /api/game?state=ongoing', async () => {
        await gameRepository.clear();
        const gamesOnGoing = Array.from({ length: 10 }, () => createGame({ winner: null }));
        const gamesCompleted = Array.from({ length: 8 }, () => createGame({ winner: 0}));
        await gameRepository.insert(...[...gamesOnGoing, ...gamesCompleted]);
        

        const response = await supertest(app).get('/api/game?state=ongoing');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(10);
        response.body.forEach((game: Game) => {
            expect(game.state.winner).toBeNull();
        });
    });

    test('GET /api/game?lastName=feldup', async () => {
        await gameRepository.clear();
        const gamesPlayer1 = Array.from({ length: 5 }, () => createGame({ players: { player1: createPlayer({ lastName: 'feldup' }), player2: createPlayer() } }));
        const gamesPlayer2 = Array.from({ length: 5 }, () => createGame({ players: { player1: createPlayer(), player2: createPlayer({ lastName: 'feldup' }) } }));
        const gamesOthers= Array.from({ length: 10 }, () => createGame());
        await gameRepository.insert(...[...gamesPlayer1, ...gamesPlayer2, ...gamesOthers]);
        
        const response = await supertest(app).get('/api/game?lastName=feldup');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toEqual(10);
        response.body.forEach((game: Game) => {
            expect([game.players.player1.lastName, game.players.player2.lastName])
                .toContain('feldup');
        });
    });
    test('POST /api/game/new', async () => {
        await gameRepository.clear();
        await playerRepository.clear();
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
    test('GET /api/game/{id}', async () => {
        await gameRepository.clear();
        const game = createGame();
        const result = await gameRepository.insert(game);
        const response = await supertest(app).get(`/api/game/${result.insertedIds[0]}`);

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toEqual(`${result.insertedIds[0]}`);
    });
    test('GET /api/game/{id} not found', async () => {
        await gameRepository.clear();
        const response = await supertest(app).get(`/api/game/123456789012345678901234`);
        expect(response.statusCode).toBe(404);
    });
    afterAll(async () => {
        await mongoClient.close();
    })
}); 
