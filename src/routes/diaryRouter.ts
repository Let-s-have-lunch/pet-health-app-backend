import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import { createDiarySchema } from "../schemas/diary/createDiarySchema.ts";
import diaryController from "../controller/diaryController.ts";
import { updateDiarySchema } from "../schemas/diary/updateDiarySchema.ts";
import { upload } from "../middlewares/multer.ts";

const router = Router();

router.post("/create", authenticate, upload.single("diaryImage"), diaryController.createDiary);
router.get("/date", authenticate, diaryController.getDiaryList);
router.get("/range", authenticate, diaryController.getDiaryListByRange);
router.get("/:diaryId", authenticate, diaryController.getDiary);
router.patch("/:diaryId", authenticate, upload.single("diaryImage"), diaryController.updateDiary);
router.delete("/:diaryId", authenticate, diaryController.deleteDiary);

export default router;