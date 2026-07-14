import { Router } from "express";
import vetRecordController from "../controller/vetRecordController.ts";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import {
    getVetRecordSchema,
    UpdateVetRecordSchema,
    CreateVetRecordSchema,
} from "../schemas/user/vetRecordSchema.ts";
import { upload } from "../middlewares/multer.ts";
const router = Router();

// 1. 병원 기록 생성
router.post(
    "/",
    authenticate,
    upload.single("image"),
    validate(CreateVetRecordSchema),
    vetRecordController.createVetRecord,
);

// 2. 특정 반려동물의 전체 병원 기록 조회
// (URL 파라미터 :petId에 대한 별도 스키마가 없다면 인증 미들웨어만 유지합니다)
router.get("/pet/:petId", authenticate, vetRecordController.getVetRecordsByPetId);

// 3. 특정 병원 기록 상세 조회
router.get(
    "/:id",
    authenticate,
    validate(getVetRecordSchema), // 👈 ID 검증 스키마 적용[cite: 3]
    vetRecordController.getVetRecordById,
);

// 4. 병원 기록 수정
router.put(
    "/:id",
    authenticate,
    upload.single("image"),
    validate(UpdateVetRecordSchema),
    vetRecordController.updateVetRecord,
);

// 5. 병원 기록 삭제
router.delete(
    "/:id",
    authenticate,
    vetRecordController.deleteVetRecord,
);

export default router;
