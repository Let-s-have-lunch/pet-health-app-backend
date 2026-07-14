import { Router } from "express";
import { authenticate, requiredAdmin } from "../../middlewares/auth.ts";
import adminNoticeRouter from "./notice/AdminNoticeRouter.ts";
import adminUserRouter from "./user/adminUserRouter.ts";
import adminFaqRouter from "./adminFaqRouter.ts";

const router = Router();

router.use(authenticate);
router.use(requiredAdmin);

router.use("/notice", adminNoticeRouter);
router.use("/user", adminUserRouter);
router.use("/faq", adminFaqRouter);

export default router;
