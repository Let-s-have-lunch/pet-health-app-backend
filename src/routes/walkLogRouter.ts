import { Router } from "express";

const router = Router();

router.post("/", walkLogController.createWalkLog);

export default router;
