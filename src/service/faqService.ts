import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getFaqById = async (id) => {
    const faq = await prisma.faq.findUnique({
        where: { id: Number(id) },
    });
    if (!faq) {
        const error = new Error("FAQ를 찾을 수 없습니다.");
        error.status = 404; // 나중에 컨트롤러에서 바로 쓰기 위함
        throw error;
    }
    return faq;
};

const findAllFaqs = async (category) => {
    return await prisma.faq.findMany({
        where: {
            ...(category && { category }), // category가 있으면 필터링
        },
        orderBy: { id: "desc" },
    });
};

const createFaq = async (question, answer, category) => {
    return await prisma.faq.create({
        data: { question, answer, category },
    });
};

const updateFaq = async (id, question, answer, category) => {
    await getFaqById(id); // 먼저 있는지 확인
    return await prisma.faq.update({
        where: { id: Number(id) },
        data: { question, answer, category },
    });
};

const deleteFaq = async (id) => {
    await getFaqById(id); // 먼저 있는지 확인
    return await prisma.faq.delete({
        where: { id: Number(id) },
    });
};

export default {
    getFaqById,
    findAllFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
};