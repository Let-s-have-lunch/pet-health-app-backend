import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import {
    createWaterLogSchema,
    updateWaterLogSchema,
    getWaterLogSchema,
    deleteWaterLogSchema,
    getWaterLogStatsSchema,
} from "../schemas/user/waterLogSchema.ts";
import waterLogController from "../controller/waterLogController.ts";

const router = Router();

// 1. 음수량 기록 생성
router.post(
    "/",
    authenticate,
    validate(createWaterLogSchema), //[cite: 1]
    waterLogController.createWaterLog,
);

// 2. 특정 반려동물의 전체 음수량 기록 조회
router.get("/pet/:petId", authenticate, waterLogController.getWaterLogsByPetId);

// 통계 조회 API (예: /water-logs/pet/1/stats?period=daily&baseDate=2026-07-03)
router.get(
    "/pet/:petId/stats",
    authenticate,
    validate(getWaterLogStatsSchema), //
    waterLogController.getWaterLogStats
);


// 3. 특정 음수량 기록 상세 조회
router.get(
    "/:id",
    authenticate,
    validate(getWaterLogSchema), //[cite: 3]
    waterLogController.getWaterLogById,
);

// 4. 음수량 기록 수정
router.put(
    "/:id",
    authenticate,
    validate(updateWaterLogSchema), //[cite: 4]
    waterLogController.updateWaterLog,
);

// 5. 음수량 기록 삭제
router.delete(
    "/:id",
    authenticate,
    validate(deleteWaterLogSchema), //[cite: 2]
    waterLogController.deleteWaterLog,
);

export default router;
