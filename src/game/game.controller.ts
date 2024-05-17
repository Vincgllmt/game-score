import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";
import { gameRepository } from "./game.repository";

export class GameController {
    static async getAllGame(req: Request, res: Response) {
        res.send(await gameRepository.findAll());

    }
}