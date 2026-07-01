import { Router, Request, Response } from "express";
import { Communityservice } from "../services/Communityservice.ts";

const router = Router();
const communityService = new Communityservice();

// 게시글 작성 통로
router.post("/posts", async (req: Request, res: Response) => {
    try {
        const { userId, title, content } = req.body;
        const post = await communityService.createPost(Number(userId), title, content);
        res.status(201).json(post);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// 게시글 목록 조회 통로 (페이징 query 처리)
router.get("/posts", async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await communityService.getPosts(page, limit);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// 게시글 상세 보기 통로
router.get("/posts/:id", async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.id);
        const post = await communityService.getPostById(postId);
        res.json(post);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// 댓글 작성 통로
router.post("/replies", async (req: Request, res: Response) => {
    try {
        const { userId, postId, content } = req.body;
        const reply = await communityService.createReply(Number(userId), Number(postId), content);
        res.status(201).json(reply);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// [어드민] 게시글 숨김 통로
router.delete("/admin/posts/:id", async (req: Request, res: Response) => {
    try {
        const postId = Number(req.params.id);
        await communityService.adminDeletePost(postId);
        res.json({ message: "어드민 권한으로 처리되었습니다." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default Router;
