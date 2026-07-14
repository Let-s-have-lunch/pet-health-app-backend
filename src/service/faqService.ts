// @ts-ignore
import { PrismaClient, Faq } from "@prisma/client";

const prisma = new PrismaClient();

// 커스텀 에러 클래스
class AppError extends Error {
    constructor(public message: string, public status: number) {
        super(message);
    }
}

// 1. FAQ 상세 조회
const getFaqById = async (id: number): Promise<Faq> => {
    // 팀장님 스키마에 맞춰 isActive 조건 제거
    const faq = await prisma.faq.findUnique({ where: { id } });
    if (!faq) throw new AppError("해당 FAQ를 찾을 수 없습니다.", 404);
    return faq;
};

// 2. FAQ 목록 조회 (페이지네이션 반영)
const findAllFaqs = async (page: number = 1, size: number = 10): Promise<Faq[]> => {
    const skip = (page - 1) * size;
    const take = size;

    return await prisma.faq.findMany({
        orderBy: { createdAt: "desc" }, // 최신 등록순 정렬
        skip,
        take,
    });
};

// 3. FAQ 생성
const createFaq = async (question: string, answer: string): Promise<Faq> => {
    return await prisma.faq.create({
        data: {
            question,
            answer,
        },
    });
};

// 4. FAQ 수정
const updateFaq = async (id: number, question?: string, answer?: string): Promise<Faq> => {
    await getFaqById(id); // 존재 여부 확인

    const updateData = {
        ...(question && { question }),
        ...(answer && { answer }),
    };

    return await prisma.faq.update({
        where: { id },
        data: updateData,
    });
};

// 5. FAQ 삭제 (팀장님 스키마에 맞춘 진짜 삭제)
const deleteFaq = async (id: number): Promise<Faq> => {
    await getFaqById(id);
    return await prisma.faq.delete({
        where: { id },
    });
};

export default {
    getFaqById,
    findAllFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
};