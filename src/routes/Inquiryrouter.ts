// src/routes/Inquiry.route.ts
import { Router } from "express";
import { InquiryController } from "../controller/Inquiry.controller"; // 📂 올바른 경로로 지정
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware"; // 🔐 문지기 미들웨어 가져오기

const router = Router();
const controller = new InquiryController();

/**
 * 1. 일반 유저: 1:1 문의 등록
 * @route   POST /api/inquiries
 * @access  Private (로그인 유저 전용)
 */
router.post(
    "/",
    authMiddleware, // 🔐 로그인했는지 먼저 검사!
    controller.create,
);

/**
 * 2. 일반 유저: 본인 문의 내역 조회
 * @route   GET /api/inquiries/my
 * @access  Private (로그인 유저 전용, 컨트롤러에서 토큰 기반으로 내 ID 자동 추출)
 */
router.get(
    "/my",
    authMiddleware, // 🔐 본인 확인을 위해 검사!
    controller.getMyInquiries,
);

/**
 * 3. 🛠️ [어드민 기능]: 1:1 문의 답변하기
 * @route   PATCH /api/inquiries/:id/answer
 * @access  Admin Only (어드민 전용)
 */
router.patch(
    "/:id/answer",
    authMiddleware, // 1단계: 로그인했는가?
    adminMiddleware, // 2단계: 그 로그인이 '어드민' 계정인가? (이중 잠금 🔐)
    controller.submitAnswer,
);

export default router;
