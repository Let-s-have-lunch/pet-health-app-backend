import { Router } from "express";
import * as walkLogController from "../controllers/walkLogController";
import { walkLogSchema } from "../schemas/walkLog/walkLogSchema.ts";
import { validate } from "../middlewares/validate.ts";
import { authenticate } from "../middlewares/auth.ts";

const router = Router();

router.use(authenticate);

router.post("/create/:petId", validate(walkLogSchema),walkLogController.createWalkLog);

router.put("/:walkLogId",validate(walkLogSchema), walkLogController.updateWalkLog);

router.get("/:petId", walkLogController.getWalkLogs);

router.delete("/:walkLogId", walkLogController.deleteWalkLog);

router.get("/:petId/stats", walkLogController.getWalkLogStats);

export default router;
