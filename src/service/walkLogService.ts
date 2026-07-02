import { PrismaClient } from "@prisma/client";

const prisma = PrismaClient();

export class WalkLogService {
    // 산책 기록 생성
    createLog = async (userId: number, distance: number, time: number) => {
        return await prisma.walkLog.create({
            data: {
                userId,
                distance,
                time
            },
        });
    };

    // 내 기록들 가져오기
    getMyLogs = async (userId: number) => {
        return await prisma.walkLog.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    };
}
