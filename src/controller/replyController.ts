import { Response, Request } from "express";
import { AuthenticatedRequest } from "../middlewares/authmiddleware";
import replyService from "../service/replyService";

export class ReplyController {
    // 1. 댓글 작성 (POST /create)
    createReply = async (req: AuthenticatedRequest, res: Response) => {
        try {

            if (!req.user) {
                return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            }
            const userId = req.user.id;
            const { postId, content } = req.body;

            const result = await replyService.createReply(Number(userId), Number(postId), content);

            // 💡 성공 메시지와 데이터 배달
            return res.status(201).json({
                message: "댓글이 성공적으로 작성되었습니다.",
                data: result,
            });
        } catch (error: any) {
            // 💡 서비스 파일에서 던진 에러 메시지(`NOT_FOUND`) 처리
            if (error.message === "NOT_FOUND") {
                return res.status(404).json({ message: "존재하지 않거나 삭제된 게시물입니다." });
            }
            console.error(error);
            return res.status(500).json({ message: "댓글 등록 중 서버 오류가 발생되었습니다." });
        }
    };

    // 2. 댓글 조회 (GET /:postId)
    getRepliesByPost = async (req: Request<{ postId: string }>, res: Response) => {
        try {
            const postId = Number(req.params.postId);


            if (isNaN(postId)) {
                return res.status(400).json({ message: "유효하지 않은 게시물 ID 입니다." });
            }

            const page = Number(req.query.page) || 1;
            const size = Number(req.query.size) || 10;

            const result = await replyService.getRepliesByPostId(postId, page, size);

            return res.status(200).json({
                message: "댓글 목록을 성공적으로 불러왔습니다.",
                data: result,
            });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ message: "댓글 목록을 불러오는 중에 오류가 발생했습니다." });
        }
    };

    // 3. 댓글 수정 (PATCH /:replyId)
    update = async (req: AuthenticatedRequest & Request<{ replyId: string }>, res: Response) => {
        try {
            // 💡 라우터와 맞춘 변수 이름 :replyId 적용!
            const id = Number(req.params.replyId);
            if (isNaN(id)) {
                return res.status(400).json({ message: "유효하지 않은 댓글 ID 입니다." });
            }

            if (!req.user) {
                return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            }
            const userId = req.user.id;
            const { content } = req.body;

            const result = await replyService.updateReply(id, userId, content);

            return res.status(200).json({
                message: "댓글이 성공적으로 수정되었습니다.",
                data: result,
            });
        } catch (error: any) {
            if (error.message === "NOT_FOUND_REPLY") {
                return res.status(404).json({ message: "존재하지 않는 댓글입니다." });
            }
            if (error.message === "FORBIDDEN") {
                return res.status(403).json({ message: "댓글 수정 권한이 없습니다." });
            }
            console.error(error);
            return res.status(500).json({ message: "댓글 수정 중 서버 오류가 발생되었습니다." });
        }
    };

    // 4. 댓글 삭제 (DELETE /:replyId)
    delete = async (req: AuthenticatedRequest & Request<{ replyId: string }>, res: Response) => {
        try {
            const id = Number(req.params.replyId);
            if (isNaN(id)) {
                return res.status(400).json({ message: "유효하지 않은 댓글 ID 입니다." });
            }

            if (!req.user) {
                return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            }
            const userId = req.user.id;

            await replyService.deleteReply(id, userId);

            return res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
        } catch (error: any) {
            if (error.message === "NOT_FOUND_REPLY") {
                return res.status(404).json({ message: "존재하지 않는 댓글입니다." });
            }
            if (error.message === "FORBIDDEN") {
                return res.status(403).json({ message: "댓글 삭제 권한이 없습니다." });
            }
            console.error(error);
            return res.status(500).json({ message: "댓글 삭제 중 서버 오류가 발생되었습니다." });
        }
    };
}
