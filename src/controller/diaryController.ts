import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import {
    CreateDiaryInputType,
    createDiarySchema,
} from "../schemas/user/diary/createDiarySchema.ts";
import diaryService from "../service/diaryService.ts";

const createDiary = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
        }

        const { title, content, diaryImage, date }: CreateDiaryInputType = req.body;

        const diaryData: CreateDiaryInputType = {
            title,
            content,
            diaryImage,
            date,
        };

        const newDiary = await diaryService.createDiary(diaryData, user.id);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "다이어리 작성 중 서버 에러가 발생되었습니다." });
    }
};

const getDiaryById = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        const diaryId = Number(req.params.id);
        if (isNaN(diaryId)) {
            res.status(400).json({ message: "유효하지 않은 다이어리 ID 입니다. " });
            return;
        }

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "로그인이 필요한 서비스입니다.",
            });
        }

        const userId = user.id;

        const diary = await diaryService.getDiaryById(diaryId, userId);

        if (!diary) {
            return res.status(404).json({
                message: "다이어리를 찾을 수 없습니다.",
            });
        }

        res.status(200).json({
            message: "다이어리를 성공적으로 불러왔습니다.",
            data: diary,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "서버 에러가 발생했습니다.",
        });
    }
};

const updateDiary = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        const diaryId = Number(req.params.id);
        if (isNaN(diaryId)) {
            res.status(400).json({ message: "유효하지 않은 다이어리 ID 입니다. " });
            return;
        }

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "로그인이 필요한 서비스입니다.",
            });
        }

        const userId = user.id;

        const { title, content, diaryImage, date }: CreateDiaryInputType = req.body;

        const diaryData = {
            title,
            content,
            diaryImage,
            date,
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

const deleteDiary = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        const diaryId = Number(req.params.id);
        if (isNaN(diaryId)) {
            return res.status(400).json({
                message: "올바른 다이어리 ID를 입력해주세요."
            })
        }
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "로그인이 필요한 서비스입니다.",
            });
        }
        const userId = user.id
        const deletedDiary = await diaryService.deleteDiary(diaryId, userId);
        if (!deletedDiary) {
            return res.status(404).json({
                message: "다이어리를 찾을 수 없습니다."
            })
        }
        return;

    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "다이어리 삭제 중 서버 오류가 발생했습니다." })
    }
}



export default {
    createDiary,
    getDiaryById,
    updateDiary,
    deleteDiary,
};
