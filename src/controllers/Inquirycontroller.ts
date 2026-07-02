// src/controller/Inquiry.controller.ts
import { Request, Response } from "express";
import { InquiryService } from "./Inquiry.service";

// 미들웨어에서 확장할 AuthenticatedRequest 타입 정의 (필요시 사용)
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        role: 'USER' | 'ADMIN';
    };
}

export class InquiryController {
    private inquiryService = new InquiryService();

    // 1. 문의 등록 제어
    create = async (req: AuthenticatedRequest, res: Response) => {
        try {
            // 💡 보안 보완: req.body가 아닌 로그인 정보(미들웨어)에서 userId를 꺼내옵니다.
            // 만약 미들웨어 붙이기 전 테스트 단계라면: const userId = Number(req.body.userId); 로 유지하셔도 됩니다.
            const userId = req.user?.id || Number(req.body.userId);
            const { title, content } = req.body;

            if (!title || !content) {
                return res.status(400).json({ success: false, message: "제목과 내용을 입력해주세요." });
            }

            // 💡 비동기 처리(await) 반영
            const result = await this.inquiryService.createInquiry(Number(userId), title, content);
            return res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: "문의 등록 중 오류가 발생했습니다." });
        }
    };

    // 2. 내 문의 내역 조회 제어
    getMyInquiries = async (req: AuthenticatedRequest, res: Response) => {
        try {
            // 💡 보안 보완: 내 문의는 주소창(params)이 아니라 본인 토큰 정보에서 추출하는 것이 안전합니다.
            const userId = req.user?.id || Number(req.params.userId);

            // 💡 가산점: 쿼리 스트링에서 페이징 인자(page, limit) 미리 파싱해두기
            const limit = parseInt(req.query.limit as string) || 10;
            const page = parseInt(req.query.page as string) || 1;
            const offset = (page - 1) * limit;

            // 💡 서비스단에 페이징 인자 함께 전달하도록 확장
            const result = await this.inquiryService.getMyInquiries(userId, limit, offset);
            return res.json({ success: true, data: result });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: "문의 내역 조회 중 오류가 발생했습니다." });
        }
    };

    // 3. 🛠️ [어드민] 답변 등록 제어
    submitAnswer = async (req: Request, res: Response) => {
        try {
            const inquiryId = Number(req.params.id);
            const { answerContent } = req.body;

            if (!answerContent) {
                return res.status(400).json({ success: false, message: "답변 내용을 입력해주세요." });
            }

            // 💡 비동기 처리(await) 반영
            const result = await this.inquiryService.answerInquiry(inquiryId, answerContent);
            return res.json({ success: true, message: "성공적으로 답변이 등록되었습니다.", data: result });
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message || "답변 등록에 실패했습니다." });
        }
    };
}