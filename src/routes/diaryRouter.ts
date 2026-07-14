import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import { createDiarySchema } from "../schemas/user/diary/createDiarySchema.ts";
import diaryController from "../controller/diaryController.ts";

const router = Router();

router.post("/create", authenticate, validate(createDiarySchema),diaryController.createDiary);
router.get("/date", authenticate, diaryController.getDiaryList);
router.get("/range", authenticate, diaryController.getDiaryListByRange);
router.patch("/:diaryId", authenticate, validate(createDiarySchema), diaryController.updateDiary);
router.delete("/:diaryId", authenticate, diaryController.deleteDiary);

export default router;