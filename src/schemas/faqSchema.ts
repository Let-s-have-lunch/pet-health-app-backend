import { z } from "zod";

// 1. FAQ 생성 시 검증할 스키마 (질문, 답변 필수)
export const faqSchema = z.object({
    question: z.string().min(1, "질문은 필수입니다."),
    answer: z.string().min(1, "답변은 필수입니다."),
});

export type FaqInputType = z.infer<typeof faqSchema>;
