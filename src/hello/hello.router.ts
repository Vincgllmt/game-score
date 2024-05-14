import { Router } from "express";
import { HelloController } from "./hello.controller";
import { body, param } from "express-validator";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get('/api/hello/world', HelloController.world);
router.get('/api/hello/square/:num',
    param("num").isNumeric(),
    HelloController.square
);

router.get('/api/hello', HelloController.hello);
router.post('/api/hello',
    body("message").isString().notEmpty(),
    expressAsyncHandler(HelloController.addHello)
);
router.get('/api/hello/:id',
    param("id").notEmpty().isMongoId(),
    expressAsyncHandler(HelloController.findHello)
);
router.delete('/api/hello/:id',
    param("id").notEmpty().isMongoId(),
    expressAsyncHandler(HelloController.deleteHello)
);
export default router;