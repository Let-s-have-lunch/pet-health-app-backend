import prisma from "../config/prisma.ts";
import { CreateVetRecordInputType } from "../schemas/user/vetRecordSchema.ts";

// 반려동물 소유권 확인 (내부 헬퍼 함수)
const checkPetOwnership = async (userId: number, petId: number) => {
    const pet = await prisma.pet.findFirst({
        where: { id: petId, userId, deletedAt: null },
    });

    if (!pet) {
        throw new Error("PET_NOT_FOUND_OR_FORBIDDEN");
    }
};

// 1. 생성 (컨트롤러에서 보내는 3개 인자를 정확히 받도록 수정)
const createVetRecord = async (
    userId: number,
    data: CreateVetRecordInputType,
    imagePath: string | null,
) => {
    await checkPetOwnership(userId, data.petId);

    const input = {
        ...data,
        visitDate: new Date(data.visitDate),
        diagnosis: data.diagnosis ?? null,
        treatment: data.treatment ?? null,
        cost: data.cost ?? null,
        receiptImage: imagePath, // 💡 컨트롤러에서 받은 경로 사용
        memo: data.memo ?? null,
    };

    return prisma.vetRecord.create({
        data: input,
    });
};

// 2. 반려동물별 전체 조회
const getVetRecordsByPetId = async (userId: number, petId: number) => {
    await checkPetOwnership(userId, petId);

    return prisma.vetRecord.findMany({
        where: { petId, deletedAt: null },
        orderBy: { visitDate: "desc" },
    });
};

// 3. 단일 상세 조회
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

// 4. 수정 (이전 코드 그대로 유지)
const updateVetRecord = async (userId: number, id: number, data: CreateVetRecordInputType) => {
    await getVetRecordById(userId, id);

    const input = {
        ...data,
        visitDate: new Date(data.visitDate),
        diagnosis: data.diagnosis ?? null,
        treatment: data.treatment ?? null,
        cost: data.cost ?? null,
        receiptImage: data.receiptImage ?? null, // 기존 로직 유지
        memo: data.memo ?? null,
    };

    return prisma.vetRecord.update({
        where: { id },
        data: input,
    });
};

// 5. 삭제 (소프트 딜리트)
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
