import { Router } from "express";
import { CommunityController } from "./CommunityController";

const router = Router();
const controller = new CommunityController();

// 1. 일반 유저용 주소들
router.post("/posts", controller.createPost); // 게시글 작성
router.get("/posts", controller.getPosts); // 게시글 목록 조회 (페이징)
router.get("/posts/:id", controller.getPostDetail); // 게시글 상세 조회 (조회수 중복 방지)
router.post("/replies", controller.createReply); // 댓글 작성

// 2. [어드민 기능] 가이드라인 위반 게시글 숨김/삭제 주소
router.patch("/admin/posts/:id/hide", controller.hidePost);

export default router;
