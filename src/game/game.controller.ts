import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { gameCollection } from "./game.collection";
import { ObjectId } from "mongodb";
import { playerCollection } from "../player/player.collection";
import { Game, Score } from "./game";
import { Player } from "../player/player";

export class GameController {
    static async getAllGame(req: Request, res: Response) {
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
    static async getGameById(req: Request, res: Response) {
        const validator = validationResult(req);

        if (!validator.isEmpty()) {
            res.status(400).send({ error: 'Invalid input' });
            return;
        }

        const gameId = req.params.id;

        const game = await gameCollection.findOne({ _id: new ObjectId(gameId) });

        if (!game) {
            res.status(404).send({ error: 'Game not found' });
            return;
        }

        res.send(game);
    }
    static async createGame(req: Request, res: Response) {
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
            res.status(404).send({ error: 'Player not found' });
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

    static async patchPointToPlayer(req: Request, res: Response) {
        const validator = validationResult(req);

        if (!validator.isEmpty()) {
            res.status(400).send({ error: 'Invalid input' });
            return;
        }

        const gameId = req.params.id;
        const playerId = parseInt(req.params.player);

        let game = await gameCollection.findOne<Game>({ _id: new ObjectId(gameId) });

        if (!game) {
            res.status(404).send({ error: 'Game not found' });
            return;
        }

        const playerScore = game.state.scores[playerId].points;

        if (game.state.tieBreak) {
            if (playerScore <= 5) {
                game.state.scores[playerId].points++;
            } else if (playerScore > game.state.scores[1 - playerId].points) {
                game.state.scores[playerId].sets++;
                game.state.scores[0].points = 0;
                game.state.scores[1].points = 0;
                game.state.tieBreak = false;

                const scoreIndex = game.state.scores.findIndex((score: Score) => score.sets === game.config.sets);
                if (scoreIndex !== -1) {
                    game.state.winner = scoreIndex;
                }else{
                    game.state.currentSet++;
                    game.state.scores[0].games.push(playerId);
                    game.state.scores[1].games.push(playerId);
                }
            }
        }
        else {
            game.state.scores[playerId].points++;
        }

        await gameCollection.updateOne({ _id: new ObjectId(gameId) }, { $set: { state: game.state } });

        res.status(200).json(game);
    }
}