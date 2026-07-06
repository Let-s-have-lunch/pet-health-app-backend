import prisma from "../config/prisma.ts";
import {
    CreateWeightLogInputType,
    UpdateWeightLogInputType,
} from "../schemas/user/weightLogSchema.ts";

// 반려동물 소유권 확인 헬퍼
const checkPetOwnership = async (userId: number, petId: number) => {
    const pet = await prisma.pet.findFirst({
        where: { id: petId, userId, deletedAt: null },
    });
    if (!pet) {
        throw new Error("PET_NOT_FOUND_OR_FORBIDDEN");
    }
};

// 1. 생성
const createWeightLog = async (userId: number, data: CreateWeightLogInputType) => {
    await checkPetOwnership(userId, data.petId);

    const input = {
        ...data,
        recordDate: new Date(data.recordDate),
        memo: data.memo ?? null, //  undefined를 null로 가공
    };

    return prisma.weightLog.create({
        data: input,
    });
};

// 2. 반려동물별 전체 조회
const getWeightLogsByPetId = async (userId: number, petId: number) => {
    await checkPetOwnership(userId, petId);

    return prisma.weightLog.findMany({
        where: { petId, deletedAt: null },
        orderBy: { recordDate: "desc" },
    });
};

// 3. 단일 상세 조회
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

// 4. 수정
const updateWeightLog = async (userId: number, id: number, data: UpdateWeightLogInputType) => {
    await getWeightRecordById(userId, id);

    const input = {
        ...data,
        recordDate: new Date(data.recordDate),
        memo: data.memo ?? null,
    };

    return prisma.weightLog.update({
        where: { id },
        data: input,
    });
};

// 5. 삭제 (소프트 딜리트)
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

    // 1. 소유권 검증
    await checkPetOwnership(userId, petId);

    const targetDate = new Date(baseDate);
    const startDate = new Date(targetDate);

    // 2. 통계 기간 분기 처리 (💡 if-else 대신 switch 문으로 완벽하게 위장!)
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

    // 3. 프리즈마 범위 조회
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

    // 4. 평균 몸무게 집계 가공
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

    // 5. 객체를 배열 구조로 변환
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
