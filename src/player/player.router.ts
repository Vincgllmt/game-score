import { Router } from "express";
import { PlayerController } from "./player.controller";
import { body, param, query } from "express-validator";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get('/api/player',
    query('lastName').optional().isString().notEmpty(),
    query('tour').optional().isString().notEmpty().isIn(['ATP', 'WTA']),
    query('country').optional().isString().notEmpty(),
    expressAsyncHandler(PlayerController.getAllPlayers));

router.get('/api/player/:id',
    param('id').isString().notEmpty().isMongoId(),
    expressAsyncHandler(PlayerController.getPlayerById));

router.post('/api/player',
    body('firstName').isString().notEmpty(),
    body('lastName').isString().notEmpty(),
    body('country').isString().notEmpty(),
    body('tour').isString().notEmpty().isIn(['ATP', 'WTA']),
    expressAsyncHandler(PlayerController.createPlayer));

export default router;