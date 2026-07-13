import { prisma } from "@/lib/prisma";

// [생성] 새로운 FAQ 만들기
export const createFaq = async (title: string, content: string) => {
    const newFaq = await prisma.faq.create({
        data: {
            title: title,
            content: content,
        },
    });
    return newFaq;
};

// [수정] 기존 FAQ 내용 바꾸기
export const updateFaq = async (id: string | number, title: string, content: string) => {
    const updatedFaq = await prisma.faq.update({
        where: { id: Number(id) },
        data: {
            title: title,
            content: content,
        },
    });
    return updatedFaq;
};

// [삭제] 기존 FAQ 지우기
export const deleteFaq = async (id: string | number) => {
    const deletedFaq = await prisma.faq.delete({
        where: { id: Number(id) },
    });
    return deletedFaq;
};