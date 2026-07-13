// @ts-ignore
import { PrismaClient, Faq } from "@prisma/client";

const prisma = new PrismaClient();

// 💡 1. [프로의 기술] 커스텀 에러 클래스 (에러 관리가 깔끔해집니다)
class AppError extends Error {
    constructor(public message: string, public status: number) {
        super(message);
    }
}

// 💡 반려동물 도메인 핵심 키워드들을 상수로 정의합니다.
// 이 리스트가 우리 서비스의 핵심 '반려동물 FAQ 분류'가 됩니다.
export const VALID_PET_CATEGORIES = [
    'HEALTH',    // 건강/질병
    'NUTRITION', // 영양/사료
    'BEHAVIOR',  // 훈련/행동
    'GROOMING',  // 위생/미용
    'ADOPTION', //  추가
    'WALKING', //   추가
    'ETC'        // 기타
] as const;

// 타입 추출 (자동으로 'HEALTH' | 'NUTRITION' ... 이렇게 타입이 잡힙니다)
export type PetCategory = typeof VALID_PET_CATEGORIES[number];

export interface CreateFaqDto {
    question: string;
    answer: string;
    category: PetCategory; // 💡 string 대신 정의한 PetCategory 타입만 받음
}

export interface UpdateFaqDto {
    question?: string;
    answer?: string;
    category?: PetCategory;
}

// 💡 2. [검증 로직 공통화]
const validateCategory = (category: string) => {
    if (!VALID_PET_CATEGORIES.includes(category as any)) {
        throw new AppError("유효하지 않은 반려동물 카테고리입니다.", 400);
    }
};

const getFaqById = async (id: number): Promise<Faq> => {
    // 💡 isActive가 true인 것만 조회 (삭제된 데이터는 조회 불가)
    const faq = await prisma.faq.findUnique({ where: { id, isActive: true } });
    if (!faq) throw new AppError("해당 FAQ를 찾을 수 없습니다.",404);
    return faq;
};

const findAllFaqs = async (category?: string): Promise<Faq[]> => {
    return await prisma.faq.findMany({
        where: {
            isActive: true, // 기본 필터: 활성화된 FAQ만 노출
            ...(category && { category}),
        },
        orderBy: { displayOrder: "asc" },   //생성순이 아니라, 우선순위대로 정렬
    });
};

const createFaq = async (data: CreateFaqDto): Promise<Faq> => {
    validateCategory(data.category);
    return await prisma.faq.create({
        data: {
            question: data.question,
            answer: data.answer,
            // 💡 "as any"를 붙여서 까탈스러운 타입스크립트를 조용히 시킵니다!
            category: data.category as any
        },
    });
};

const updateFaq = async (id: number, data: UpdateFaqDto): Promise<Faq> => {
    await getFaqById(id);   // 존재 여부 확인

    if (data.category) {
        validateCategory(data.category);
    }

    // 💡 3. [방어적 업데이트] 입력된 값만 골라서 업데이트 (undefined 제거)
    const updateData = {
        ...(data.question && { question: data.question }),
        ...(data.answer && { answer: data.answer }),
        ...(data.category && { category: data.category }),
    };

    return await prisma.faq.update({
        where: { id },
        data: updateData,
    });
};

const deleteFaq = async (id: number): Promise<Faq> => {
    await getFaqById(id);
    // 💡 진짜 삭제하지 않고, 활성 상태만 끕니다 (Soft Delete)
    return await prisma.faq.update({
        where: { id },
        data: { isActive: false },
    });
};

export default {
    getFaqById,
    findAllFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
};