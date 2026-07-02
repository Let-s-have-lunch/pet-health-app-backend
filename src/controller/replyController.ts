import { Request, Response } from "express";
import { AuthenticatedRequest} from "../middlewares/authmiddleware.ts";
import { ReplyService } from "../service/replyService";

export class ReplyController {
    private replyService = new ReplyService();

    // 1. 댓글 작성 (기존)
    create = async (req: Request, res: Response) => {
        try {
            const { postId, content } = req.body;
            const userId = (req as AuthenticatedRequest).user?.id; // 미들웨어에서 넣은 ID
            // 내용 없는지 체크하는 안전장치
            if (!userId) {
                return res.status(401).json({ message: "로그인이 필요합니다." });
            }

            const reply = await this.replyService.createReply(userId, postId, content);
            res.status(201).json(reply);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    // 2. [추가] 특정 게시글의 댓글 목록 조회
    getRepliesByPost = async (req: Request, res: Response) => {
        try {
            const { postId } = req.params;
            const replies = await this.replyService.getRepliesByPost(Number(postId));
            res.json(replies);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    // 3. 댓글 수정 (수정 완료!)
    update = async (req: AuthenticatedRequest, res: Response) => {
        // Request를 AuthenticatedRequest로 변경
        try {
            const { id } = req.params;
            const { content } = req.body;
            const userId = req.user!.id; // 토큰에서 가져온 작성자 ID

            // userId를 인자로 추가 전달
            const reply = await this.replyService.updateReply(Number(id), userId, content);
            res.json(reply);
        } catch (error: any) {
            // 본인 확인 실패 시 403(권한 없음) 에러 전달
            res.status(403).json({ message: error.message });
        }
    };

    // 4. 댓글 삭제 (수정 완료!)
    delete = async (req: AuthenticatedRequest, res: Response) => {
        // Request를 AuthenticatedRequest로 변경
        try {
            const { id } = req.params;
            const userId = req.user!.id; // 토큰에서 가져온 작성자 ID

            // userId를 인자로 추가 전달
            await this.replyService.deleteReply(Number(id), userId);
            res.json({ message: "댓글이 삭제되었습니다." });
        } catch (error: any) {
            // 본인 확인 실패 시 403(권한 없음) 에러 전달
            res.status(403).json({ message: error.message });
        }
    };
}
