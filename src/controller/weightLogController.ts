import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import weightLogService from "../service/weightLogService.ts";

// 1. 몸무게 기록 생성
const createWeightLog = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const result = await weightLogService.createWeightLog(loginUserId, req.body);

        res.status(201).json({
            message: "몸무게 기록이 성공적으로 생성되었습니다.",
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
        res.status(500).json({ message: "몸무게 기록 생성 중 서버 에러가 발생했습니다." });
    }
};

// 2. 특정 반려동물의 전체 몸무게 기록 조회
const getWeightLogsByPetId = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const petId = parseInt(req.params.petId, 10);

        const result = await weightLogService.getWeightLogsByPetId(loginUserId, petId);

        res.status(200).json({
            message: "반려동물의 몸무게 기록 조회가 완료되었습니다.",
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
        res.status(500).json({ message: "몸무게 기록 조회 중 서버 에러가 발생했습니다." });
    }
};

// 3. 특정 몸무게 기록 상세 조회
const getWeightRecordById = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const id = parseInt(req.params.id, 10);

        const result = await weightLogService.getWeightRecordById(loginUserId, id);

        res.status(200).json({
            message: "몸무게 기록 상세 조회가 완료되었습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "WEIGHT_LOG_NOT_FOUND_OR_FORBIDDEN") {
                res.status(404).json({ message: "기록을 찾을 수 없거나 접근 권한이 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "몸무게 기록 상세 조회 중 서버 에러가 발생했습니다." });
    }
};

// 4. 몸무게 기록 수정
const updateWeightLog = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const id = parseInt(req.params.id, 10);

        const result = await weightLogService.updateWeightLog(loginUserId, id, req.body);

        res.status(200).json({
            message: "몸무게 기록이 성공적으로 수정되었습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "WEIGHT_LOG_NOT_FOUND_OR_FORBIDDEN") {
                res.status(404).json({ message: "기록을 찾을 수 없거나 접근 권한이 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "몸무게 기록 수정 중 서버 에러가 발생했습니다." });
    }
};

// 5. 몸무게 기록 삭제
const deleteWeightLog = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const id = Number(req.params.id);

        //  [여기만 추가!] 라우터의 validate 미들웨어를 빼는 대신, 여기서 안전하게 ID가 숫자인지 검증합니다.
        if (isNaN(id) || id <= 0) {
            res.status(400).json({ message: "잘못된 입력값입니다. 올바른 ID 형식이 아닙니다." });
            return;
        }

        await weightLogService.deleteWeightLog(loginUserId, id);

        res.status(200).json({
            message: "몸무게 기록이 성공적으로 삭제되었습니다.",
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "WEIGHT_LOG_NOT_FOUND_OR_FORBIDDEN") {
                res.status(404).json({ message: "기록을 찾을 수 없거나 접근 권한이 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "몸무게 기록 삭제 중 서버 에러가 발생했습니다." });
    }
};

// 6. 몸무게 통계 데이터 조회
const getWeightLogStats = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        const petIdStr = req.params.petId;
        const period = req.query.period as "daily" | "weekly" | "monthly";
        const baseDate = req.query.baseDate as string;

        if (req.user === undefined || req.user === null) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        // 이제 안전하게 인증된 유저 정보를 꺼내 씁니다.
        const loginUserId = req.user.id;
        const petId = parseInt(petIdStr, 10);

        // 서비스 함수로 데이터를 토스합니다.
        const result = await weightLogService.getWeightLogStats(loginUserId, petId, {
            period,
            baseDate,
        });

        res.status(200).json({
            message: "몸무게 통계 데이터 가공이 완료되었습니다.",
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
        res.status(500).json({ message: "몸무게 통계 조회 중 서버 에러가 발생했습니다." });
    }
};

export default {
    createWeightLog,
    getWeightLogsByPetId,
    getWeightRecordById,
    updateWeightLog,
    deleteWeightLog,
    getWeightLogStats,
};
