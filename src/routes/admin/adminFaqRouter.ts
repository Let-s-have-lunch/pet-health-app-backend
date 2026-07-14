import express, { Request, Response, NextFunction } from 'express';
// 경로 확인 부탁드립니다. (본인 프로젝트 폴더 구조에 맞게)
import faqController from "../../controller/faqController.ts";
import { VALID_PET_CATEGORIES } from "../../service/faqService.ts";
import { authenticate, requiredAdmin } from "../../middlewares/auth.ts";

const router = express.Router();

// [미들웨어] ID 검증
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

// [미들웨어] 카테고리 검증
const validatePetCategory = (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.body;
    if (category && !VALID_PET_CATEGORIES.includes(category)) {
        return res.status(400).json({
            success: false,
            message: `반려동물 카테고리만 입력 가능합니다. (${VALID_PET_CATEGORIES.join(', ')} 중 하나를 선택해주세요.)`
        });
    }
    next();
};

// 💡 관리자 권한 + 질문자님의 유효성 검증 로직이 합쳐진 최종본
router.post('/', authenticate, requiredAdmin, validatePetCategory, faqController.createFaq);

// router.patch 대신 router.put을 쓰셨었으니 기존 코드에 맞춥니다.
router.put('/:id', authenticate, requiredAdmin, validateId, validatePetCategory, faqController.updateFaq);

router.delete('/:id', authenticate, requiredAdmin, validateId, faqController.deleteFaq);

export default router;