import { Router } from "express";
import * as walkLogController from "../controllers/walk-log.controller.ts";

const router = Router();

router.post("/", walkLogController.createWalkLog);

export default router;
