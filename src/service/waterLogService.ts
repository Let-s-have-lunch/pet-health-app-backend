import prisma from "../config/prisma.ts";
import {
    CreateWaterLogInputType,
    UpdateWaterLogInputType,
} from "../schemas/user/waterLogSchema.ts";

// 반려동물 소유권 확인
const checkPetOwnership = async (userId: number, petId: number) => {
    const pet = await prisma.pet.findFirst({
        where: { id: petId, userId, deletedAt: null },
    });
    if (!pet) {
        throw new Error("PET_NOT_FOUND_OR_FORBIDDEN");
    }
};

// 1. 생성
const createWaterLog = async (userId: number, data: CreateWaterLogInputType) => {
    await checkPetOwnership(userId, data.petId);

    const targetDate = new Date(data.recordDate);

    const existingLog = await prisma.waterLog.findFirst({
        where: { petId: data.petId, recordDate: targetDate },
    });

    if (existingLog) {
        throw new Error("ALREADY_EXISTS_WATERLOG");
    }

    const input = {
        ...data,
        recordDate: new Date(data.recordDate),
        memo: data.memo ?? null, //  undefined 방지
    };

    return prisma.waterLog.create({
        data: input,
    });
};

// 2. 반려동물별 전체 조회
const getWaterLogsByPetId = async (userId: number, petId: number) => {
    await checkPetOwnership(userId, petId);

    return prisma.waterLog.findMany({
        where: { petId, deletedAt: null },
        orderBy: { recordDate: "desc" },
    });
};

// 3. 단일 상세 조회
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

// 4. 수정
const updateWaterLog = async (userId: number, id: number, data: UpdateWaterLogInputType) => {
    const existingLog = await getWaterLogById(userId, id);
    const targetDate = new Date(data.recordDate);

    const duplicateLog = await prisma.waterLog.findFirst({
        where: {
            petId: existingLog.petId,
            recordDate: targetDate,
            id: { not: id},
        }
    })

    if (duplicateLog) {
        throw new Error("ALREADY_EXISTS_WATERLOG");
    }

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

// 5. 삭제 (소프트 딜리트)
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
    let endDate = new Date(targetDate); // 👈 월말 조회를 위한 종료일 변수 추가

    // 1. 기간 분기 및 정밀한 날짜 범위 세팅
    if (period === "daily") {
        startDate.setDate(targetDate.getDate() - 6);
    } else if (period === "weekly") {
        startDate.setDate(targetDate.getDate() - 27);
    } else if (period === "monthly") {
        startDate.setMonth(targetDate.getMonth() - 5);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        // targetDate가 속한 달의 마지막 날짜의 밤 11시 59분으로 설정
        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);
    }

    // 2. 프리즈마 범위 조회 (endDate 적용)
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
            // 💡 [해결] 해당 날짜가 속한 주의 월요일 날짜를 찾아서 그룹화 키로 사용합니다.
            const day = dateObj.getDay(); // 0(일) ~ 6(토)
            const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 맞춤
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
