const faqService = require("../services/faq.service");

const faqController = {
    // 1. FAQ 상세 조회 요청 처리
    getFaqDetail: async (req, res) => {
        try {
            // req.params에서 URL의 :id 값을 가져옴
            const { id } = req.params;

            // 로직 수행 (Service 계층에 위임)
            const faq = await faqService.getFaqWithAnswer(Number(id));

            // 정상 응답: res.json()으로 클라이언트에게 데이터 전송
            return res.status(200).json({ success: true, data: faq });
        } catch (e) {
            // 에러 응답: 실패 메시지 전달
            return res.status(400).json({ success: false, message: e.message });
        }
    },

    // 2. 피드백 제출 요청 처리
    postFeedback: async (req, res) => {
        try {
            // req.params: URL의 ID, req.body: 클라이언트가 보낸 데이터
            const { id } = req.params;
            const { isHelpful } = req.body;

            // 데이터 검증: 사용자가 값을 제대로 보냈는지 확인
            if (isHelpful === undefined) {
                return res
                    .status(400)
                    .json({ success: false, message: "피드백 값이 누락되었습니다." });
            }

            await faqService.addFeedback(Number(id), isHelpful);

            // 성공 응답
            return res.status(200).json({ success: true, message: "피드백이 반영되었습니다." });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    },
};

module.exports = faqController;
