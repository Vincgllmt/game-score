import { Router } from "express";
import { PlayerController } from "./player.controller";
import { body, param, query } from "express-validator";
import expressAsyncHandler from "express-async-handler";
import { playerRepository } from "./player.repository";

const router = Router();
const playerController = new PlayerController(playerRepository);

router.get('/api/player',
    query('lastName').optional().isString().notEmpty(),
    query('tour').optional().isString().notEmpty().isIn(['ATP', 'WTA']),
    query('country').optional().isString().notEmpty(),
    expressAsyncHandler(playerController.getAllPlayers.bind(playerController)));

router.get('/api/player/:id',
    param('id').isString().notEmpty().isMongoId(),
    expressAsyncHandler(playerController.read.bind(playerController)));

router.post('/api/player',
    body('firstName').isString().notEmpty(),
    body('lastName').isString().notEmpty(),
    body('country').isString().notEmpty(),
    body('tour').isString().notEmpty().isIn(['ATP', 'WTA']),
    expressAsyncHandler(playerController.create.bind(playerController)));
router.delete('/api/player/:id',
    param('id').isString().notEmpty().isMongoId(),
    expressAsyncHandler(playerController.delete.bind(playerController)));
export default router;