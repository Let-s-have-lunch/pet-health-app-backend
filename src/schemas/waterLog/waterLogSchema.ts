import { z } from "zod";

export const createWaterLogSchema = z.object({
    recordDate: z.string(),
    amount: z.number().positive({ message: "음수량은 0보다 큰 숫자여야 합니다." }),
    memo: z.string().optional(),
    petId: z.number().int().positive(),
});
export type CreateWaterLogInputType = z.infer<typeof createWaterLogSchema>;

export const updateWaterLogSchema = z.object({
    recordDate: z.string(),
    amount: z.number().positive({ message: "음수량은 0보다 큰 숫자여야 합니다." }),
    memo: z.string().optional(),
});
export type UpdateWaterLogInputType = z.infer<typeof updateWaterLogSchema>;

export const getWaterLogSchema = z.object({
    id: z.number().positive(),
});
export type GetWaterLogInputType = z.infer<typeof getWaterLogSchema>;

export const getWaterLogStatsSchema = z.object({
    period: z.enum(["daily", "weekly", "monthly"], {
        message: "period는 'daily', 'weekly', 'monthly' 중 하나여야 합니다."
    }),
    baseDate: z.string({ message: "기준 날짜(baseDate)를 입력해주세요." }),
});
export type GetWaterLogStatsInputType = z.infer<typeof getWaterLogStatsSchema>;



