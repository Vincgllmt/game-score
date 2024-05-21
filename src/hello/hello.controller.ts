import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { helloCollection } from "./hello.collection";
import { helloRepository } from "./hello.repository";
import { ObjectId } from "mongodb";
import { Repository } from "../base/repository";
import { HelloData } from "./hello";
import { Controller } from "../base/controller";

export class HelloController extends Controller<HelloData> {

    public world(req: Request, res: Response) {
        res.send({ message: 'Hello, world!' });
    }
    public square(req: Request, res: Response) {
        const result = validationResult(req);

        if (result.isEmpty()) {
            const num = parseInt(req.params.num);
            res.send({ result: num * num });
        } else {
            res.status(404).send({ error: 'Invalid input' });
        }
    }
}