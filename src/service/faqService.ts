// @ts-ignore
import { PrismaClient, Faq } from "@prisma/client";

const prisma = new PrismaClient();

// 커스텀 에러 클래스
class AppError extends Error {
    constructor(public message: string, public status: number) {
        super(message);
    }
}

// 반려동물 도메인 핵심 키워드 상수로 정의
export const VALID_PET_CATEGORIES = [
    'HEALTH',    // 건강/질병
    'NUTRITION', // 영양/사료
    'BEHAVIOR',  // 훈련/행동
    'GROOMING',  // 위생/미용
    'ADOPTION',  // 추가
    'WALKING',   // 추가
    'ETC'        // 기타
] as const;

export type PetCategory = typeof VALID_PET_CATEGORIES[number];

// [검증 로직 공통화]
const validateCategory = (category: string) => {
    if (!VALID_PET_CATEGORIES.includes(category as any)) {
        throw new AppError("유효하지 않은 반려동물 카테고리입니다.", 400);
    }
};

// 1. FAQ 상세 조회 (ID로 조회)
const getFaqById = async (id: number): Promise<Faq> => {
    const faq = await prisma.faq.findUnique({ where: { id, isActive: true } });
    if (!faq) throw new AppError("해당 FAQ를 찾을 수 없습니다.", 404);
    return faq;
};

// 2. FAQ 목록 조회 (💡 페이지네이션 로직 추가됨)
const findAllFaqs = async (category?: string, page: number = 1, size: number = 10): Promise<Faq[]> => {
    // 💡 Prisma에서 페이지네이션을 처리하기 위해 skip(건너뛸 개수)과 take(가져올 개수)를 계산합니다.
    const skip = (page - 1) * size;
    const take = size;

    return await prisma.faq.findMany({
        where: {
            isActive: true, // 활성화된 FAQ만 노출
            ...(category && { category }),
        },
        orderBy: { displayOrder: "asc" }, // 우선순위 정렬
        skip, // 💡 몇 개를 건너뛰고
        take, // 💡 몇 개를 가져올지 지정 (팀장님 요구사항 반영)
    });
};

// 3. FAQ 생성 (💡 컨트롤러와 맞게 인자 수정 및 문법 오류 해결)
const createFaq = async (question: string, answer: string, category: string): Promise<Faq> => {
    validateCategory(category);

    return await prisma.faq.create({
        data: {
            question,
            answer,
            category: category as any
        },
    });
};

// 4. FAQ 수정 (💡 컨트롤러와 맞게 인자 수정 및 방어적 업데이트 유지)
const updateFaq = async (id: number, question?: string, answer?: string, category?: string): Promise<Faq> => {
    await getFaqById(id); // 존재 여부 확인

    if (category) {
        validateCategory(category);
    }

    // 입력된 값만 골라서 업데이트 객체 생성
    const updateData = {
        ...(question && { question }),
        ...(answer && { answer }),
        ...(category && { category: category as any }),
    };

    return await prisma.faq.update({
        where: { id },
        data: updateData,
    });
};

// 5. FAQ 삭제 (Soft Delete)
const deleteFaq = async (id: number): Promise<Faq> => {
    await getFaqById(id);
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