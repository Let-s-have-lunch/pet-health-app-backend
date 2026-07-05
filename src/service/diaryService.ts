import { CreateDiaryInputType } from "../schemas/user/diary/createDiarySchema.ts";
import prisma from "../config/prisma.ts";

const createDiary = async (diaryData: CreateDiaryInputType, userId: number) => {
    return prisma.diary.create({
        data: {
            ...diaryData,
            diaryImage: diaryData.diaryImage ?? null,
            user: {
                connect: {
                    id: userId, 
                },
            },
        },
    });
};

export default {
    createDiary,
};
