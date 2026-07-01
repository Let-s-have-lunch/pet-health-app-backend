import { Router } from "express";
import { InquiryController } from "./Inquiry.controller";

const router = Router();
const controller = new InquiryController();

// 일반 유저: 1:1 문의 등록
router.post("/", controller.create);

// 일반 유저: 본인 문의 내역 조회
router.get("/my/:userId", controller.getMyInquiries);

// 🛠️ [어드민 기능]: 1:1 문의 답변하기
router.patch("/:id/answer", controller.submitAnswer);

export default router;
