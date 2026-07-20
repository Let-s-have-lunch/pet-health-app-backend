import { Router } from "express";
import homeController from "../controller/homeController.ts";

const router = Router();

router.get("/dashboard", homeController.getHomeDashboard);

export default router;
