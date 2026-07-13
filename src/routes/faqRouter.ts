import express, { Request, Response, NextFunction } from 'express';
// 💡 .ts 확장자 제거
import faqController from "../controller/faqController";

const router = express.Router();

/**
 * [Middleware] 요청 파라미터 검증
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

// 1. FAQ 목록 조회
router.get('/', faqController.getFaqs);

// 2. FAQ 상세 조회
router.get('/:id', validateId, faqController.getFaqDetail);

// 3. FAQ 생성
router.post('/', faqController.createFaq);

// 4. FAQ 수정
router.put('/:id', validateId, faqController.updateFaq);

// 5. FAQ 삭제
router.delete('/:id', validateId, faqController.deleteFaq);

export default router;