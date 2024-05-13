import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { helloCollection } from "./hello.collection";

export class HelloController {
    static world(req: Request, res: Response) {
        res.send({ message: 'Hello, world!' });
    }
    static square(req: Request, res: Response) {
        const result = validationResult(req);
        
        if (result.isEmpty()) {
            const num = parseInt(req.params.num);
            res.send({ result: num * num });
        }else {
            res.status(404).send({ error: 'Invalid input' });
        }
    }
    static async hello(req: Request, res: Response) {
        res.send(await helloCollection.find().toArray());
    }
}