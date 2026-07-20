import prisma from "../config/prisma.ts";
import {
    CreateWaterLogInputType,
    UpdateWaterLogInputType,
} from "../schemas/waterLog/waterLogSchema.ts";

const checkPetOwnership = async (userId: number, petId: number) => {
    const pet = await prisma.pet.findFirst({
        where: { id: petId, userId, deletedAt: null },
    });
    if (!pet) {
        throw new Error("PET_NOT_FOUND_OR_FORBIDDEN");
    }
};

const createWaterLog = async (userId: number, data: CreateWaterLogInputType) => {
    await checkPetOwnership(userId, data.petId);

    const input = {
        ...data,
        recordDate: new Date(data.recordDate),
        memo: data.memo ?? null, //  undefined 방지
    };

    return prisma.waterLog.create({
        data: input,
    });
};

const getWaterLogsByPetId = async (userId: number, petId: number) => {
    await checkPetOwnership(userId, petId);

    return prisma.waterLog.findMany({
        where: { petId, deletedAt: null },
        orderBy: { recordDate: "desc" },
    });
};

const getWaterLogById = async (userId: number, id: number) => {
    const log = await prisma.waterLog.findFirst({
        where: { id, deletedAt: null },
        include: { pet: true },
    });

    if (!log || log.pet.userId !== userId) {
        throw new Error("WATER_LOG_NOT_FOUND_OR_FORBIDDEN");
    }

    return log;
};

const updateWaterLog = async (userId: number, id: number, data: UpdateWaterLogInputType) => {
    await getWaterLogById(userId, id); // 권한 및 존재 여부만 체크

    const input = {
        ...data,
        recordDate: new Date(data.recordDate),
        memo: data.memo ?? null,
    };

    return prisma.waterLog.update({
        where: { id },
        data: input,
    });
};

const deleteWaterLog = async (userId: number, id: number) => {
    await getWaterLogById(userId, id);

    return prisma.waterLog.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};

const getWaterLogStats = async (
    userId: number,
    petId: number,
    query: { period: "daily" | "weekly" | "monthly"; baseDate: string },
) => {
    await checkPetOwnership(userId, petId);

    const { period, baseDate } = query;
    const targetDate = new Date(baseDate);
    let startDate = new Date(targetDate);
    let endDate = new Date(targetDate);

    if (period === "daily") {
        startDate.setDate(targetDate.getDate() - 6);
    } else if (period === "weekly") {
        startDate.setDate(targetDate.getDate() - 27);
    } else if (period === "monthly") {
        startDate.setMonth(targetDate.getMonth() - 5);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);
    }

    const logs = await prisma.waterLog.findMany({
        where: {
            petId,
            deletedAt: null,
            recordDate: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { recordDate: "asc" },
    });

    const statsMap: { [key: string]: number } = {};

    logs.forEach(log => {
        let key = "";
        const dateObj = new Date(log.recordDate);

        if (period === "daily") {
            key = dateObj.toISOString().split("T")[0] ?? "";
        } else if (period === "weekly") {
            const day = dateObj.getDay();
            const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(dateObj.setDate(diff));
            key = monday.toISOString().split("T")[0] ?? "";
        } else if (period === "monthly") {
            key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
        }

        statsMap[key] = (statsMap[key] || 0) + log.amount;
    });

    const chartData = Object.keys(statsMap).map(key => ({
        date: key,
        totalAmount: statsMap[key],
    }));

    return {
        period,
        petId,
        chartData,
    };
};

export default {
    createWaterLog,
    getWaterLogsByPetId,
    getWaterLogById,
    updateWaterLog,
    deleteWaterLog,
    getWaterLogStats,
};
