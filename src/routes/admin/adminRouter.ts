import { Router } from "express";
import { authenticate, requiredAdmin } from "../../middlewares/auth.ts";
import adminNoticeRouter from "./notice/AdminNoticeRouter.ts";
import adminUserRouter from "./user/adminUserRouter.ts";
import adminInquiryRouter from "./inquiry/adminInquiryRouter.ts";
import adminDashboardController from "../../controller/admin/adminDashboardController.ts";

const router = Router();

router.use(authenticate);
router.use(requiredAdmin);

router.use("/notice", adminNoticeRouter);
router.use("/user", adminUserRouter);
router.use("/inquiry", adminInquiryRouter);

router.get("/summary", adminDashboardController.getDashboardSummary);


export default router;
