import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import { createDiarySchema } from "../schemas/user/diary/createDiarySchema.ts";
import diaryController from "../controller/diaryController.ts";

const router = Router();

router.post("/create", authenticate, validate(createDiarySchema),diaryController.createDiary);
router.get("/:id", authenticate, diaryController.getDiaryById);
router.patch("/:id", authenticate, validate(createDiarySchema), diaryController.updateDiary);
router.delete("/:id", authenticate, diaryController.deleteDiary);

export default router;