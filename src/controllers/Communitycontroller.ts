// src/controller/Community.controller.ts
import { Request, Response } from "express";
import { CommunityService } from "../services/Communityservice"; // 서비스 경로 확인 필요

export default class CommunityController {
    private communityService = new CommunityService();

    // 1. 게시글 작성
    createPost = async (req: Request, res: Response) => {
        try {
            const { userId, title, content } = req.body;
            const post = await this.communityService.createPost(Number(userId), title, content);
            res.status(201).json(post);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    // 2. 게시글 목록 조회
    getPosts = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await this.communityService.getPosts(page, limit);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    // 3. 게시글 상세 보기
    getPostById = async (req: Request, res: Response) => {
        try {
            const postId = Number(req.params.id);
            const post = await this.communityService.getPostDetail(postId, true);
            res.json(post);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    // 4. 댓글 작성
    createReply = async (req: Request, res: Response) => {
        try {
            const { userId, postId, content } = req.body;
            const reply = await this.communityService.createReply(
                Number(userId),
                Number(postId),
                content,
            );
            res.status(201).json(reply);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    // 5. [어드민] 게시글 숨김 (delete 대신 hide 로직 사용)
    hidePost = async (req: Request, res: Response) => {
        try {
            const postId = Number(req.params.id);
            await this.communityService.hidePostByAdmin(postId);
            res.json({ message: "어드민 권한으로 게시글이 숨김 처리되었습니다." });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}
