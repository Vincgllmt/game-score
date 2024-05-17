import { Router } from "express";
import { GameController } from "./game.controller";
import { body, param, query } from "express-validator";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get('/api/game',
    query('tour').optional().isString().isIn(['ATP', 'WTA']),
    query('state').optional().isString().isIn(['ongoing', "completed"]),
    query('lastName').optional().isString(),
    expressAsyncHandler(GameController.getAllGame));

export default router;