import { WalkLogInputType } from "../schemas/walkLog/walkLogSchema.ts";
import prisma from "../config/prisma.ts";

const verifyPetOwnership = async (petId: number, userId: number) => {
    const pet = await prisma.pet.findUnique({ where: { id: petId } });

    if (!pet) throw new Error("NOT_FOUND_PET");
    if (pet.userId !== userId) throw new Error("FORBIDDEN");
};

const verifyWalkLogOwnerShip = async (walkLogId: number, userId: number) => {
    const walkLog = await prisma.walkLog.findUnique({
        where: { id: walkLogId },
        include: {
            pet: true,
        },
    });

    if (!walkLog) throw new Error("NOT_FOUND_WALKLOG");
    if (walkLog.pet.userId !== userId) throw new Error("FORBIDDEN");
};

const createWalkLog = async (petId: number, userId: number, walkLogData: WalkLogInputType) => {
    await verifyPetOwnership(petId, userId);

    return prisma.walkLog.create({
        data: {
            petId,
            walkDate: new Date(walkLogData.walkDate),
            duration: walkLogData.duration,
            memo: walkLogData.memo ?? null,
        },
    });
};

const updateWalkLog = async (walkLogId: number, userId: number, walkLogData: WalkLogInputType) => {
    await verifyWalkLogOwnerShip(walkLogId, userId);

    return prisma.walkLog.update({
        where: {
            id: walkLogId,
        },
        data: {
            walkDate: new Date(walkLogData.walkDate),
            duration: walkLogData.duration,
            memo: walkLogData.memo ?? null,
        },
    });
};

const getWalkLogs = async (petId: number, userId: number) => {
    await verifyPetOwnership(petId, userId);

    return prisma.walkLog.findMany({
        where: {
            petId,
        },
        orderBy: [{ walkDate: "desc" }, { createdAt: "desc" }],
    });
};

const deleteWalkLog = async (walkLogId: number, userId: number) => {
    await verifyWalkLogOwnerShip(walkLogId, userId);

    return prisma.walkLog.delete({
        where: {
            id: walkLogId,
        },
    });
};

const getWalkLogStats = async (
    petId: number,
    userId: number,
    queryStartDate?: string,
    queryEndDate?: string,
) => {
    await verifyPetOwnership(petId, userId);

    const end = queryEndDate ? new Date(queryEndDate) : new Date();
    const start = queryStartDate
        ? new Date(queryStartDate)
        : new Date(new Date().setDate(end.getDate() - 6));

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const logs = await prisma.walkLog.findMany({
        where: {
            petId,
            walkDate: {
                gte: start,
                lte: end,
            },
        },
        orderBy: { walkDate: "asc" },
    });

    let totalDuration = 0;
    const dailyStats: Record<string, { date: string; walks: number; duration: number }> = {};

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0] as string;
        dailyStats[dateStr] = { date: dateStr, walks: 0, duration: 0 };
    }

    for (const log of logs) {
        totalDuration += log.duration;
        const dateStr = log.walkDate.toISOString().split("T")[0] as string;

        if (dailyStats[dateStr]) {
            dailyStats[dateStr].walks += 1;
            dailyStats[dateStr].duration += log.duration;
        }
    }

    return {
        summary: {
            totalWalks: logs.length,
            totalDuration,
        },
        graphData: Object.values(dailyStats),
    };
};

export default { createWalkLog, updateWalkLog, getWalkLogs, deleteWalkLog, getWalkLogStats };
