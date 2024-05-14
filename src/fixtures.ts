import 'dotenv/config';
import { createHelloData } from "./hello/hello.fixtures";
import { HelloRepository } from "./hello/hello.repository";
import { mongoClient } from './services/mongodb';
import { PlayerRepository } from './player/player.repository';
import { createPlayer } from './player/player.fixtures';

new HelloRepository()
    .populate(20, createHelloData)
    .then(() => console.log('Hello Fixtures created'))
    .catch(console.error)

new PlayerRepository()
    .populate(20, createPlayer)
    .then(() => console.log('Player Fixtures created'))