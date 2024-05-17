import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { gameCollection } from "./game.collection";

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
                ]
            }
            }
        ]).toArray();

        res.send(players);

    }
}