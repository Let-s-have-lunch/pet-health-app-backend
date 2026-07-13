import { AuthRequest } from "../middlewares/auth.ts";
import { Response } from "express";
import { WalkLogInputType } from "../schemas/walkLog/walkLogSchema.ts";
import walkLogService from "../service/walkLogService.ts";

const createWalkLog = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        const petId = Number(req.params.petId);
        if (isNaN(petId)) {
            res.status(400).json({ message: "유효하지 않은 petId입니다." });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            return;
        }
        const userId = req.user.id;

        const walkLogData: WalkLogInputType = req.body;

        const result = await walkLogService.createWalkLog(petId, userId, walkLogData);
        res.status(201).json({ message: "산책 기록이 성공적으로 등록되었습니다.", data: result });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND_PET") {
                res.status(404).json({ message: "존재하지 않는 펫입니다." });
                return;
            }
            if (error.message === "FORBIDDEN") {
                res.status(403).json({ message: "산책기록을 생성할 권한이 없습니다." });
                return;
            }
        }
        res.status(500).json({ message: "산책기록을 생성하는 중 오류가 발생했습니다." });
    }
};

const updateWalkLog = async (req: AuthRequest<{ walkLogId: string }>, res: Response) => {
    try {
        const walkLogId = Number(req.params.walkLogId);
        if (isNaN(walkLogId)) {
            res.status(400).json({ message: "유효하지 않은 산책 id입니다." });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            return;
        }
        const userId = req.user.id;

        const walkLogData: WalkLogInputType = req.body;

        const result = await walkLogService.updateWalkLog(walkLogId, userId, walkLogData);
        res.status(200).json({ message: "산책기록을 성공적으로 수정했습니다." });
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND_WALKLOG") {
                res.status(404).json({ message: "존재하지 않는 산책기록 입니다." });
                return;
            }
            if (error.message === "FORBIDDEN") {
                res.status(403).json({ message: "산책기록을 수정할 권한이 없습니다." });
                return;
            }
        }
        res.status(500).json({ message: "산책기록을 수정하는 중 오류가 발생했습니다." });
    }
};

const getWalkLogs = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        const petId = Number(req.params.petId);
        if (isNaN(petId)) {
            res.status(400).json({ message: "유효하지 않은 petId입니다." });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            return;
        }
        const userId = req.user.id;

        const result = await walkLogService.getWalkLogs(petId, userId);
        res.status(200).json({ message: "산책기록 목록을 성공적으로 조회했습니다.", data: result });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND_PET") {
                res.status(404).json({ message: "존재하지 않는 펫입니다." });
                return;
            }
            if (error.message === "FORBIDDEN") {
                res.status(403).json({ message: "산책기록 목록을 조회할 권한이 없습니다." });
                return;
            }
        }
        res.status(500).json({ message: "산책기록 목록을 조회하는 중 오류가 발생했습니다." });
    }
};

const deleteWalkLog = async (req: AuthRequest<{ walkLogId: string }>, res: Response) => {
    try {
        const walkLogId = Number(req.params.walkLogId);
        if (isNaN(walkLogId)) {
            res.status(400).json({ message: "유효하지 않은 산책 id입니다." });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            return;
        }
        const userId = req.user.id;

        await walkLogService.deleteWalkLog(walkLogId, userId);
        res.status(200).json({ message: "산책기록을 성공적으로 삭제했습니다." });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND_WALKLOG") {
                res.status(404).json({ message: "존재하지 않는 산책기록 입니다." });
                return;
            }
            if (error.message === "FORBIDDEN") {
                res.status(403).json({ message: "산책기록을 삭제할 권한이 없습니다." });
                return;
            }
        }
        res.status(500).json({ message: "산책기록을 삭제하는 중 오류가 발생했습니다." });
    }
};

const getWalkLogStats = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        const petId = Number(req.params.petId);
        if (isNaN(petId)) {
            res.status(400).json({ message: "유효하지 않은 petId입니다." });
            return;
        }

        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            return;
        }
        const userId = req.user.id;

        const startDate = req.query.startDate as string | undefined;
        const endDate = req.query.endDate as string | undefined;

        const result = await walkLogService.getWalkLogStats(petId, userId, startDate, endDate);

        res.status(200).json({
            message: "산책 통계를 성공적으로 조회했습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND_PET") {
                res.status(404).json({ message: "존재하지 않는 펫입니다." });
                return;
            }
            if (error.message === "FORBIDDEN") {
                res.status(403).json({ message: "통계를 조회할 권한이 없습니다." });
                return;
            }
        }
        res.status(500).json({ message: "산책 통계를 조회하는 중 오류가 발생했습니다." });
    }
};

export default { createWalkLog, updateWalkLog, getWalkLogs, deleteWalkLog, getWalkLogStats };
