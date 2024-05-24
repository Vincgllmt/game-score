import { Request, Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { gameCollection } from "./game.collection";
import { ObjectId } from "mongodb";
import { playerCollection } from "../player/player.collection";
import { Game } from "./game";
import { Player } from "../player/player";
import { updateGames, updateScore, updateSets } from "./game.model";
import { Controller } from "../base/controller";
import expressAsyncHandler from "express-async-handler";

export class GameController extends Controller<Game> {
    public async getAllGame(req: Request, res: Response) {
        const validator = validationResult(req);

        if (!validator.isEmpty()) {
            res.status(400).send({ error: 'Invalid input' });
            return;
        }

        const queryLastName = req.query.lastName;
        const queryTour = req.query.tour;
        const queryState = req.query.state;

        const players = await gameCollection.aggregate([
            {
                $match: {
                    $and: [
                        queryTour ? { "config.tour": queryTour } : {},
                        queryState ? { "state.winner": queryState === "ongoing" ? null : { $in: [0, 1] } } : {},
                        queryLastName ? {
                            $or: [
                                { "players.player1.lastName": { $regex: queryLastName, $options: 'i' } },
                                { "players.player2.lastName": { $regex: queryLastName, $options: 'i' } }
                            ]
                        } : {}
                    ]
                }
            }
        ]).toArray();

        res.send(players);

    }

    public async createGame(req: Request, res: Response) {
        const validator = validationResult(req);

        if (!validator.isEmpty()) {
            res.status(400).send({ error: 'Invalid input' });
            return;
        }

        const data = req.body;
        const id1 = data.players.id1 as string;
        const id2 = data.players.id2 as string;
        const players = await playerCollection.find<Player>({
            _id: { $in: [new ObjectId(id1), new ObjectId(id2)] }
        }).toArray();
        if (players.length !== 2) {
            res.status(404).send({ error: 'Player Not found' });
            return;
        }
        const game: Game = {
            players: { player1: players[0], player2: players[1] },
            config: data.config,
            state: { currentSet: 0, tieBreak: false, scores: [{ sets: 0, games: [], points: 0 }, { sets: 0, games: [], points: 0 }], winner: undefined }
        }
        await gameCollection.insertOne(game);

        res.status(201).send(game);
    }

    public async patchPointToPlayer(req: Request, res: Response) {
        const validator = validationResult(req);

        if (!validator.isEmpty()) {
            res.status(400).send({ error: 'Invalid input' });
            return;
        }

        const gameId = req.params.id;
        const playerId = parseInt(req.params.player) as 0 | 1;

        let game = await gameCollection.findOne<Game>({ _id: new ObjectId(gameId) });

        if (!game) {
            res.status(404).send({ error: 'Game Not found' });
            return;
        }

        const playerScore = game.state.scores[playerId].points;

        if (game.state.tieBreak) {
            if (playerScore <= 5) {
                updateScore(game, playerId);
            } else if (playerScore > game.state.scores[1 - playerId].points) {
                updateGames(game, playerId);
                updateSets(game, playerId);
            }
        }
        else {
            updateScore(game, playerId);
        }

        await gameCollection.updateOne({ _id: new ObjectId(gameId) }, { $set: { state: game.state } });

        res.status(200).json(game);
    }

    public newRouter() {
        const router = super.newRouter();
        router.get('/api/game',
            query('tour').optional().isString().isIn(['ATP', 'WTA']),
            query('state').optional().isString().isIn(['ongoing', "completed"]),
            query('lastName').optional().isString(),
            expressAsyncHandler(this.getAllGame.bind(this)));
        router.get('/api/game/:id',
            param('id').isString().isMongoId(),
            expressAsyncHandler(this.read.bind(this)));
        router.post('/api/game/new',
            body('config.tour').isString().isIn(['ATP', 'WTA']),
            body('players.id1').isString(),
            body('players.id2').isString(),
            body('config.sets').isInt({ min:1 }),
        expressAsyncHandler(this.createGame.bind(this)));

        router.patch('/api/game/:id/point/:player',
            param('id').isString().isMongoId(),
            param('player').isInt({ min:0, max:1 }),
            expressAsyncHandler(this.patchPointToPlayer.bind(this)));

        return router;
    }
}