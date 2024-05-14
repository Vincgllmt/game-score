import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { playerCollection } from "./player.collection";
import { ObjectId } from "mongodb";

export class PlayerController {
    static async getAllPlayers(req: Request, res: Response) {
        const validator = validationResult(req);

        if (!validator.isEmpty()) {
            res.status(400).send({ error: 'Invalid input' });
            return;
        }

        const queryLastName = req.query.lastName;
        const queryTour = req.query.tour;
        const queryCountry = req.query.country;

        const players = await playerCollection.aggregate([
            {
            $match: {
                $and: [
                queryLastName ? { lastName: { $regex: queryLastName, $options: 'i' } } : {},
                queryTour ? { tour: queryTour } : {},
                queryCountry ? { country: { $regex: queryCountry, $options: 'i' } } : {}
                ]
            }
            }
        ]).toArray();

        res.send(players);

    }

    static async getPlayerById(req: Request, res: Response) {
        const validator = validationResult(req);

        if (!validator.isEmpty()) {
            res.status(400).send({ error: 'Invalid input' });
            return;
        }

        const playerId = req.params.id;

        const player = await playerCollection.findOne({ _id: new ObjectId(playerId) });

        if (!player) {
            res.status(404).send({ error: 'Player not found' });
            return;
        }

        res.send(player);
    }
}