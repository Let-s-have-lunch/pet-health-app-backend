import { Request, Response } from "express";
import homeService from "../service/homeService.ts";

export const getHomeDashboard = async (req: Request, res: Response) => {
    try {
        const petId = parseInt(String(req.query.petId), 10);
        const dateStr = String(req.query.date);

        if (!petId || !dateStr || dateStr === "undefined") {
            return res.status(400).json({
                success: false,
                message: "petId와 date 쿼리 파라미터가 필요합니다.",
            });
        }

        const dashboardData = await homeService.getPetDashboardWithPromiseAll(petId, dateStr);

        return res.status(200).json({
            success: true,
            message: "홈 대시보드 데이터 조회 성공",
            data: dashboardData,
        });
    } catch (error: any) {
        console.error("getHomeDashboard 에러:", error);
        return res.status(500).json({
            success: false,
            message: "서버 오류가 발생했습니다.",
        });
    }
};

export default {
    getHomeDashboard,
};
