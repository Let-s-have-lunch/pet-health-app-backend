import { Router } from "express";
import { WalkLogController } from "../controller/walkLogController";
import { authMiddleware } from "../middlewares/authmiddleware";

const router = Router();
const controller = new WalkLogController();

// 산책 기록 작성 (로그인 필수)
router.post("/", authMiddleware, controller.create);

// 내 산책 기록 조회 (로그인 필수)
router.get("/my", authMiddleware, controller.getMyLogs);

export default router;
