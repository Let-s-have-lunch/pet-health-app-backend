import express, { Request, Response, NextFunction } from 'express';
import faqController from "../controller/faqController";

const router = express.Router();

/**
 * [Middleware 1] 요청 파라미터 검증 (ID가 숫자인지 확인)
 */
const validateId = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (id && isNaN(Number(id))) {
        return res.status(400).json({
            success: false,
            message: "잘못된 ID 형식입니다. 숫자형 값을 입력해주세요."
        });
    }
    next();
};

// 1. 반려동물 FAQ 목록 조회 (누구나 접근 가능)
router.get('/', faqController.getFaqs);

// 2. 반려동물 FAQ 상세 조회 (누구나 접근 가능)
router.get('/:id', validateId, faqController.getFaqDetail);

export default router;