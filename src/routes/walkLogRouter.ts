import { Router } from "express";
import walkLogController from "../controller/walkLogController.ts";

const router = Router();
router.post("/", walkLogController.createWalkLog);
router.get("/:id", walkLogController.getWalkLogById);
router.put("/:id", walkLogController.updateWalkLog);
router.delete("/:id", walkLogController.deleteWalkLog);
export default router;