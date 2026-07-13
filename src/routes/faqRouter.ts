import express, { Request, Response, NextFunction } from 'express';
import faqController from "../controller/faqController";
// 💡 서비스 파일에서 우리가 만든 '반려동물 카테고리 목록'을 가져옵니다.
import { VALID_PET_CATEGORIES } from "../service/faqService";

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

/**
 * 💡 [Middleware 2] 반려동물 카테고리 검증 (라우터 입구 컷!)
 * 데이터베이스나 서비스로 가기 전에, 여기서 1차로 철통 방어합니다.
 */
const validatePetCategory = (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.body;

    // 생성(POST)하거나, 카테고리를 수정(PUT)할 때 엉뚱한 값이 들어오면 차단!
    if (category && !VALID_PET_CATEGORIES.includes(category)) {
        return res.status(400).json({
            success: false,
            message: `반려동물 카테고리만 입력 가능합니다. (${VALID_PET_CATEGORIES.join(', ')} 중 하나를 선택해주세요.)`
        });
    }
    next();
};

// 1. 반려동물 FAQ 목록 조회 (카테고리 필터링 가능, 예: /faqs?category=HEALTH)
router.get('/', faqController.getFaqs);

// 2. 반려동물 FAQ 상세 조회
router.get('/:id', validateId, faqController.getFaqDetail);

// 3. 반려동물 FAQ 생성 (💡 카테고리 검증 미들웨어 통과해야 함)
router.post('/', validatePetCategory, faqController.createFaq);

// 4. 반려동물 FAQ 수정 (💡 ID 검증 + 카테고리 검증 둘 다 통과해야 함)
router.put('/:id', validateId, validatePetCategory, faqController.updateFaq);

// 5. 반려동물 FAQ 삭제 (서비스에서 Soft Delete로 처리됨)
router.delete('/:id', validateId, faqController.deleteFaq);

export default router;