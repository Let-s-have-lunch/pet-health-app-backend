const prisma = require("../prismaClient"); // Prisma 클라이언트

const faqService = {
    // 1. 전체 목록 조회 (카테고리 필터링)
    findAllFaqs: async category => {
        const query = category ? { where: { category_id: parseInt(category) } } : {};
        return await prisma.faqs.findMany(query);
    },

    // 2. 상세 조회 + 조회수 증가
    getFaqWithAnswer: async id => {
        // 조회수 증가
        await prisma.faq_stats.update({
            where: { faq_id: id },
            data: { view_count: { increment: 1 } },
        });

        // FAQ 상세 + 답변 + 태그 조회
        return await prisma.faqs.findUnique({
            where: { id: id },
            include: {
                faq_answers: true,
                faq_tags: true,
            },
        });
    },

    // 3. 피드백 추가
    addFeedback: async (id, isHelpful) => {
        return await prisma.faq_feedback.create({
            data: {
                faq_id: id,
                is_helpful: isHelpful,
                feedback_date: new Date(),
            },
        });
    },
};

module.exports = faqService;
