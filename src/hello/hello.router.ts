import { Router } from "express";
import { HelloController } from "./hello.controller";
import { body, param } from "express-validator";
import expressAsyncHandler from "express-async-handler";
import { helloRepository } from "./hello.repository";

const router = Router();
const helloController = new HelloController(helloRepository);

router.get('/api/hello/world', helloController.world);
router.get('/api/hello/square/:num',
    param("num").isNumeric(),
    helloController.square
);

router.get('/api/hello', helloController.readAll.bind(helloController));
router.post('/api/hello',
    body("message").isString().notEmpty(),
    expressAsyncHandler(helloController.create.bind(helloController))
);
router.get('/api/hello/:id',
    param("id").notEmpty().isMongoId(),
    expressAsyncHandler(helloController.read.bind(helloController))
);
router.delete('/api/hello/:id',
    param("id").notEmpty().isMongoId(),
    expressAsyncHandler(helloController.delete.bind(helloController))
);
export default router;