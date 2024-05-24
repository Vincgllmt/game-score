import { Request, Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { HelloData } from "./hello";
import { Controller } from "../base/controller";
import expressAsyncHandler from "express-async-handler";

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
    public newRouter() {
        const router = super.newRouter();
        router.get('/api/hello/world', this.world.bind(this));
        router.get('/api/hello/square/:num',
            param("num").isNumeric(),
            this.square.bind(this)
        );
        
        router.get('/api/hello', this.readAll.bind(this));
        router.post('/api/hello',
            body("message").isString().notEmpty(),
            expressAsyncHandler(this.create.bind(this))
        );
        router.get('/api/hello/:id',
            param("id").notEmpty().isMongoId(),
            expressAsyncHandler(this.read.bind(this))
        );
        router.delete('/api/hello/:id',
            param("id").notEmpty().isMongoId(),
            expressAsyncHandler(this.delete.bind(this))
        );

        return router;
    }
}