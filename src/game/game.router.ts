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
router.get('/api/game/:id',
    param('id').isString().isMongoId(),
    expressAsyncHandler(GameController.getGameById));
router.post('/api/game/new',
    body('config.tour').isString().isIn(['ATP', 'WTA']),
    body('players.id1').isString(),
    body('players.id2').isString(),
    body('config.sets').isInt({ min:1 }),
expressAsyncHandler(GameController.createGame));

router.patch('/api/game/:id/point/:player',
    param('id').isString().isMongoId(),
    param('player').isInt({ min:0, max:1 }),
    expressAsyncHandler(GameController.patchPointToPlayer));

export default router;