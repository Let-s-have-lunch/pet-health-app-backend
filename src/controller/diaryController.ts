import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import { CreateDiaryInputType } from "../schemas/user/diary/createDiarySchema.ts";
import diaryService from "../service/diaryService.ts";
import { UpdateDiaryInputType } from "../schemas/user/diary/updateDiarySchema.ts";

const createDiary = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
        }

        const userId = req.user.id;

        const diaryData: CreateDiaryInputType = {
            ...req.body,
            date: new Date(req.body.date),
            diaryImage: req.file ? `/uploads/diary/${req.file.filename}` : undefined,
        };

        const newDiary = await diaryService.createDiary(diaryData, userId);
        res.status(201).json({
            message: "다이어리가 작성되었습니다.",
            data: newDiary,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "다이어리 작성 중 서버 에러가 발생되었습니다." });
    }
};

const getDiary = async (req: AuthRequest<{ diaryId: string }>, res: Response) => {
    try {
        const diaryId = Number(req.params.diaryId);

        if (isNaN(diaryId)) {
            return res.status(400).json({
                message: "유효하지 않은 다이어리 ID입니다.",
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "로그인이 필요한 서비스입니다.",
            });
        }

        const userId = req.user.id;

        const diary = await diaryService.getDiary(diaryId, userId);

        if (!diary) {
            return res.status(404).json({
                message: "다이어리를 찾을 수 없습니다.",
            });
        }

        return res.status(200).json({
            message: "다이어리를 성공적으로 조회했습니다.",
            data: diary,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "다이어리 조회 중 서버 오류가 발생했습니다.",
        });
    }
};

const getDiaryList = async (req: AuthRequest, res: Response) => {
    try {
        const date = req.query.date;

        if (!date) {
            return res.status(400).json({
                message: "날짜를 입력해주세요.",
            });
        }

        if (typeof date !== "string") {
            return res.status(400).json({
                message: "잘못된 날짜입니다.",
            });
        }
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                message: "유효하지 않은 날짜입니다.",
            });
        }

        if (!req.user) {
            return res.status(401).json({ message: "인증되지 않은 사용자입니다. " });
        }

        const userId = req.user.id;

        const diaryList = await diaryService.getDiaryList(userId, parsedDate);

        res.status(200).json({
            message: "다이어리를 성공적으로 불러왔습니다.",
            data: diaryList,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "서버 에러가 발생했습니다.",
        });
    }
};

const getDiaryListByRange = async (req: AuthRequest, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "시작일(startDate)과 종료일(endDate)을 모두 입력해주세요.",
            });
        }

        if (typeof startDate !== "string" || typeof endDate !== "string") {
            return res.status(400).json({
                message: "잘못된 날짜 형식입니다.",
            });
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({
                message: "유효하지 않은 날짜입니다.",
            });
        }

        if (!req.user) {
            return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
        }

        const userId = req.user.id;

        const diaryList = await diaryService.getDiaryListByRange(
            userId,
            parsedStartDate,
            parsedEndDate,
        );

        res.status(200).json({
            message: "기간별 다이어리를 성공적으로 불러왔습니다.",
            data: diaryList,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "기간별 다이어리 조회 중 서버 에러가 발생했습니다." });
    }
};

const updateDiary = async (req: AuthRequest<{ diaryId: string }>, res: Response) => {
    try {
        const diaryId = Number(req.params.diaryId);
        if (isNaN(diaryId)) {
            return res.status(400).json({ message: "유효하지 않은 다이어리 ID 입니다. " });
        }

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "로그인이 필요한 서비스입니다.",
            });
        }

        const userId = user.id;

        const diaryData: UpdateDiaryInputType = {
            ...req.body,
            date: new Date(req.body.date),
            diaryImage: req.file ? `/uploads/diary/${req.file.filename}` : req.body.diaryImage,
        };

        const updatedDiary = await diaryService.updateDiary(diaryId, userId, diaryData);
        if (!updatedDiary) {
            return res.status(404).json({
                message: "다이어리를 찾을 수 없습니다.",
            });
        }

        res.status(200).json({
            message: "다이어리가 수정되었습니다.",
            data: updatedDiary,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "다이어리 수정 중 서버 에러가 발생했습니다." });
    }
};

const deleteDiary = async (req: AuthRequest<{ diaryId: string }>, res: Response) => {
    try {
        const diaryId = Number(req.params.diaryId);
        if (isNaN(diaryId)) {
            return res.status(400).json({
                message: "올바른 다이어리 ID를 입력해주세요.",
            });
        }
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "로그인이 필요한 서비스입니다.",
            });
        }
        const userId = user.id;
        const deletedDiary = await diaryService.deleteDiary(diaryId, userId);
        if (!deletedDiary) {
            return res.status(404).json({
                message: "다이어리를 찾을 수 없습니다.",
            });
        }
        return res.status(200).json({
            message: "다이어리가 삭제되었습니다.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "다이어리 삭제 중 서버 오류가 발생했습니다." });
    }
};

export default {
    createDiary,
    getDiary,
    getDiaryList,
    getDiaryListByRange,
    updateDiary,
    deleteDiary,
};
