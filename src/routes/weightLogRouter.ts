import { Router } from "express";
import weightLogController from "../controller/weightLogController.ts";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import {
    createWeightLogSchema,
    updateWeightLogSchema,
    getWeightLogSchema,
    getWeightLogStatsSchema,
} from "../schemas/weightLog/weightLogSchema.ts";

const router = Router();

router.post(
    "/",
    authenticate,
    validate(createWeightLogSchema),
    weightLogController.createWeightLog,
);

router.get("/pet/:petId", authenticate, weightLogController.getWeightLogsByPetId);

router.get(
    "/:id",
    authenticate,
    validate(getWeightLogSchema),
    weightLogController.getWeightRecordById,
);

router.put(
    "/:id",
    authenticate,
    validate(updateWeightLogSchema),
    weightLogController.updateWeightLog,
);

router.delete(
    "/:id",
    authenticate,
    weightLogController.deleteWeightLog,
);

router.get(
    "/pet/:petId/stats",
    authenticate,
    validate(getWeightLogStatsSchema),
    weightLogController.getWeightLogStats
);

export default router;
