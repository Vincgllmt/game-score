import { Request, Response, Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { playerCollection } from "./player.collection";
import { Controller } from "../base/controller";
import { Player } from "./player";
import expressAsyncHandler from "express-async-handler";

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

    public newRouter() {
        const router = Router();

        router.get('/api/player',
            query('lastName').optional().isString().notEmpty(),
            query('tour').optional().isString().notEmpty().isIn(['ATP', 'WTA']),
            query('country').optional().isString().notEmpty(),
            expressAsyncHandler(this.getAllPlayers));

        router.get('/api/player/:id',
            param('id').isString().notEmpty().isMongoId(),
            expressAsyncHandler(this.read.bind(this)));

        router.post('/api/player',
            body('firstName').isString().notEmpty(),
            body('lastName').isString().notEmpty(),
            body('country').isString().notEmpty(),
            body('tour').isString().notEmpty().isIn(['ATP', 'WTA']),
            expressAsyncHandler(this.create.bind(this)));
        router.delete('/api/player/:id',
            param('id').isString().notEmpty().isMongoId(),
            expressAsyncHandler(this.delete.bind(this)));
        
        return router;
    }
}