import { Router } from "express";
import { HelloController } from "./hello.controller";
import { param } from "express-validator";

const router = Router();

router.get('/api/hello/world', HelloController.world);
router.get('/api/hello/square/:num', 
    param("num").isNumeric(),
    HelloController.square
);
router.get('/api/hello', HelloController.hello);
export default router;