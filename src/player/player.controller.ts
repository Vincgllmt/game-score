import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { playerCollection } from "./player.collection";
import { Controller } from "../base/controller";
import { Player } from "./player";

export class PlayerController extends Controller<Player> {
    public async getAllPlayers(req: Request, res: Response) {
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
}