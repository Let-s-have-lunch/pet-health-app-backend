// src/routes/Community.route.ts
import { Router } from "express";
import { CommunityController } from "../controller/Community.controller"; // 📂 올바른 경로 체크
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware"; // 🔐 문지기들 소환

const router = Router();
const controller = new CommunityController();

/**
 * ==========================================
 * 1. 일반 유저용 커뮤니티 주소 목록
 * ==========================================
 */

// 📝 게시글 작성 (로그인 필수)
router.post("/posts", authMiddleware, controller.createPost);

// 📋 게시글 목록 조회 (전체 공개, 페이징 포함)
router.get("/posts", controller.getPosts);

// 🔍 게시글 상세 조회 (전체 공개, 조회수 중복 방지 로직 포함)
router.get("/posts/:id", controller.getPostDetail);

// 💬 댓글 작성 (로그인 필수)
router.post("/replies", authMiddleware, controller.createReply);

/**
 * ==========================================
 * 2. 🛠️ [어드민 전용] 가이드라인 위반 관리 주소 목록
 * ==========================================
 */

// 🚫 위반 게시글 숨김 처리 (이중 잠금 🔐)
router.patch("/admin/posts/:id/hide", authMiddleware, adminMiddleware, controller.hidePost);

// 🚫 위반 댓글 숨김 처리 (💡 과제 요구사항 누락 보완!)
router.patch("/admin/replies/:id/hide", authMiddleware, adminMiddleware, controller.hideReply);

export default router;
