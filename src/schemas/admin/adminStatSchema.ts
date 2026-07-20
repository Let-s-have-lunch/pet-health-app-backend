import { z } from "zod";

export const getAdminStatsSchema = z.object({
    query: z.object({
        year: z.string().min(1, { message: "조회할 연도(year)는 필수 입력 사항입니다." }),
    }),
});

export type GetAdminStatsInputType = z.infer<typeof getAdminStatsSchema>["query"];
