import { Router } from "express";
import homeController from "../controller/homeController.ts";

const router = Router();

// 최종 주소 예시: GET http://localhost:8080/home/dashboard?petId=1&date=2026-07-01
router.get("/dashboard", homeController.getHomeDashboard);

export default router;
