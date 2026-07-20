import prisma from "../config/prisma.ts";
import { CreateVetRecordInputType } from "../schemas/vetRecord/vetRecordSchema.ts";
import { VetRecordCreateInput } from "../generated/prisma/models.ts";

const checkPetOwnership = async (userId: number, petId: number) => {
    const pet = await prisma.pet.findFirst({
        where: { id: petId, userId, deletedAt: null },
    });

    if (!pet) {
        throw new Error("PET_NOT_FOUND_OR_FORBIDDEN");
    }
};

const createVetRecord = async (
    userId: number,
    data: CreateVetRecordInputType,
    imagePath: string | null,
) => {
    await checkPetOwnership(userId, data.petId);

    const input: VetRecordCreateInput = {
        hospitalName: data.hospitalName,
        visitPurpose: data.visitPurpose,
        visitDate: new Date(data.visitDate),
        diagnosis: data.diagnosis ?? null,
        treatment: data.treatment ?? null,
        cost: data.cost ? data.cost : 0,
        receiptImage: imagePath,
        memo: data.memo ?? null,
        pet: {
            connect: {
                id: data.petId,
            },
        },
    };

    return prisma.vetRecord.create({
        data: input,
    });
};

const getVetRecordsByPetId = async (userId: number, petId: number) => {
    await checkPetOwnership(userId, petId);

    return prisma.vetRecord.findMany({
        where: { petId, deletedAt: null },
        orderBy: { visitDate: "desc" },
    });
};

const getVetRecordById = async (userId: number, id: number) => {
    const record = await prisma.vetRecord.findFirst({
        where: { id, deletedAt: null },
        include: { pet: true },
    });

    if (!record || record.pet.userId !== userId) {
        throw new Error("VET_RECORD_NOT_FOUND_OR_FORBIDDEN");
    }

    return record;
};

const updateVetRecord = async (
    userId: number,
    id: number,
    data: CreateVetRecordInputType,
    imagePath?: string | null
) => {
    await getVetRecordById(userId, id);

    const input: any = {
        ...data,
        visitDate: new Date(data.visitDate),
        diagnosis: data.diagnosis ?? null,
        treatment: data.treatment ?? null,
        cost: data.cost ?? null,
        memo: data.memo ?? null,
    };

    if (imagePath) {
        input.receiptImage = imagePath;
    }

    return prisma.vetRecord.update({
        where: { id },
        data: input,
    });
};

const deleteVetRecord = async (userId: number, id: number) => {
    await getVetRecordById(userId, id);

    return prisma.vetRecord.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};

export default {
    createVetRecord,
    getVetRecordsByPetId,
    getVetRecordById,
    updateVetRecord,
    deleteVetRecord,
};
