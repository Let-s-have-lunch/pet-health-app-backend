import express from 'express';
import faqController from "../controller/faqController.ts"

const router = express.Router();

/**
 * [Middleware] 요청 파라미터 검증
 * 컨트롤러에 도달하기 전 ID 형식을 사전 검증하여 서버 안정성을 높입니다.
 */
const validateId = (req, res, next) => {
    const { id } = req.params;

    // ID가 존재하고, 숫자가 아닐 경우 즉시 400 에러 반환
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

// 2. FAQ 상세 조회 (검증 미들웨어 적용)
router.get('/:id', validateId, faqController.getFaqDetail);

export default router;