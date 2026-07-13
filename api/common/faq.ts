import type { NextApiRequest, NextApiResponse } from "next";
import { getFaqList, getFaqById } from "@/service/common/faqservice";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id, keyword } = req.query; // 💡 반려동물 용품/증상 검색을 위한 keyword 추가

    try {
        // [1] 사용자는 오직 GET(조회)만 가능하도록 방어
        if (method !== "GET") {
            return res.status(405).json({
                success: false,
                message: "사용자는 조회만 가능합니다."
            });
        }

        // [2] ID가 있으면 상세 조회 실행
        if (id) {
            const faq = await getFaqById(id as string);
            if (!faq) {
                return res.status(404).json({
                    success: false,
                    message: "존재하지 않는 FAQ입니다."
                });
            }
            return res.status(200).json({ success: true, data: faq });
        }

        // [3] ID가 없으면 전체 목록 조회 (검색어 필터 포함)
        else {
            const faqs = await getFaqList(keyword as string);
            return res.status(200).json({ success: true, data: faqs });
        }

    } catch (error) {
        console.error("User FAQ API Error:", error);
        return res.status(500).json({
            success: false,
            error: "서버 에러가 발생했습니다."
        });
    }
}