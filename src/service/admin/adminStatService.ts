import prisma from "../../config/prisma.ts";

const getVisitPurposeStats = async (year: string) => {
    // 1. 입력받은 연도의 1월 1일 00:00:00과 12월 31일 23:59:59 범위를 계산합니다.
    const parsedYear = parseInt(year, 10);
    const startDate = new Date(parsedYear, 0, 1, 0, 0, 0); // 1월 1일
    const endDate = new Date(parsedYear, 11, 31, 23, 59, 59); // 12월 31일

    // 2. Prisma의 groupBy를 사용해 방문 목적(visitPurpose)별로 그룹화하고 개수(_count)를 셉니다.
    const groupResults = await prisma.vetRecord.groupBy({
        by: ["visitPurpose"], // visitPurpose 필드를 기준으로 그룹을 묶습니다.
        where: {
            deletedAt: null, // 삭제되지 않은 정상 데이터만 타겟팅
            visitDate: {
                // 해당 연도 범위 내의 기록만 필터링
                gte: startDate,
                lte: endDate,
            },
        },
        _count: {
            visitPurpose: true, // 그룹별로 데이터가 몇 개씩 있는지 카운트합니다.
        },
    });

    // 3. 비율(%) 계산을 위해 해당 연도의 전체 방문 기록 총합을 구합니다.
    // 초급자용으로 쉽게 이해하도록 배열의 각 카운트 값을 누적해서 더해줄게요.
    let totalCount = 0;
    groupResults.forEach(item => {
        totalCount += item._count.visitPurpose;
    });

    // 4. 프론트엔드 대시보드 그래프가 그리기 좋은 깔끔한 배열 형태로 가공합니다.
    const chartData = groupResults.map(item => {
        const count = item._count.visitPurpose;
        // 전체 카운트가 0이 아닐 때만 비율을 계산하고 소수점 첫째 자리까지 표기합니다. (예: 25.5%)
        const percentage = totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(1)) : 0;

        return {
            purpose: item.visitPurpose, // 방문 목적명 (예: 예방접종, 정기검진)
            count: count, // 방문 횟수
            percentage: percentage, // 전체 중 차지하는 비율
        };
    });

    // 5. 프론트엔드가 대시보드 상단에 띄울 수 있게 총합과 가공 데이터를 함께 리턴합니다.
    return {
        targetYear: parsedYear,
        totalCount: totalCount,
        chartData: chartData,
    };
};

const getVetCostAverage = async (year: string) => {
    const parsedYear = parseInt(year, 10);
    const startDate = new Date(parsedYear, 0, 1, 0, 0, 0);
    const endDate = new Date(parsedYear, 11, 31, 23, 59, 59);

    // 💡 Prisma의 aggregate 기능을 사용해 특정 필드의 평균(_avg)을 뽑아냅니다.
    // aggregate DB 안에서 평균이나 개수를 초고속으로 계산해서 결과만 쏙 받아 오고 싶을떄 쓰는 함수
    const aggregation = await prisma.vetRecord.aggregate({
        where: {
            deletedAt: null,
            visitDate: {
                gte: startDate,
                lte: endDate,
            },
        },
        _avg: {
            cost: true, // 👈 VetRecord 테이블의 진료비(cost) 필드의 평균을 구하라고 명령!
        },
        _count: {
            cost: true, // 통계의 신뢰도를 위해 총 몇 건의 지출 건수였는지도 함께 조사합니다.
        },
    });

    // 만약 데이터가 없으면 평균값이 null로 나오므로, 안전하게 0으로 처리해 줍니다.
    const averageCost = aggregation._avg.cost ? Math.round(aggregation._avg.cost) : 0; // 원 단위 절사를 위해 반올림(Math.round) 처리

    return {
        targetYear: parsedYear,
        totalRecords: aggregation._count.cost, // 총 진료 기록 건수
        averageCost: averageCost, // 계산된 평균 진료비 (예: 45200원)
    };
};

/*
  3. 어드민: 특정 연도의 전체 유저 평균 산책 시간 추출
 */
const getWalkDurationAverage = async (year: string) => {
    const parsedYear = parseInt(year, 10);
    const startDate = new Date(parsedYear, 0, 1, 0, 0, 0);
    const endDate = new Date(parsedYear, 11, 31, 23, 59, 59);

    //  walkLog 테이블에서 산책 시간(duration)의 평균을 집계합니다.
    const aggregation = await prisma.walkLog.aggregate({
        where: {
            deletedAt: null,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        _avg: {
            duration: true, // 평균 산책 시간(분) 계산
        },
        _count: {
            id: true, // 총 산책 횟수 계산
        },
    });

    const averageDuration = aggregation._avg.duration ? Math.round(aggregation._avg.duration) : 0;

    return {
        targetYear: parsedYear,
        totalWalks: aggregation._count.id,
        averageDuration: averageDuration, // 단위: 분
    };
};

export default {
    getVisitPurposeStats,
    getVetCostAverage,
    getWalkDurationAverage,
};
