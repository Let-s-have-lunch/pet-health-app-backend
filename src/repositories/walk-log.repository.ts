import prisma from "../config/prisma.ts";
import { CreateWalkLogDto } from "../dto/walk-log.dto.ts";

export const createWalkLog = async (data: CreateWalkLogDto) => {
     await prisma.walkLog.create({
        data: {
            petId: data.petId,
            distance: data.distance ?? 0,
            duration: data.duration,

            walkDate: new Date(),
            startTime: new Date(),
            endTime: new Date(),
        },
    });0
};
