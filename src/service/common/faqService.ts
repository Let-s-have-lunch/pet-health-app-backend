import { prisma } from "@/lib/prisma";

// [공통] 1. FAQ 목록 전체 조회하기 (반려동물 맞춤형 자동 검색 엔진 탑재!)
export const getFaqList = async (keyword?: string) => {
    // 집사(prisma)한테 창고에 있는 FAQ 다 가져오라고 시키는데,
    // "사료", "접종", "병원" 같은 반려동물 키워드 검색어가 들어오면 알아서 필터링해서 쏙 골라옵니다!
    const faqs = await prisma.faq.findMany({
        where: keyword ? {
            OR: [
                { title: { contains: keyword } },   // 제목에 "슬개골"이 포함되거나
                { content: { contains: keyword } } // 내용에 "슬개골"이 포함된 모든 글 찾기
            ]
        } : {}, // 검색어가 없으면 평소처럼 전체 다 가져옵니다.
        orderBy: { createdAt: "desc" }, // 댕냥이 보호자들에게 언제나 따끈따끈한 최신순 정렬!
    });
    return faqs;
};

// [공통] 2. FAQ 상세 조회하기
export const getFaqById = async (id: string | number) => {
    // 번호에 맞는 유일한 반려동물 FAQ 글 하나만 찾아오라고 시키고 기다림(await)
    const faq = await prisma.faq.findUnique({
        where: { id: Number(id) },
    });
    return faq;
};