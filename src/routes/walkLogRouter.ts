import { Router } from "express";
import walkLogController from "../controllers/walkLogController.ts";

const router = Router();

router.post("/", walkLogController.createWalkLog);

export default router;
