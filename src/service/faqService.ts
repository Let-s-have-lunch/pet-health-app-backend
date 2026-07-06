const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const faqService = {
    // 모든 활성화된 FAQ 조회
    findAllFaqs: async () => {
        return await prisma.faq.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
        });
    },

    // ID로 단건 조회
    findFaqById: async id => {
        return await prisma.faq.findUnique({
            where: { id: Number(id) },
        });
    },
};

module.exports = faqService;
