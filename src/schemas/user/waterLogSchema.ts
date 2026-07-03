import { z } from "zod";

// 1. Create 스키마[cite: 1]
export const createWaterLogSchema = z.object({
    recordDate: z.string(),
    amount: z.number().positive({ message: "음수량은 0보다 큰 숫자여야 합니다." }),
    memo: z.string().optional(),
    petId: z.number().int().positive(),
});
export type CreateWaterLogInputType = z.infer<typeof createWaterLogSchema>;

// 2. Update 스키마 (생성과 동일하게 1:1 복사)
export const updateWaterLogSchema = z.object({
    recordDate: z.string(),
    amount: z.number().positive({ message: "음수량은 0보다 큰 숫자여야 합니다." }),
    memo: z.string().optional(),
    petId: z.number().int().positive(),
});
export type UpdateWaterLogInputType = z.infer<typeof updateWaterLogSchema>;

// 3. Get 스키마[cite: 3]
export const getWaterLogSchema = z.object({
    id: z.number().positive(),
});
export type GetWaterLogInputType = z.infer<typeof getWaterLogSchema>;

// 4. Delete 스키마[cite: 2]
export const deleteWaterLogSchema = z.object({
    id: z.number().positive(),
});
export type DeleteWaterLogInputType = z.infer<typeof deleteWaterLogSchema>;

// 5. 통계(Stats) 조회 스키마
export const getWaterLogStatsSchema = z.object({
    period: z.enum(["daily", "weekly", "monthly"], {
        message: "period는 'daily', 'weekly', 'monthly' 중 하나여야 합니다."
    }),
    baseDate: z.string({ message: "기준 날짜(baseDate)를 입력해주세요." }),
});
export type GetWaterLogStatsInputType = z.infer<typeof getWaterLogStatsSchema>;



