import { Router } from "express";
import { ReplyController } from "../controller/replyController";
import { authMiddleware } from "../middlewares/authmiddleware.ts";

// 💡 강사님처럼 '문지기(검증)' 재료들을 가져옵니다. (경로만 본인 프로젝트에 맞게 확인하세요!)
import { validate } from "../middlewares/validate.ts";
import { createReplySchema } from "../schemas/reply/createReplySchema.ts";
import { updateReplySchema } from "../schemas/reply/updateReplySchema.ts";

const router = Router();
const controller = new ReplyController();

// 1. 댓글 조회
router.get("/:postId", controller.getRepliesByPost);

// 2. 댓글 작성
router.post("/create", authMiddleware, validate(createReplySchema), controller.createReply);

// 3. 댓글 수정
router.patch("/:replyId", authMiddleware, validate(updateReplySchema), controller.update);

// 4. 댓글 삭제
router.delete("/:replyId", authMiddleware, controller.delete);

export default router;
