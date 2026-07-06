import { z } from "zod";

// 어드민 통계 조회용 스키마 (에러 없이 안전한 버전)
export const getAdminStatsSchema = z.object({
    query: z.object({
        // min(1)을 주어서 빈 문자열("")이 들어오는 것을 막고, 에러 메시지를 지정합니다.
        year: z.string().min(1, { message: "조회할 연도(year)는 필수 입력 사항입니다." }),
    }),
});

// 타입스크립트용 타입 추출
export type GetAdminStatsInputType = z.infer<typeof getAdminStatsSchema>["query"];
