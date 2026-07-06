import { PrismaClient } from "@prisma/client";

// 전문가의 팁: DB 인스턴스를 모듈 상단에 생성하여 재사용합니다.
const prisma = new PrismaClient();

const faqService = {
    /**
     * FAQ 목록을 조건별로 조회합니다.
     * @param {string} [category] - 필터링할 카테고리 (선택 사항)
     * @returns {Promise<Array>} FAQ 데이터 배열
     */
    findAllFaqs: async (category: string): Promise<Array<any>> => {
        try {
            return await prisma.faq.findMany({
                where: {
                    isActive: true,
                    ...(category && { category }),
                },
                select: {
                    id: true,
                    question: true,
                    category: true,
                    displayOrder: true,
                },
                orderBy: { displayOrder: "asc" },
            });
        } catch (error) {
            console.error("FAQ 목록 조회 오류:", error);
            throw new Error("데이터를 가져오는 중 문제가 발생했습니다.");
        }
    },

    /**
     * 특정 FAQ 상세 조회 및 조회수 증가 트랜잭션
     * @param {number|string} id - FAQ 식별자
     * @returns {Promise<Object>} FAQ 상세 데이터
     */
    findFaqById: async (id: number | string): Promise<object> => {
        const faqId = Number(id);
        if (isNaN(faqId)) throw new Error("유효하지 않은 ID입니다.");

        return await prisma.$transaction(
            async (tx: {
                faq: {
                    findUnique: (arg0: { where: { id: number; isActive: boolean } }) => any;
                    update: (arg0: {
                        where: { id: number };
                        data: { displayOrder: { increment: number } };
                    }) => any;
                };
            }) => {
                const faq = await tx.faq.findUnique({
                    where: { id: faqId, isActive: true },
                });

                if (!faq) {
                    const error = new Error("FAQ를 찾을 수 없습니다.");
                    // Object.assign을 사용하면 객체 속성을 안전하게 확장합니다.
                    Object.assign(error, { status: 404 });
                    throw error;
                }

                // 조회수 증가 로직 (비즈니스 로직에 따라 확장 가능)
                await tx.faq.update({
                    where: { id: faqId },
                    data: { displayOrder: { increment: 1 } },
                });

                return faq;
            },
        );
    },
};

export default faqService;