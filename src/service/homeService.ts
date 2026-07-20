import prisma from "../config/prisma.ts";

const getPetDashboardWithPromiseAll = async (petId: number, dateStr: string) => {
    const targetDate = new Date(dateStr);
    const startOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        0,
        0,
        0,
    );
    const endOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        23,
        59,
        59,
    );

    const [walkCount, latestWeight, waterSum, lastVetVisit] = await Promise.all([
        prisma.walkLog.count({
            where: { petId, walkDate: { gte: startOfDay, lte: endOfDay } },
        }),
        prisma.weightLog.findFirst({
            where: { petId, deletedAt: null },
            orderBy: { recordDate: "desc" },
        }),
        prisma.waterLog.aggregate({
            where: { petId, deletedAt: null, recordDate: { gte: startOfDay, lte: endOfDay } },
            _sum: { amount: true },
        }),
        prisma.vetRecord.findFirst({
            where: { petId, deletedAt: null, visitDate: { lte: endOfDay } },
            orderBy: { visitDate: "desc" },
        }),
    ]);

    return {
        walk: {
            count: walkCount,
            date: dateStr,
        },
        weight: {
            value: latestWeight ? latestWeight.weight : 0,
            date: latestWeight ? latestWeight.recordDate : null,
        },
        water: {
            totalAmount: waterSum._sum?.amount || 0,
            date: dateStr,
        },
        vetRecord: lastVetVisit
            ? {
                  time: lastVetVisit.visitDate,
                  purpose: lastVetVisit.visitPurpose,
                  hospitalName: lastVetVisit.hospitalName || "미지정 병원",
              }
            : null,
    };
};

export default {
    getPetDashboardWithPromiseAll,
};
