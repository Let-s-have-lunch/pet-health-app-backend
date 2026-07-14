import type { NextApiRequest, NextApiResponse } from "next";
import { getFaqList, getFaqById } from "@/service/common/Faqservice";
import { createFaq, updateFaq, deleteFaq } from "@/service/admin/Faqservice";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id, keyword } = req.query; // 💡 관리자도 특정 키워드(예: "예방접종")로 작성된 글을 검색할 수 있도록 추가

    try {
        // [1] 조회 기능 (GET) -> 반려동물 보호자 화면과 동일한 목록/상세 조회 로직
        if (method === "GET") {
            if (id) {
                const faq = await getFaqById(id as string);
                if (!faq) {
                    return res.status(404).json({ success: false, message: "해당 FAQ를 찾을 수 없습니다." });
                }
                return res.status(200).json({ success: true, data: faq });
            } else {
                const faqs = await getFaqList(keyword as string);
                return res.status(200).json({ success: true, data: faqs });
            }
        }

        // [2] 생성 기능 (POST) -> 새로운 반려동물 케어 정보 등록
        if (method === "POST") {
            const { title, content } = req.body;

            // 💡 제목이나 내용이 텅 비어있으면 등록을 거부하는 방어벽 설치!
            if (!title?.trim() || !content?.trim()) {
                return res.status(400).json({ success: false, message: "반려동물 FAQ 제목과 내용을 모두 입력해주세요." });
            }

            const newFaq = await createFaq(title, content);
            return res.status(201).json({ success: true, data: newFaq, message: "새로운 FAQ가 성공적으로 등록되었습니다." });
        }

        // [3] 수정 기능 (PUT) -> 정보 업데이트 (예: 바뀐 예방접종 시기 등 고치기)
        if (method === "PUT") {
            if (!id) {
                return res.status(400).json({ success: false, message: "수정할 대상을 지정해야 합니다." });
            }

            const { title, content } = req.body;
            if (!title?.trim() || !content?.trim()) {
                return res.status(400).json({ success: false, message: "수정할 내용에 빈 칸이 없어야 합니다." });
            }

            const updatedFaq = await updateFaq(id as string, title, content);
            return res.status(200).json({ success: true, data: updatedFaq, message: "FAQ가 성공적으로 수정되었습니다." });
        }

        // [4] 삭제 기능 (DELETE) -> 불필요해진 FAQ 제거
        if (method === "DELETE") {
            if (!id) {
                return res.status(400).json({ success: false, message: "삭제할 대상을 지정해야 합니다." });
            }

            const deletedFaq = await deleteFaq(id as string);
            return res.status(200).json({ success: true, data: deletedFaq, message: "FAQ가 성공적으로 삭제되었습니다." });
        }

        // 정의되지 않은 Method 접근 차단
        return res.status(405).json({ success: false, message: "허용되지 않는 요청 방식입니다." });

    } catch (error) {
        console.error("Admin FAQ API Error:", error);
        return res.status(500).json({ success: false, error: "관리자 시스템 에러가 발생했습니다." });
    }
}