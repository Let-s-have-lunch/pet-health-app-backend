import { getFaqList, getFaqById } from "@/service/common/faqService";
import { createFaq, updateFaq, deleteFaq } from "@/service/admin/faqService";

export default async function handler(req: any, res: any) {
    const { method } = req;
    const { id } = req.query;

    try {
        // [1] 조회 기능 (GET) -> common 코드를 공통으로 같이 쓰기!
        if (method === "GET") {
            if (id) {
                const faq = await getFaqById(id);
                return res.status(200).json(faq);
            } else {
                const faqs = await getFaqList();
                return res.status(200).json(faqs);
            }
        }

        // [2] 생성 기능 (POST)
        if (method === "POST") {
            const { title, content } = req.body;
            const newFaq = await createFaq(title, content);
            return res.status(201).json(newFaq);
        }

        // [3] 수정 기능 (PUT)
        if (method === "PUT") {
            const { title, content } = req.body;
            const updatedFaq = await updateFaq(id, title, content);
            return res.status(200).json(updatedFaq);
        }

        // [4] 삭제 기능 (DELETE)
        if (method === "DELETE") {
            const deletedFaq = await deleteFaq(id);
            return res.status(200).json(deletedFaq);
        }

    } catch (error) {
        return res.status(500).json({ error: "관리자 에러가 발생했습니다." });
    }
}