import { Request, Response } from "express";
import faqService from "../service/faqService";

export interface CreateFaqDto {
    question: string;
    answer: string;
    category: string;
}

export interface UpdateFaqDto {
    question?: string;
    answer?: string;
    category?: string;
}

// 반려동물 서비스 전용 카테고리 정의
const VALID_CATEGORIES = ['HEALTH', 'NUTRITION', 'BEHAVIOR', 'GROOMING', 'ADOPTION', 'WALKING', 'ETC'];

// 💡 [추가됨] 질문, 답변 스키마 검증 함수 (빈 문자열 및 타입 검사)
const validateSchema = (question?: any, answer?: any) => {
    if (question !== undefined && (typeof question !== 'string' || question.trim() === '')) {
        return "질문(question)은 비어있지 않은 문자열이어야 합니다.";
    }
    if (answer !== undefined && (typeof answer !== 'string' || answer.trim() === '')) {
        return "답변(answer)은 비어있지 않은 문자열이어야 합니다.";
    }
    return null; // 에러가 없으면 null 반환
};

// 1. FAQ 목록 조회
const getFaqs = async (req: Request, res: Response): Promise<void> => {
    try {
        // 💡 [수정됨] 쿼리스트링으로 page, size 가져오기 (기본값: 1페이지, 10개씩)
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;
        const category = req.query.category as string;

        if (category && !VALID_CATEGORIES.includes(category)) {
            res.status(400).json({ success: false, message: "유효하지 않은 카테고리입니다." });
            return;
        }

        // 💡 [수정됨] 서비스로 page와 size 값 넘겨주기
        const faqs = await faqService.findAllFaqs(
            category ? category : undefined,
            page,
            size
        );

        res.status(200).json({
            success: true,
            data: faqs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "반려동물 관련 FAQ를 불러오는 중 문제가 발생했습니다.",
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

        if (!result) {
            res.status(404).json({ success: false, message: "해당 FAQ를 찾을 수 없습니다." });
            return;
        }

        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        console.error(error);
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "상세 조회 중 서버 에러가 발생했습니다.",
        });
    }
};

// 3. FAQ 생성
const createFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const { question, answer, category } = req.body;

        if (!question || !answer || !category) {
            res.status(400).json({ success: false, message: "필수 입력값(질문, 답변, 카테고리)이 누락되었습니다." });
            return;
        }

        // 💡 [추가됨] 질문, 답변 스키마 검증
        const schemaError = validateSchema(question, answer);
        if (schemaError) {
            res.status(400).json({ success: false, message: schemaError });
            return;
        }

        if (!VALID_CATEGORIES.includes(category)) {
            res.status(400).json({ success: false, message: `카테고리는 다음 중 하나여야 합니다: ${VALID_CATEGORIES.join(', ')}` });
            return;
        }

        const newFaq = await faqService.createFaq(question, answer, category);
        res.status(201).json({ success: true, data: newFaq });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "FAQ 생성 중 서버 에러가 발생했습니다." });
    }
};

// 4. FAQ 수정
const updateFaq = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const { question, answer, category } = req.body;

        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "유효하지 않은 FAQ ID 입니다." });
            return;
        }

        // 💡 [추가됨] 질문, 답변 스키마 검증
        const schemaError = validateSchema(question, answer);
        if (schemaError) {
            res.status(400).json({ success: false, message: schemaError });
            return;
        }

        if (category && !VALID_CATEGORIES.includes(category)) {
            res.status(400).json({ success: false, message: "유효하지 않은 카테고리입니다." });
            return;
        }

        const updatedFaq = await faqService.updateFaq(id, question, answer, category);
        res.status(200).json({ success: true, data: updatedFaq });
    } catch (error: any) {
        console.error(error);
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "수정 중 서버 에러가 발생했습니다.",
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
        res.status(200).json({ success: true, message: "반려동물 FAQ가 삭제되었습니다." });
    } catch (error: any) {
        console.error(error);
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "삭제 중 서버 에러가 발생했습니다.",
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