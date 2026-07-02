import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authmiddleware";
import { WalkLogService } from "../service/walkLogService"; // 서비스 가져오기

export class WalkLogController {
    private walkLogService = new WalkLogService();

    // 1. 산책 기록 생성
    create = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const { distance, time } = req.body;
            const userId = req.user!.id;
            const log = await this.walkLogService.createLog(userId, distance, time);
            res.status(201).json(log);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    // 2. 내 산책 기록 조회
    getMyLogs = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const logs = await this.walkLogService.getMyLogs(userId);
            res.json(logs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}
