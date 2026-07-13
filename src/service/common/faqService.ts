import { prisma } from "@/lib/prisma"; // 본인 프로젝트의 prisma 경로에 맞게 수정해주세요

// [공통] 1. FAQ 목록 전체 조회하기
export const getFaqList = async () => {
    // 집사(prisma)한테 창고에 있는 FAQ 다 가져오라고 시키고 기다림(await)
    const faqs = await prisma.faq.findMany({
        orderBy: { createdAt: "desc" }, // 최신순 정렬
    });
    return faqs;
};

// [공통] 2. FAQ 상세 조회하기 (아까 질문자님이 보여주신 코드!)
export const getFaqById = async (id: string | number) => {
    // 번호에 맞는 유일한 글 하나만 찾아오라고 시키고 기다림(await)
    const faq = await prisma.faq.findUnique({
        where: { id: Number(id) },
    });
    return faq;
};
