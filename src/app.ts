import express from 'express';
import helloRouter  from './hello/hello.router';
import playerRouter from './player/player.router';

const app = express();

app.use(express.json());

app.use("/", helloRouter)
app.use("/", playerRouter);

export {app};