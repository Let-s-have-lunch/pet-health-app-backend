import { Router } from "express";
import weightLogController from "../controller/weightLogController.ts";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import {
    createWeightLogSchema,
    updateWeightLogSchema,
    getWeightLogSchema,
    deleteWeightLogSchema,
    getWeightLogStatsSchema,
} from "../schemas/user/weightLogSchema.ts";

const router = Router();

// 1. 몸무게 기록 생성
router.post(
    "/",
    authenticate,
    validate(createWeightLogSchema), // 👈 생성 검증 스키마
    weightLogController.createWeightLog,
);

// 2. 특정 반려동물의 전체 몸무게 기록 조회
router.get("/pet/:petId", authenticate, weightLogController.getWeightLogsByPetId);

// 3. 특정 몸무게 기록 상세 조회
router.get(
    "/:id",
    authenticate,
    validate(getWeightLogSchema), //  ID 숫자 검증 안전장치[cite: 3]
    weightLogController.getWeightRecordById,
);

// 4. 몸무게 기록 수정
router.put(
    "/:id",
    authenticate,
    validate(updateWeightLogSchema), //  수정 검증 스키마
    weightLogController.updateWeightLog,
);

// 5. 몸무게 기록 삭제
router.delete(
    "/:id",
    authenticate,
    validate(deleteWeightLogSchema), // 삭제 안전장치 스키마
    weightLogController.deleteWeightLog,
);

// 몸무게 통계 조회 API
router.get(
    "/pet/:petId/stats",
    authenticate,
    validate(getWeightLogStatsSchema),
    weightLogController.getWeightLogStats //  컨트롤러 연결
);

export default router;
