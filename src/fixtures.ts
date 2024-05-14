import 'dotenv/config';
import { createHelloData } from "./hello/hello.fixtures";
import { HelloRepository } from "./hello/hello.repository";
import { mongoClient } from './services/mongodb';

new HelloRepository()
    .populate(20, createHelloData)
    .then(() => console.log('Fixtures created'))
    .catch(console.error)
    .finally(() => mongoClient.close());