import faqService from "../service/faqService.ts";

const faqController = {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    getFaqs: async (req, res) => {
        try {
            const { category } = req.query;
            const faqs = await faqService.findAllFaqs(
                typeof category === "string" ? category : undefined
            );

            return res.status(200).json({ success: true, data: faqs });
        } catch (error) {
            console.error("[FaqController.getFaqs Error]:", error.message);
            return res.status(500).json({
                success: false,
                message: "서버 내부 오류가 발생했습니다."
            });
        }
    },

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    getFaqDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const faq = await faqService.findFaqById(id);

            return res.status(200).json({ success: true, data: faq });
        } catch (error) {
            const statusCode = error.status || 500;
            return res.status(statusCode).json({
                success: false,
                message: error.message,
            });
        }
    },
};

export default faqController;