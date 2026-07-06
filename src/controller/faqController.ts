import { Request, Response } from "express";
import faqService from "../service/faqService.ts";

const getFaqs = async (req:Request, res:Response): Promise<void> => {
    try {
        const { category } = req.query;
        const faqs = await faqService.findAllFaqs(
            typeof category === "string" ? category : undefined
        );

        res.status(200).json({
            success: true,
            data: faqs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "FAQ 목록 조회 중 서버 에러가 발생했습니다.",
        });
    }
};

const getFaqDetail = async (req:Request, res:Response):Promise<void> => {
    try {
        const { id } = req.params;
        const result = await faqService.getFaqById(id);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error:any) {
        console.error(error);
        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "상세 조회 중 서버 에러가 발생했습니다.",
        });
    }
};

// 강사님 스타일대로 내보내기
export default {
    getFaqs,
    getFaqDetail,
};