import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { helloCollection } from "./hello.collection";
import { helloRepository } from "./hello.repository";

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

    static async addHello(req: Request, res: Response) {
        const result = validationResult(req);
        
        if (result.isEmpty()) {
            const data = req.body;
            await helloRepository.insert(data);
            res.status(201).send(data);
        }else {
            res.status(400).send({ error: 'Invalid input' });
        }
    }
}