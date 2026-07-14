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

const updateDiary = async (diaryId: number, userId: number, diaryData: CreateDiaryInputType) => {
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
            ...diaryData,
            diaryImage: diaryData.diaryImage ?? null,
        },
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
    getDiaryList,
    getDiaryListByRange,
    updateDiary,
    deleteDiary,
};
