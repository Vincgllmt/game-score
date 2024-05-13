import { Router } from "express";
import { HelloController } from "./hello.controller";

const router = Router();

router.get('/api/hello/world', HelloController.world);
router.get('/api/hello/square/:num', HelloController.square);

export default router;