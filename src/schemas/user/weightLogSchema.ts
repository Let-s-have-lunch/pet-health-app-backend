import { z } from "zod";

// 1. Create 스키마[cite: 1]
export const createWeightLogSchema = z.object({
    recordDate: z.string(),
    weight: z.number().positive(),
    memo: z.string().optional(),
    petId: z.number().int().positive(),
});
export type CreateWeightLogInputType = z.infer<typeof createWeightLogSchema>;

// 2. Update 스키마[cite: 4]
export const updateWeightLogSchema = z.object({
    recordDate: z.string(),
    weight: z.number().positive(),
    memo: z.string().optional(),
    petId: z.number().int().positive(),
});
export type UpdateWeightLogInputType = z.infer<typeof updateWeightLogSchema>;

// 3. Get 스키마[cite: 3]
export const getWeightLogSchema = z.object({
    id: z.number().positive(),
});
export type GetWeightLogInputType = z.infer<typeof getWeightLogSchema>;

// 4. Delete 스키마[cite: 2]
export const deleteWeightLogSchema = z.object({
    id: z.number().positive(),
});

export type DeleteWeightLogInputType = z.infer<typeof deleteWeightLogSchema>;

// 5. 몸무게 통계 조회 스키마
export const getWeightLogStatsSchema = z.object({
    period: z.enum(["daily", "weekly", "monthly"], {
        message: "period는 'daily', 'weekly', 'monthly' 중 하나여야 합니다."
    }),
    baseDate: z.string({ message: "기준 날짜(baseDate)를 입력해주세요." }),
});
export type GetWeightLogStatsInputType = z.infer<typeof getWeightLogStatsSchema>;
