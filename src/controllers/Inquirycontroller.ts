import { Request, Response } from "express";
import { InquiryService } from "./Inquiry.service";

export class Inquirycontroller {
    private inquiryService = new InquiryService();

    // 1. 문의 등록 제어
    create = (req: Request, res: Response) => {
        const { userId, title, content } = req.body;
        const result = this.inquiryService.createInquiry(Number(userId), title, content);
        res.status(201).json(result);
    };

    // 2. 내 문의 내역 조회 제어
    getMyInquiries = (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        const result = this.inquiryService.getMyInquiries(userId);
        res.json(result);
    };

    // 3. 🛠️ [어드민] 답변 등록 제어
    submitAnswer = (req: Request, res: Response) => {
        const inquiryId = Number(req.params.id);
        const { answerContent } = req.body;
        try {
            const result = this.inquiryService.answerInquiry(inquiryId, answerContent);
            res.json({ message: "성공적으로 답변이 등록되었습니다.", result });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };
}
