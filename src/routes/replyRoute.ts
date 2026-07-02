import { Router } from "express";
import { ReplyController } from "../controller/replyController";
import { authMiddleware } from "../middlewares/authmiddleware"; // 🔐 인증 미들웨어 추가!

const router = Router();
const controller = new ReplyController();

// 1. 특정 게시글에 댓글 작성 (로그인 필수)
router.post("/", authMiddleware, controller.create);

// 2. 특정 게시글의 모든 댓글 조회 (누구나 가능)
router.get("/posts/:postId", controller.getRepliesByPost);

// 3. 댓글 수정 (로그인 필수)
router.patch("/:id", authMiddleware, controller.update);

// 4. 댓글 삭제 (로그인 필수)
router.delete("/:id", authMiddleware, controller.delete);

export default router;
