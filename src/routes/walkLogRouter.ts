import { Router } from "express";
import walkLogController from "../controller/walkLogController.ts";
import { authenticate } from "../middlewares/auth.ts";
import { createWalkLogSchema } from "../schemas/user/walkLog/createWalkLogSchema.ts";
import { validate } from "../middlewares/validate.ts";
import { updateWalkLogSchema } from "../schemas/user/walkLog/updateWalkLogSchema.ts";
import { getWaterLogStatsSchema } from "../schemas/user/waterLogSchema.ts";
import waterLogController from "../controller/waterLogController.ts";

const router = Router();

/*
  1. 산책 일지 생성 (POST /)
  - 로그인 인증 필요 (authenticate)
  - 바디 데이터 검증 필요 (validate)
 */
router.post("/", authenticate, validate(createWalkLogSchema), walkLogController.createWalkLog);

/*
  2. 특정 산책 일지 상세 조회 (GET /:id)
  - 로그인 인증 필요 (authenticate)
 */
router.get("/:id", authenticate, walkLogController.getWalkLogById);

/*
  3. 산책 일지 수정 (PUT /:id)
  - 로그인 인증 필요 (authenticate)
  - 수정할 데이터 검증 필요 (validate)
 */
router.put("/:id", authenticate, validate(updateWalkLogSchema), walkLogController.updateWalkLog);

/*
  4. 산책 일지 삭제 (DELETE /:id)
  - 로그인 인증 필요 (authenticate)
 */
router.delete("/:id", authenticate, walkLogController.deleteWalkLog);

export default router;
