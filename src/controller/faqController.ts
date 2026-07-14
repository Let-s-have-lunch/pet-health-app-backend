import { Request, Response } from "express";
import faqService from "../service/faqService";

// 질문, 답변 스키마 검증 함수
const validateSchema = (question?: any, answer?: any) => {
    if (question !== undefined && (typeof question !== 'string' || question.trim() === '')) {
        return "질문(question)은 비어있지 않은 문자열이어야 합니다.";
    }
    if (answer !== undefined && (typeof answer !== 'string' || answer.trim() === '')) {
        return "답변(answer)은 비어있지 않은 문자열이어야 합니다.";
    }
    return null;
};

// 1. FAQ 목록 조회
const getFaqs = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;

        // 서비스단에 page와 size만 전달
        const faqs = await faqService.findAllFaqs(page, size);

        res.status(200).json({
            success: true,
            data: faqs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "FAQ를 불러오는 중 문제가 발생했습니다.",
        });
    }
};

// 2. FAQ 상세 조회
const getFaqDetail = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "유효하지 않은 FAQ ID 입니다." });
            return;
        }

        const result = await faqService.getFaqById(id);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        console.error(error);
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "상세 조회 중 에러가 발생했습니다.",
        });
    }
};

// 3. FAQ 생성
const createFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const { question, answer } = req.body;

        if (!question || !answer) {
            res.status(400).json({ success: false, message: "필수 입력값(질문, 답변)이 누락되었습니다." });
            return;
        }

        const schemaError = validateSchema(question, answer);
        if (schemaError) {
            res.status(400).json({ success: false, message: schemaError });
            return;
        }

        const newFaq = await faqService.createFaq(question, answer);
        res.status(201).json({ success: true, data: newFaq });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "FAQ 생성 중 에러가 발생했습니다." });
    }
};

// 4. FAQ 수정
const updateFaq = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const { question, answer } = req.body;

        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "유효하지 않은 FAQ ID 입니다." });
            return;
        }

        const schemaError = validateSchema(question, answer);
        if (schemaError) {
            res.status(400).json({ success: false, message: schemaError });
            return;
        }

        // 💡 오타 라인 삭제하고 정상적인 서비스 호출 딱 한 줄만 남겼습니다!
        const updatedFaq = await faqService.updateFaq(id, question, answer);
        res.status(200).json({ success: true, data: updatedFaq });
    } catch (error: any) {
        console.error(error);
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "수정 중 에러가 발생했습니다.",
        });
    }
};

// 5. FAQ 삭제
const deleteFaq = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "유효하지 않은 FAQ ID 입니다." });
            return;
        }

        await faqService.deleteFaq(id);
        res.status(200).json({ success: true, message: "FAQ가 성공적으로 삭제되었습니다." });
    } catch (error: any) {
        console.error(error);
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "삭제 중 에러가 발생했습니다.",
        });
    }
};

export default {
    getFaqs,
    getFaqDetail,
    createFaq,
    updateFaq,
    deleteFaq,
};