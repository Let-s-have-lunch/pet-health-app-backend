import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import {
    createWaterLogSchema,
    updateWaterLogSchema,
    getWaterLogSchema,
    getWaterLogStatsSchema,
} from "../schemas/waterLog/waterLogSchema.ts";
import waterLogController from "../controller/waterLogController.ts";

const router = Router();

router.post(
    "/",
    authenticate,
    validate(createWaterLogSchema),
    waterLogController.createWaterLog,
);

router.get("/pet/:petId", authenticate, waterLogController.getWaterLogsByPetId);

router.get(
    "/pet/:petId/stats",
    authenticate,
    validate(getWaterLogStatsSchema),
    waterLogController.getWaterLogStats
);


router.get(
    "/:id",
    authenticate,
    validate(getWaterLogSchema),
    waterLogController.getWaterLogById,
);

router.put(
    "/:id",
    authenticate,
    validate(updateWaterLogSchema),
    waterLogController.updateWaterLog,
);

router.delete(
    "/:id",
    authenticate,
    waterLogController.deleteWaterLog,
);

export default router;
