import { Request, Response } from "express";
import adminStatService from "../../service/admin/adminStatService.ts";

const getVisitPurposeStats = async (req: Request, res: Response) => {
    try {
        // 어떤 값이 들어오든 안전하게 진짜 "문자열"로 변환해 줍니다.
        const year = String(req.query.year);
        // adminStatService로 안전하게 토스
        const result = await adminStatService.getVisitPurposeStats(year);

        res.status(200).json({
            message: `${year}년도 병원 방문 목적별 통계 조회가 완료되었습니다.`,
            data: result,
        });
    } catch (error) {
        console.error("어드민 통계 조회 에러:", error);
        res.status(500).json({
            message: "어드민 병원 방문 목적 통계 조회 중 서버 에러가 발생했습니다.",
        });
    }
};

// 전체 유저의 평균 진료비 조회
const getVetCostAverage = async (req: Request, res: Response) => {
    try {
        const year = String(req.query.year);
        // 서비스 단으로 연도 데이터 토스
        const result = await adminStatService.getVetCostAverage(year);

        res.status(200).json({
            message: `${year}년도 전체 유저의 평균 병원 진료비 조회가 완료되었습니다.`,
            data: result,
        });
    } catch (error) {
        console.error("어드민 진료비 평균 조회 에러:", error);
        res.status(500).json({
            message: "어드민 전체 평균 진료비 조회 중 서버 에러가 발생했습니다."
        });
    }
};

// 전체 유저의 평균 산책 시간 조회
const getWalkDurationAverage = async (req: Request, res: Response) => {
    try {
        const year = String(req.query.year);
        // 서비스 단으로 연도 데이터 전달
        const result = await adminStatService.getWalkDurationAverage(year);

        res.status(200).json({
            message: `${year}년도 전체 유저의 평균 산책 시간 조회가 완료되었습니다.`,
            data: result,
        });
    } catch (error) {
        console.error("어드민 산책 평균 조회 에러:", error);
        res.status(500).json({
            message: "어드민 전체 평균 산책 시간 조회 중 서버 에러가 발생했습니다."
        });
    }
};

export default {
    getVisitPurposeStats,
    getVetCostAverage,
    getWalkDurationAverage,
};
