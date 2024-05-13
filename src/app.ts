import express, { Request, Response, NextFunction } from 'express';

export const app = express();

app.get('/api/hello/world', (req: Request, res: Response, next: NextFunction) => {
    res.send(JSON.stringify({ message: 'Hello, world!' }));
});