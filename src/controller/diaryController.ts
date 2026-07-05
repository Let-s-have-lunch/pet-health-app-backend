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

        const { title, content, diaryImage }: CreateDiaryInputType = req.body;

        const diaryData: CreateDiaryInputType = {
            title,
            content,
            diaryImage,
        };
        
        const newDiary = await diaryService.createDiary(diaryData, user.id);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "다이어리 작성 중 서버 에러가 발생되었습니다." });

    }
}


const updateDiary = async (req: AuthRequest, res: Response) => {


}


export default {
    createDiary
};