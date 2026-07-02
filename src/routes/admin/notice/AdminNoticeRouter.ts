import { Router } from "express";
import { validate } from "../../../middlewares/validate.ts";
import adminNoticeController from "../../../controller/admin/adminNoticeController.ts";
import { noticeSchema } from "../../../schemas/admin/notice/noticeSchema.ts";

const router = Router();

router.post("/create", validate(noticeSchema), adminNoticeController.createNotice);
router.patch("/:noticeId", validate(noticeSchema), adminNoticeController.updateNotice);
router.delete("/:noticeId", adminNoticeController.deleteNotice);

export default router;
