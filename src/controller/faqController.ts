const faqService = require("../services/faq.service");

const faqController = {
    getFaqs: async (req, res) => {
        try {
            const faqs = await faqService.findAllFaqs();
            return res.status(200).json({ success: true, data: faqs });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getFaqDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const faq = await faqService.findFaqById(id);
            if (!faq)
                return res.status(404).json({ success: false, message: "FAQ를 찾을 수 없습니다." });

            return res.status(200).json({ success: true, data: faq });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = faqController;
