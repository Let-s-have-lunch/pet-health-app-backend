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

// 1. 생성 (여기서 에러가 나던 부분을 해결했습니다!)
const createVetRecord = async (userId: number, data: CreateVetRecordInputType) => {
    await checkPetOwnership(userId, data.petId);

    // 💡 C님의 walkLog 방식 그대로, undefined일 수 있는 모든 필드에 ?? null 을 붙여줍니다.
    const input = {
        ...data,
        visitDate: new Date(data.visitDate),
        diagnosis: data.diagnosis ?? null,
        treatment: data.treatment ?? null,
        cost: data.cost ?? null,
        receiptImage: data.receiptImage ?? null,
        memo: data.memo ?? null,
    };

    return prisma.vetRecord.create({
        data: input, // 👈 이제 타입이 완벽히 맞아떨어져서 빨간줄이 사라집니다!
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

// 4. 수정 (생성과 동일하게 ?? null 처리)
const updateVetRecord = async (userId: number, id: number, data: CreateVetRecordInputType) => {
    await getVetRecordById(userId, id);

    const input = {
        ...data,
        visitDate: new Date(data.visitDate),
        diagnosis: data.diagnosis ?? null,
        treatment: data.treatment ?? null,
        cost: data.cost ?? null,
        receiptImage: data.receiptImage ?? null,
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
