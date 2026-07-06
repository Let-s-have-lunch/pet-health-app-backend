import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import vetRecordService from "../service/vetRecordService.ts";

// 1. 병원 기록 생성
const createVetRecord = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const result = await vetRecordService.createVetRecord(loginUserId, req.body);

        res.status(201).json({
            message: "병원 기록이 성공적으로 생성되었습니다.",
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
        res.status(500).json({ message: "병원 기록 생성 중 서버 에러가 발생했습니다." });
    }
};

// 2. 특정 반려동물의 전체 병원 기록 조회
const getVetRecordsByPetId = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const petId = parseInt(req.params.petId, 10);

        const result = await vetRecordService.getVetRecordsByPetId(loginUserId, petId);

        res.status(200).json({
            message: "반려동물의 병원 기록 조회가 완료되었습니다.",
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
        res.status(500).json({ message: "병원 기록 조회 중 서버 에러가 발생했습니다." });
    }
};

// 3. 특정 병원 기록 상세 조회
const getVetRecordById = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const id = parseInt(req.params.id, 10);

        const result = await vetRecordService.getVetRecordById(loginUserId, id);

        res.status(200).json({
            message: "병원 기록 상세 조회가 완료되었습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "VET_RECORD_NOT_FOUND_OR_FORBIDDEN") {
                res.status(404).json({ message: "기록을 찾을 수 없거나 접근 권한이 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "병원 기록 상세 조회 중 서버 에러가 발생했습니다." });
    }
};

// 4. 병원 기록 수정
const updateVetRecord = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const id = parseInt(req.params.id, 10);

        const result = await vetRecordService.updateVetRecord(loginUserId, id, req.body);

        res.status(200).json({
            message: "병원 기록이 성공적으로 수정되었습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "VET_RECORD_NOT_FOUND_OR_FORBIDDEN") {
                res.status(404).json({ message: "기록을 찾을 수 없거나 접근 권한이 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "병원 기록 수정 중 서버 에러가 발생했습니다." });
    }
};

// 5. 병원 기록 삭제
const deleteVetRecord = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다." });
            return;
        }

        const loginUserId = req.user.id;
        const id = parseInt(req.params.id, 10);

        await vetRecordService.deleteVetRecord(loginUserId, id);

        res.status(200).json({
            message: "병원 기록이 성공적으로 삭제되었습니다.",
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "VET_RECORD_NOT_FOUND_OR_FORBIDDEN") {
                res.status(404).json({ message: "기록을 찾을 수 없거나 접근 권한이 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "병원 기록 삭제 중 서버 에러가 발생했습니다." });
    }
};

// 맨 아래에서 객체로 묶어 기본 내보내기
export default {
    createVetRecord,
    getVetRecordsByPetId,
    getVetRecordById,
    updateVetRecord,
    deleteVetRecord,
};
