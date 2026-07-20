import { z } from "zod";

export const petDiarySchema = z.object({
    title: z.string().min(1, "제목을 입력해주세요."),
    content: z.string().min(1, "내용을 입력해주세요."),
    diaryImage: z.string().optional(),
    date: z.string().regex(/^\d{8}$/, "기록일은 8자리 숫자(YYYYMMDD)로 입력해주세요") // ""에서 걸림
        .optional() // undefined에 대해서만 통과시킴
        .or(z.literal("")),

});

export type PetDiaryInputType = z.infer<typeof petDiarySchema>;
