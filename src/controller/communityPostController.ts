import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import communityPostService from "../service/communityPostService.ts";
import { CommunityPostInputType } from "../schemas/post/communityPostSchema.ts";

const getPostList = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const size = Math.max(1, Number(req.query.size) || 10);

        const result = await communityPostService.getPostList(page, size);

        res.status(200).json({
            message: "게시글 목록을 성공적으로 조회했습니다.",
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "게시글 목록 조회 중 서버 에러가 발생했습니다." });
    }
};

const getPostById = async (req: Request<{ postId: string }>, res: Response) => {
    try {
        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: "잘못된 게시글 ID 입니다." });
            return;
        }

        const result = await communityPostService.getPostById(postId);

        res.status(200).json({ message: "게시글을 성공적으로 조회했습니다.", data: result });
    } catch (error) {
        if (error instanceof Error && error.message === "POST_NOT_FOUND") {
            res.status(404).json({ message: "존재하지 않거나 삭제된 게시글입니다." });
            return;
        }
        console.error(error);
        res.status(500).json({ message: "게시글 조회 중 서버 에러가 발생했습니다." });
    }
};

const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content } = req.body;

        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "인증 정보가 유효하지 않습니다." });

            return;
        }

        const newPost = await communityPostService.createPost(userId, title, content);

        res.status(201).json({ message: "게시글이 작성되었습니다.", data: newPost });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "게시글 작성 중 서버 에러가 발생했습니다." });
    }
};

const updatePost = async (req: AuthRequest<{ postId: string }>, res: Response) => {
    try {
        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: "잘못된 게시글 ID 입니다." });
            return;
        }

        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "인증 정보가 유효하지 않습니다." });
            return;
        }

        const { title, content }: CommunityPostInputType = req.body;

        const updatedPost = await communityPostService.updatePost(postId, userId, title, content);
        res.status(200).json({ message: "게시글이 성공적으로 수정되었습니다.", data: updatedPost });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "POST_NOT_FOUND") {
                res.status(404).json({ message: "존재하지 않거나 삭제된 게시글입니다." });
                return;
            }
            if (error.message === "FORBIDDEN") {
                res.status(403).json({ message: "해당 게시글을 수정할 권한이 없습니다." });
                return;
            }
        }
        console.error(error);
        res.status(500).json({ message: "게시글 수정 중 서버 에러가 발생했습니다." });
    }
};

const deletePost = async (req: AuthRequest<{ postId: string }>, res: Response) => {
    try {
        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: "잘못된 게시글 ID 입니다." });
            return;
        }

        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId || !userRole) {
            res.status(401).json({ message: "인증 정보가 유효하지 않습니다." });
            return;
        }

        await communityPostService.deletePost(postId, userId, userRole);

        res.status(200).json({ message: "게시글이 성공적으로 삭제되었습니다." });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "POST_NOT_FOUND") {
                res.status(404).json({ message: "존재하지 않거나 이미 삭제된 게시글입니다." });
                return;
            }
            if (error.message === "FORBIDDEN") {
                res.status(403).json({ message: "해당 게시글을 삭제할 권한이 없습니다." });
                return;
            }
        }
        console.error(error);
        res.status(500).json({ message: "게시글 삭제 중 서버 에러가 발생했습니다." });
    }
};

export default { getPostList, getPostById, createPost, updatePost, deletePost };
