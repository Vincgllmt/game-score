import { Request, Response } from "express";

export class HelloController {
    static world(req: Request, res: Response) {
        res.send(JSON.stringify({ message: 'Hello, world!' }));
    }
}