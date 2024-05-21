import 'dotenv/config';
import { createHelloData } from "./hello/hello.fixtures";
import { createPlayer } from './player/player.fixtures';
import { helloRepository } from './hello/hello.repository';
import { playerRepository } from './player/player.repository';

helloRepository
    .populate(20, createHelloData)
    .then(() => console.log('Hello Fixtures created'))
    .catch(console.error)

playerRepository
    .populate(20, createPlayer)
    .then(() => console.log('Player Fixtures created'))