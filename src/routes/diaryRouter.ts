import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import { createDiarySchema } from "../schemas/user/diary/createDiarySchema.ts";
import diaryController from "../controller/diaryController.ts";

const router = Router();

router.post("/create", authenticate, validate(createDiarySchema),diaryController.createDiary);

export default router;