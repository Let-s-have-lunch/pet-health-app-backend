import { z } from "zod";

// 1. FAQ 생성 시 검증할 스키마 (질문, 답변 필수)
export const createFaqSchema = z.object({
    body: z.object({
        // 💡 복잡한 객체 문법을 빼고 .min()으로만 깔끔하게 에러 메시지를 처리했습니다.
        question: z.string().min(1, "질문은 필수입니다."),
        answer: z.string().min(1, "답변은 필수입니다."),
    }),
});

// 2. FAQ 수정 시 검증할 스키마 (선택 사항이지만, 입력 시 비어있으면 안 됨)
export const updateFaqSchema = z.object({
    body: z.object({
        question: z.string().min(1, "질문은 비어있을 수 없습니다.").optional(),
        answer: z.string().min(1, "답변은 비어있을 수 없습니다.").optional(),
    }),
});