import { Request, Response } from "express";
import faqService from "../service/faqService";

export const createFaq = async (req: Request, res: Response): Promise<void> => {
    try {
        const { question, answer } = req.body;
        // 💡 4번 미들웨어에서 이미 검증을 끝내서 코드가 아주 깔끔해집니다.
        const newFaq = await faqService.createFaq(question, answer);
        res.status(201).json({ success: true, data: newFaq });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "FAQ 생성 중 에러 발생" });
    }
};

export const updateFaq = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const { question, answer } = req.body;
        const updatedFaq = await faqService.updateFaq(id, question, answer);
        res.status(200).json({ success: true, data: updatedFaq });
    } catch (error: any) {
        console.error(error);
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export const deleteFaq = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        await faqService.deleteFaq(id);
        res.status(200).json({ success: true, message: "FAQ가 성공적으로 삭제되었습니다." });
    } catch (error: any) {
        console.error(error);
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

export default { createFaq, updateFaq, deleteFaq };