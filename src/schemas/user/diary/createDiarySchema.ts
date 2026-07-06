import { z } from "zod";

export const createDiarySchema = z.object({
    title: z.string().min(1, "제목을 입력해주세요.").max(255, "제목은 255자를 넘을 수 없습니다."),
    content: z.string().min(1, "내용을 입력해주세요."),
    diaryImage: z.string().optional(),
    date: z.coerce.date(),
});

export type CreateDiaryInputType = z.infer<typeof createDiarySchema>;