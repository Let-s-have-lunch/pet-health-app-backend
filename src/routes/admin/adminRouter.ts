import { Router } from "express";
import { authenticate, requiredAdmin } from "../../middlewares/auth.ts";
import adminNoticeRouter from "./notice/AdminNoticeRouter.ts";
import adminUserRouter from "./user/adminUserRouter.ts";
import { validate } from "../../middlewares/validate.ts";
import { getAdminStatsSchema } from "../../schemas/admin/adminStatSchema.ts";
import adminStatController from "../../controller/admin/adminStatController.ts";
import adminInquiryRouter from "./inquiry/adminInquiryRouter.ts";
import adminDashboardController from "../../controller/admin/adminDashboardController.ts";

const router = Router();

router.use(authenticate);
router.use(requiredAdmin);

router.use("/notice", adminNoticeRouter);
router.use("/user", adminUserRouter);
router.use("/inquiry", adminInquiryRouter);


// 1. 병원 방문 목적별 통계
router.get(
    "/stats/visit-purpose",
    validate(getAdminStatsSchema), // 👈 여기서 주소창의 ?year=2026 검증!
    adminStatController.getVisitPurposeStats, // 👈 이제 만들러 갈 컨트롤러 함수!
);
// 2. 전체 유저의 평균 진료비 조회 API
// 주소 형태 예시: GET /admin/stats/cost-average?year=2026
router.get(
    "/stats/cost-average",
    validate(getAdminStatsSchema), // 동일하게 연도 검증 스키마 사용!
    adminStatController.getVetCostAverage, // 컨트롤러에 새로 만들 함수명
);
// 3. 전체 유저의 평균 산책 시간 조회API
// 주소 형태 예시: GET /admin/stats/walk-average?year=2026
router.get(
    "/stats/walk-average",
    validate(getAdminStatsSchema), // 연도 검증 스키마 똑같이 사용
    adminStatController.getWalkDurationAverage // 컨트롤러에 새로 만들 함수명
);

router.get("/summary", adminDashboardController.getDashboardSummary);


export default router;
