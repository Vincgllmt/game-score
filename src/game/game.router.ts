import { Router } from "express";
import { GameController } from "./game.controller";
import { body, param, query } from "express-validator";
import expressAsyncHandler from "express-async-handler";
import { gameRepository } from "./game.repository";

const router = Router();
const gameController = new GameController(gameRepository);

router.get('/api/game',
    query('tour').optional().isString().isIn(['ATP', 'WTA']),
    query('state').optional().isString().isIn(['ongoing', "completed"]),
    query('lastName').optional().isString(),
    expressAsyncHandler(gameController.getAllGame.bind(gameController)));
router.get('/api/game/:id',
    param('id').isString().isMongoId(),
    expressAsyncHandler(gameController.read.bind(gameController)));
router.post('/api/game/new',
    body('config.tour').isString().isIn(['ATP', 'WTA']),
    body('players.id1').isString(),
    body('players.id2').isString(),
    body('config.sets').isInt({ min:1 }),
expressAsyncHandler(gameController.createGame.bind(gameController)));

router.patch('/api/game/:id/point/:player',
    param('id').isString().isMongoId(),
    param('player').isInt({ min:0, max:1 }),
    expressAsyncHandler(gameController.patchPointToPlayer.bind(gameController)));

export default router;