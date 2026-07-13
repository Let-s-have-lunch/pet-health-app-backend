import { prisma } from "@/lib/prisma";

// [생성] 새로운 반려동물 FAQ 등록 (예: "강아지 예방접종 시기 안내")
export const createFaq = async (title: string, content: string) => {
    return await prisma.faq.create({
        data: {
            title: title,
            content: content,
        },
    });
};

// [수정] 기존 반려동물 FAQ 정보 변경 (예: 사료 급여량 수정 등)
export const updateFaq = async (id: string | number, title: string, content: string) => {
    const faqId = Number(id);

    // 💡 방어벽 설치: 수정하려는 FAQ가 진짜 DB에 존재하는지 먼저 확인!
    const exists = await prisma.faq.findUnique({ where: { id: faqId } });
    if (!exists) {
        throw new Error("수정하려는 해당 반려동물 FAQ 글을 찾을 수 없습니다.");
    }

    return await prisma.faq.update({
        where: { id: faqId },
        data: { title, content },
    });
};

// [삭제] 불필요해진 FAQ 데이터 지우기
export const deleteFaq = async (id: string | number) => {
    const faqId = Number(id);

    // 💡 방어벽 설치: 이미 지워졌거나 없는 글을 또 지우려고 할 때 에러 차단!
    const exists = await prisma.faq.findUnique({ where: { id: faqId } });
    if (!exists) {
        throw new Error("삭제하려는 해당 반려동물 FAQ 글이 존재하지 않습니다.");
    }

    return await prisma.faq.delete({
        where: { id: faqId },
    });
};