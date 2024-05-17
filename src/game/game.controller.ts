import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { gameCollection } from "./game.collection";
import { ObjectId } from "mongodb";

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
}