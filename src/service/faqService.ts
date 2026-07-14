// @ts-ignore
import { PrismaClient, Faq } from "@prisma/client";

const prisma = new PrismaClient();

class AppError extends Error {
    constructor(public message: string, public status: number) {
        super(message);
    }
}

// 상세 조회
const getFaqById = async (id: number): Promise<Faq> => {
    const faq = await prisma.faq.findUnique({ where: { id } });
    if (!faq) throw new AppError("해당 FAQ를 찾을 수 없습니다.", 404);
    return faq;
};

// 목록 조회 (페이지네이션)
const findAllFaqs = async (page: number = 1, size: number = 10): Promise<Faq[]> => {
    const skip = (page - 1) * size;
    const take = size;

    return await prisma.faq.findMany({
        orderBy: { createdAt: "desc" }, // 최신순 정렬
        skip,
        take,
    });
};

// 생성
const createFaq = async (question: string, answer: string): Promise<Faq> => {
    return await prisma.faq.create({
        data: { question, answer },
    });
};

// 수정
const updateFaq = async (id: number, question?: string, answer?: string): Promise<Faq> => {
    await getFaqById(id);
    const updateData = {
        ...(question && { question }),
        ...(answer && { answer }),
    };
    return await prisma.faq.update({
        where: { id },
        data: updateData,
    });
};

// 삭제 (진짜 삭제)
const deleteFaq = async (id: number): Promise<Faq> => {
    await getFaqById(id);
    return await prisma.faq.delete({ where: { id } });
};

export default { getFaqById, findAllFaqs, createFaq, updateFaq, deleteFaq };