import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { playerCollection } from "./player.collection";

export class PlayerController {
    static async getAllPlayers(req : Request, res : Response) {
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
                        queryLastName ? { lastName: queryLastName } : {},
                        queryTour ? { tour: queryTour } : {},
                        queryCountry ? { country: queryCountry } : {}
                    ]
                }
            }
        ]).toArray();

        res.send(players);
        
    }
}