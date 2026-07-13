import { getFaqList, getFaqById } from "@/service/common/faqService";

export default async function handler(req: any, res: any) {
    const { method } = req;
    const { id } = req.query;

    try {
        if (method === "GET") {
            if (id) {
                // 상세 조회 실행
                const faq = await getFaqById(id);
                return res.status(200).json(faq);
            } else {
                // 목록 조회 실행
                const faqs = await getFaqList(id);
                return res.status(200).json(faqs);
            }
        } else {
            return res.status(405).json({ message: "사용자는 조회만 가능합니다." });
        }
    } catch (error) {
        return res.status(500).json({ error: "서버 에러가 발생했습니다." });
    }
}