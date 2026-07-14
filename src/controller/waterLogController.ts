import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import waterLogService from "../service/waterLogService.ts";

// 1. 음수량 기록 생성
const createWaterLog = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const result = await waterLogService.createWaterLog(loginUserId, req.body);

        res.status(201).json({
            message: "음수량 기록이 성공적으로 생성되었습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "PET_NOT_FOUND_OR_FORBIDDEN") {
                res.status(403).json({
                    message: "해당 반려동물에 접근할 권한이 없거나 존재하지 않습니다.",
                });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "음수량 기록 생성 중 서버 에러가 발생했습니다." });
    }
};

// 2. 특정 반려동물의 전체 음수량 기록 조회
const getWaterLogsByPetId = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const petId = parseInt(req.params.petId, 10);

        const result = await waterLogService.getWaterLogsByPetId(loginUserId, petId);

        res.status(200).json({
            message: "반려동물의 음수량 기록 조회가 완료되었습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "PET_NOT_FOUND_OR_FORBIDDEN") {
                res.status(403).json({
                    message: "해당 반려동물에 접근할 권한이 없거나 존재하지 않습니다.",
                });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "음수량 기록 조회 중 서버 에러가 발생했습니다." });
    }
};

// 3. 특정 음수량 기록 상세 조회
const getWaterLogById = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const id = parseInt(req.params.id, 10);

        const result = await waterLogService.getWaterLogById(loginUserId, id);

        res.status(200).json({
            message: "음수량 기록 상세 조회가 완료되었습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "WATER_LOG_NOT_FOUND_OR_FORBIDDEN") {
                res.status(404).json({ message: "기록을 찾을 수 없거나 접근 권한이 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "음수량 기록 상세 조회 중 서버 에러가 발생했습니다." });
    }
};

// 4. 음수량 기록 수정
const updateWaterLog = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const id = parseInt(req.params.id, 10);

        const result = await waterLogService.updateWaterLog(loginUserId, id, req.body);

        res.status(200).json({
            message: "음수량 기록이 성공적으로 수정되었습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "WATER_LOG_NOT_FOUND_OR_FORBIDDEN") {
                res.status(404).json({ message: "기록을 찾을 수 없거나 접근 권한이 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "음수량 기록 수정 중 서버 에러가 발생했습니다." });
    }
};

// 5. 음수량 기록 삭제
const deleteWaterLog = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const id = parseInt(req.params.id, 10);

        await waterLogService.deleteWaterLog(loginUserId, id);

        res.status(200).json({
            message: "음수량 기록이 성공적으로 삭제되었습니다.",
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "WATER_LOG_NOT_FOUND_OR_FORBIDDEN") {
                res.status(404).json({ message: "기록을 찾을 수 없거나 접근 권한이 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "음수량 기록 삭제 중 서버 에러가 발생했습니다." });
    }
};

// 6. 음수량 통계 데이터 조회
const getWaterLogStats = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const petId = parseInt(req.params.petId, 10);

        const period = req.query.period as "daily" | "weekly" | "monthly";
        const baseDate = req.query.baseDate as string;

        const result = await waterLogService.getWaterLogStats(loginUserId, petId, {
            period,
            baseDate,
        });

        res.status(200).json({
            message: "음수량 통계 데이터 가공이 완료되었습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "PET_NOT_FOUND_OR_FORBIDDEN") {
                res.status(403).json({
                    message: "해당 반려동물에 접근할 권한이 없거나 존재하지 않습니다.",
                });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "음수량 통계 조회 중 서버 에러가 발생했습니다." });
    }
};

export default {
    createWaterLog,
    getWaterLogsByPetId,
    getWaterLogById,
    updateWaterLog,
    deleteWaterLog,
    getWaterLogStats,
};
