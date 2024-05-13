import { Router } from "express";
import { HelloController } from "./hello.controller";

const router = Router();

router.get('api/hello/world', HelloController.world);

export default router;