import { Router } from "express";
import noticeController from "../controller/noticeController.ts";

const router = Router();

router.get("/list", noticeController.getNoticeList);
router.get("/:noticeId", noticeController.getNoticeById);

export default router;