import prisma from "../config/prisma.ts";
import { CreateWalkLogInputType } from "../schemas/user/walkLog/createWalkLogSchema.ts";

const createWalkLog = async (data: CreateWalkLogInputType) => {
    const input = {
        ...data,
        distance: data.distance ?? null,
        memo: data.memo ?? null,
    };

    return prisma.walkLog.create({
        data: input,
    });
};

const getWalkLogById = async (id: number) => {
    const walkLog = await prisma.walkLog.findUnique({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!walkLog) {
        throw new Error("WALK_LOG_NOT_FOUND");
    }

    return walkLog;
};

const updateWalkLog = async (id: number, data: CreateWalkLogInputType) => {
    await getWalkLogById(id);
    const input = {
        ...data,
        distance: data.distance ?? null,
        memo: data.memo ?? null,
    };

    return prisma.walkLog.update({
        where: {
            id,
        },
        data: input,
    });
};

const deleteWalkLog = async (id: number) => {
    await getWalkLogById(id);

    return prisma.walkLog.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
};

export default {
    createWalkLog,
    getWalkLogById,
    updateWalkLog,
    deleteWalkLog,
};
