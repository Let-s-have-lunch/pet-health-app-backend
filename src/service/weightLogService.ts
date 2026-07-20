import prisma from "../config/prisma.ts";
import {
    CreateWeightLogInputType,
    UpdateWeightLogInputType,
} from "../schemas/weightLog/weightLogSchema.ts";

const checkPetOwnership = async (userId: number, petId: number) => {
    const pet = await prisma.pet.findFirst({
        where: { id: petId, userId, deletedAt: null },
    });
    if (!pet) {
        throw new Error("PET_NOT_FOUND_OR_FORBIDDEN");
    }
};

const createWeightLog = async (userId: number, data: CreateWeightLogInputType) => {
    await checkPetOwnership(userId, data.petId);

    const targetDate = new Date(data.recordDate);

    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0);
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59);

    const existingLog = await prisma.weightLog.findFirst({
        where: {
            petId: data.petId,
            deletedAt: null,
            recordDate: {
                gte: startOfDay,
                lte: endOfDay,
            }
        },
    });

    if (existingLog) {
        throw new Error("ALREADY_EXISTS_WEIGHTLOG");
    }

    const input = {
        ...data,
        recordDate: targetDate,
        memo: data.memo ?? null,
    };

    return prisma.weightLog.create({
        data: input,
    });
};

const getWeightLogsByPetId = async (userId: number, petId: number) => {
    await checkPetOwnership(userId, petId);

    return prisma.weightLog.findMany({
        where: { petId, deletedAt: null },
        orderBy: { recordDate: "desc" },
    });
};

const getWeightRecordById = async (userId: number, id: number) => {
    const log = await prisma.weightLog.findFirst({
        where: { id, deletedAt: null },
        include: { pet: true },
    });

    if (!log || log.pet.userId !== userId) {
        throw new Error("WEIGHT_LOG_NOT_FOUND_OR_FORBIDDEN");
    }

    return log;
};

const updateWeightLog = async (userId: number, id: number, data: UpdateWeightLogInputType) => {
    const existingLog = await getWeightRecordById(userId, id);

    const targetDate = new Date(data.recordDate);
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0);
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59);

    const duplicateLog = await prisma.weightLog.findFirst({
        where: {
            petId: existingLog.petId,
            deletedAt: null,
            recordDate: {
                gte: startOfDay,
                lte: endOfDay,
            },
            id: { not: id },
        }
    });

    if (duplicateLog) {
        throw new Error("ALREADY_EXISTS_WEIGHTLOG");
    }

    const input = {
        ...data,
        recordDate: targetDate,
        memo: data.memo ?? null,
    };

    return prisma.weightLog.update({
        where: { id },
        data: input,
    });
};

const deleteWeightLog = async (userId: number, id: number) => {
    await getWeightRecordById(userId, id);

    return prisma.weightLog.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};

const getWeightLogStats = async (
    userId: number,
    petId: number,
    query: { period: "daily" | "weekly" | "monthly"; baseDate: string },
) => {
    const { period, baseDate } = query;

    await checkPetOwnership(userId, petId);

    const targetDate = new Date(baseDate);
    const startDate = new Date(targetDate);

    switch (period) {
        case "daily":
            startDate.setDate(targetDate.getDate() - 6);
            break;
        case "weekly":
            startDate.setDate(targetDate.getDate() - 27);
            break;
        case "monthly":
            startDate.setMonth(targetDate.getMonth() - 5);
            startDate.setDate(1);
            break;
    }

    const logs = await prisma.weightLog.findMany({
        where: {
            petId,
            deletedAt: null,
            recordDate: {
                gte: startDate,
                lte: targetDate,
            },
        },
        orderBy: { recordDate: "asc" },
    });

    const sumMap: { [key: string]: number } = {};
    const countMap: { [key: string]: number } = {};

    logs.forEach(log => {
        let key = "";
        const dateObj = new Date(log.recordDate);

        if (period === "daily" || period === "weekly") {
            key = dateObj.toISOString().split("T")[0] ?? "";
        } else if (period === "monthly") {
            key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
        }

        sumMap[key] = (sumMap[key] || 0) + log.weight;
        countMap[key] = (countMap[key] || 0) + 1;
    });

    const chartData = Object.keys(sumMap).map(key => {
        const total = sumMap[key] ?? 0;
        const count = countMap[key] ?? 1;

        return {
            date: key,
            averageWeight: Number((total / count).toFixed(2)),
        };
    });

    return {
        period,
        petId,
        chartData,
    };
};

export default {
    createWeightLog,
    getWeightLogsByPetId,
    getWeightRecordById,
    updateWeightLog,
    deleteWeightLog,
    getWeightLogStats,
};