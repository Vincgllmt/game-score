import express from 'express';
import { Request, Response, NextFunction } from 'express';
import helloRouter  from './hello/hello.router';
import playerRouter from './player/player.router';
import gameRouter from './game/game.router';
const app = express();

app.use(express.json());

app.use("/", helloRouter)
app.use("/", playerRouter);
app.use("/", gameRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("ERREUR :", err);
    res.status(500).send({ error: 'Something went wrong!' });
});

export {app};