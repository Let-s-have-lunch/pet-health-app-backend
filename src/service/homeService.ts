import prisma from "../config/prisma.ts";

/**
 * 🐕 Promise.all을 활용해 오늘 날짜의 산책, 몸무게, 물, 병원 기록을 한방에 병렬 조회
 */
const getPetDashboardWithPromiseAll = async (petId: number, dateStr: string) => {
    // 날짜 범위 설정 ("2026-07-14" -> 00:00:00 ~ 23:59:59)
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

    // 💡 Promise.all을 사용해 4개의 쿼리를 동시에 비동기로 병렬 조회!
    const [walkCount, latestWeight, waterSum, upcomingVet] = await Promise.all([
        // 1. 오늘 산책 횟수 카운트
        prisma.walkLog.count({
            where: { petId, createdAt: { gte: startOfDay, lte: endOfDay } },
        }),
        // 2. 가장 최근 몸무게 (실제 측정일인 recordDate 기준!)
        prisma.weightLog.findFirst({
            where: { petId, deletedAt: null },
            orderBy: { recordDate: "desc" },
        }),
        // 3. 오늘 마신 물 총합 합산
        prisma.waterLog.aggregate({
            where: { petId, deletedAt: null, createdAt: { gte: startOfDay, lte: endOfDay } },
            _sum: { amount: true }, // 스키마에 따라 amount 또는 water 등으로 수정
        }),
        // 4. 예정된 가장 빠른 병원 기록 1개
        prisma.vetRecord.findFirst({
            where: { petId, deletedAt: null, visitDate: { gte: startOfDay } },
            orderBy: { visitDate: "asc" },
        }),
    ]);

    // 🎁 프론트엔드 DashboardData 인터페이스에 완벽하게 맞춰서 리턴!
    return {
        walk: {
            count: walkCount,
            date: dateStr, // 산책은 오늘 날짜 기준
        },
        weight: {
            value: latestWeight ? latestWeight.weight : 0,
            date: latestWeight ? latestWeight.recordDate : null, // 💡 실제 몸무게 측정일
        },
        water: {
            totalAmount: waterSum._sum?.amount || 0,
            date: dateStr, // 물도 오늘 날짜 기준
        },
        vetRecord: upcomingVet
            ? {
                  time: upcomingVet.visitDate, // 병원은 예약된 시간
                  purpose: upcomingVet.visitPurpose,
                  hospitalName: upcomingVet.hospitalName || "미지정 병원",
              }
            : null,
    };
};

export default {
    getPetDashboardWithPromiseAll,
};
