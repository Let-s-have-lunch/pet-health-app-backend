import { CreateDiaryInputType } from "../schemas/user/diary/createDiarySchema.ts";
import prisma from "../config/prisma.ts";
import { UpdateDiaryInputType } from "../schemas/user/diary/updateDiarySchema.ts";

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

const getDiary = async (diaryId: number, userId: number) => {
    return prisma.diary.findFirst({
        where: {
            id: diaryId,
            userId,
            deletedAt: null,
        },
    });
};

const getDiaryList = async (userId: number, date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const nextDay = new Date(startOfDay);
    nextDay.setDate(nextDay.getDate() + 1);

    return prisma.diary.findMany({
        where: {
            userId,
            deletedAt: null,
            date: {
                gte: startOfDay,
                lt: nextDay,
            },
        },
        orderBy: {
            id: "asc",
        },
    });
};

const getDiaryListByRange = async (userId: number, startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const nextDayOfEnd = new Date(endDate);
    nextDayOfEnd.setHours(0, 0, 0, 0);
    nextDayOfEnd.setDate(nextDayOfEnd.getDate() + 1);

    return prisma.diary.findMany({
        where: {
            userId,
            deletedAt: null,
            date: {
                gte: start,
                lt: nextDayOfEnd,
            },
        },
        orderBy: {
            date: "asc",
        },
    });
};

const updateDiary = async (diaryId: number, userId: number, diaryData: UpdateDiaryInputType) => {
    const diary = await prisma.diary.findFirst({
        where: {
            id: diaryId,
            userId,
            deletedAt: null,
        },
    });

    if (!diary) {
        return null;
    }

    const updateData: { title: string; content: string; date: Date; diaryImage?: string | null } = {
        title: diaryData.title,
        content: diaryData.content,
        date: diaryData.date,
    };

    if (diaryData.diaryImage !== undefined) {
        updateData.diaryImage = diaryData.diaryImage;
    }

    return prisma.diary.update({
        where: {
            id: diaryId,
        },
        data: updateData,
    });
};

const deleteDiary = async (diaryId: number, userId: number) => {
    const diary = await prisma.diary.findFirst({
        where: {
            id: diaryId,
            userId,
            deletedAt: null,
        },
    });
    if (!diary) {
        return null;
    }
    return prisma.diary.update({
        where: {
            id: diaryId,
        },
        data: {
            deletedAt: new Date(),
        },
    });
};

export default {
    createDiary,
    getDiary,
    getDiaryList,
    getDiaryListByRange,
    updateDiary,
    deleteDiary,
};
