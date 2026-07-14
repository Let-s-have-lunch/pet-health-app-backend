import express from 'express';
import adminFaqController from "../controller/adminFaqController";
import { validate } from "../middlewares/validate"; // 공통 검증 미들웨어
import { createFaqSchema, updateFaqSchema } from "../schemas/faqSchema"; // 4번에서 만들 스키마

const router = express.Router();

// ID가 숫자인지 체크하는 기본 미들웨어만 유지
const validateId = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    if (id && isNaN(Number(id))) {
        return res.status(400).json({ success: false, message: "잘못된 ID 형식입니다." });
    }
    next();
};

// 💡 authenticate, requiredAdmin을 싹 빼고 가볍게 연결합니다.
router.post('/create', validate(createFaqSchema as any), adminFaqController.createFaq);
router.put('/:faqId', validateId, validate(updateFaqSchema as any), adminFaqController.updateFaq);
router.delete('/:id', validateId, adminFaqController.deleteFaq as any);

export default router;