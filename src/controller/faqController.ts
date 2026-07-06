import { Request, Response } from "express";
import faqService from "../service/faqService.ts";
import prisma from "../config/prisma.ts";

// 1. FAQ 목록 조회 (getFaq -> getFaqs로 이름 통일하여 에러 해결)
const getFaqs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category } = req.query;
        const faqs = await faqService.findAllFaqs(
            typeof category === "string" ? category : undefined
        );

        res.status(200).json({
            success: true,
            data: faqs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "FAQ 목록 조회 중 서버 에러가 발생했습니다.",
        });
    }
};

// 2. FAQ 상세 조회
// 💡 req: Request<{ id: string }> 으로 params에 id가 들어온다는 것을 TS에게 알림
const getFaqDetail = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        // 💡 문자열 id를 숫자(Number)로 형변환
        const id = Number(req.params.id);

        // 💡 숫자가 아닌 값이 들어왔을 때의 방어 코드
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "유효하지 않은 FAQ ID 입니다.",
            });
            return;
        }

        // 이제 id가 확실한 숫자형이라 서비스 파일(getFaqById)의 id 쪽 빨간 줄이 사라집니다!
        const result = await prisma.faq.findUnique({ where: { id } }) || await faqService.getFaqById(id);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) { // 💡 :any를 붙여서 error.status 쪽 빨간 줄 해결
        console.error(error);
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "상세 조회 중 서버 에러가 발생했습니다.",
        });
    }
};

export default {
    getFaqs,
    getFaqDetail,
};