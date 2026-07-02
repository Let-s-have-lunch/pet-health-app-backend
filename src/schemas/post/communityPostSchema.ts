import { z } from "zod";

export const communityPostSchema = z.object({
    title: z.string().min(1, "제목은 필수 입력 항목입니다."),
    content: z.string().min(1, "내용을 입력해주세요."),
});

export type CommunityPostInputType = z.infer<typeof communityPostSchema>;
