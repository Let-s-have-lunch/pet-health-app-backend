import prisma from "../config/prisma.ts";

/**
 * 🐕 Promise.all을 활용해 오늘 날짜의 산책, 몸무게, 물, 병원 기록을 한방에 병렬 조회
 */
  const getPetDashboardWithPromiseAll = async (petId: number, dateStr: string) => {
    // 날짜 범위 설정 ("2026-07-01" -> 00:00:00 ~ 23:59:59)
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

    // 💡 Promise.all을 사용해 4개의 쿼리를 동시에 비동기로 때려박습니다! (속도 대폭 상승🚀)
    const [walkCount, latestWeight, waterSum, upcomingVet] = await Promise.all([
        // 1. 오늘 산책 횟수 카운트
        prisma.walkLog.count({
            where: { petId, deletedAt: null, createdAt: { gte: startOfDay, lte: endOfDay } },
        }),
        // 2. 가장 최근 몸무게 기록 1개
        prisma.weightLog.findFirst({
            where: { petId, deletedAt: null },
            orderBy: { createdAt: "desc" },
        }),
        // 3. 오늘 마신 물 총합 합산
        prisma.waterLog.aggregate({
            where: { petId, deletedAt: null, createdAt: { gte: startOfDay, lte: endOfDay } },
            _sum: { amount: true }, // 스키마에 정의된 물 양 필드명 확인 필요 (보통 amount나 water)
        }),
        // 4. 예정된 가장 빠른 병원 기록 1개
        prisma.vetRecord.findFirst({
            where: { petId, deletedAt: null, visitDate: { gte: startOfDay } },
            orderBy: { visitDate: "asc" },
        }),
    ]);

    // 🎁 조립해서 프론트엔드가 요구하는 UI 포맷팅으로 응답 데이터 리턴
    return {
        date: dateStr,
        walk: {
            count: walkCount,
        },
        weight: {
            value: latestWeight ? latestWeight.weight : 0,
        },
        water: {
            totalAmount: waterSum._sum.amount || 0,
        },
        vetRecord: upcomingVet
            ? {
                  time: upcomingVet.visitDate,
                  purpose: upcomingVet.visitPurpose,
                  hospitalName: upcomingVet.hospitalName || "미지정 병원",
              }
            : null,
    };
};

export default {
    getPetDashboardWithPromiseAll,
};
