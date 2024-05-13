import express from 'express';
import  helloRouter  from './hello/hello.router';

const app = express();

app.use("/", helloRouter)

export {app};