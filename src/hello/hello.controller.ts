import { Request, Response } from "express";

export class HelloController {
    static world(req: Request, res: Response) {
        res.send({ message: 'Hello, world!' });
    }
    static square(req: Request, res: Response) {
        const num = parseInt(req.params.num);
        res.send({ result: num * num });
    }
}