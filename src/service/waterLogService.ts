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
    await getWaterLogById(userId, id);

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
    // 1. 소유권 검증
    await checkPetOwnership(userId, petId);

    const { period, baseDate } = query;
    const targetDate = new Date(baseDate);
    let startDate = new Date(targetDate);

    // 2. 통계 기간 분기 처리
    if (period === "daily") {
        startDate.setDate(targetDate.getDate() - 6);
    } else if (period === "weekly") {
        startDate.setDate(targetDate.getDate() - 27);
    } else if (period === "monthly") {
        startDate.setMonth(targetDate.getMonth() - 5);
        startDate.setDate(1);
    }

    // 3. 프리즈마 범위 조회
    const logs = await prisma.waterLog.findMany({
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

    // 4. 프론트엔드 그래프 친화적 데이터 가공
    const statsMap: { [key: string]: number } = {};

    logs.forEach(log => {
        let key = "";
        const dateObj = new Date(log.recordDate);

        if (period === "daily") {
            //  뒤에 ?? "" 를 붙여서 undefined가 절대 안 나오게 방어합니다!
            key = dateObj.toISOString().split("T")[0] ?? "";
        } else if (period === "weekly") {
            //  여기도 똑같이 ?? "" 안전장치 추가!
            key = dateObj.toISOString().split("T")[0] ?? "";
        } else if (period === "monthly") {
            key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
        }

        statsMap[key] = (statsMap[key] || 0) + log.amount;
    });

    // 5. 객체를 배열 구조로 변환
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
