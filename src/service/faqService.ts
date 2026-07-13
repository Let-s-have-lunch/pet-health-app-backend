// @ts-ignore
import { PrismaClient, Faq } from "@prisma/client";

const prisma = new PrismaClient();

// 💡 반려동물 도메인 핵심 키워드들을 상수로 정의합니다.
// 이 리스트가 우리 서비스의 핵심 '반려동물 FAQ 분류'가 됩니다.
export const VALID_PET_CATEGORIES = [
    'HEALTH',    // 건강/질병
    'NUTRITION', // 영양/사료
    'BEHAVIOR',  // 훈련/행동
    'GROOMING',  // 위생/미용
    `ADOPTION`, //  추가
    `WALKING`, //   추가
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

const getFaqById = async (id: number): Promise<Faq> => {
    const faq = await prisma.faq.findUnique({ where: { id } });
    if (!faq) {
        const error = new Error("해당 FAQ를 찾을 수 없습니다.") as any;
        error.status = 404;
        throw error;
    }
    return faq;
};

const findAllFaqs = async (category?: string): Promise<Faq[]> => {
    return await prisma.faq.findMany({
        where: category ? { category } : {},
        orderBy: { id: "desc" },
    });
};

const createFaq = async (data: CreateFaqDto, answer: any, category: any): Promise<> => {
    // 💡 반려동물 서비스 규칙 검증
    if (!VALID_PET_CATEGORIES.includes(data.category)) {
        throw new Error("유효하지 않은 반려동물 카테고리입니다.");
    }
    return await prisma.faq.create({
        data: {
            question: data.question,
            answer: data.answer,
            category: data.category
        },
    });
};

const updateFaq = async (id: number, data: UpdateFaqDto, answer: any, category: any): Promise<> => {
    await getFaqById(id);

    // 💡 수정 시에도 카테고리가 들어온다면 검증
    if (data.category && !VALID_PET_CATEGORIES.includes(data.category)) {
        throw new Error("유효하지 않은 반려동물 카테고리입니다.");
    }

    return await prisma.faq.update({
        where: { id },
        data: {
            question: data.question,
            answer: data.answer,
            category: data.category
        },
    });
};

const deleteFaq = async (id: number): Promise<Faq> => {
    await getFaqById(id);
    return await prisma.faq.delete({ where: { id } });
};

export default {
    getFaqById,
    findAllFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
};