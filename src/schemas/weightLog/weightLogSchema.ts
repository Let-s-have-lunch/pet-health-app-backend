import { z } from "zod";

export const createWeightLogSchema = z.object({
    recordDate: z.string(),
    weight: z.number().positive(),
    memo: z.string().optional(),
    petId: z.number().int().positive(),
});
export type CreateWeightLogInputType = z.infer<typeof createWeightLogSchema>;

export const updateWeightLogSchema = z.object({
    recordDate: z.string(),
    weight: z.number().positive(),
    memo: z.string().optional(),
    petId: z.number().int().positive(),
});
export type UpdateWeightLogInputType = z.infer<typeof updateWeightLogSchema>;

export const getWeightLogSchema = z.object({
    id: z.string(),
});
export type GetWeightLogInputType = z.infer<typeof getWeightLogSchema>;

export const getWeightLogStatsSchema = z.object({
    period: z.enum(["daily", "weekly", "monthly"], {
        message: "period는 'daily', 'weekly', 'monthly' 중 하나여야 합니다."
    }),
    baseDate: z.string({ message: "기준 날짜(baseDate)를 입력해주세요." }),
});
export type GetWeightLogStatsInputType = z.infer<typeof getWeightLogStatsSchema>;
