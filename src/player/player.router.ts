import { Router } from "express";
import { PlayerController } from "./player.controller";
import { query } from "express-validator";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get('/api/player',
    query('lastName').optional().isString().notEmpty(),
    query('tour').optional().isString().notEmpty().isIn(['ATP', 'WTA']),
    query('country').optional().isString().notEmpty(),
    PlayerController.getAllPlayers);
export default router;