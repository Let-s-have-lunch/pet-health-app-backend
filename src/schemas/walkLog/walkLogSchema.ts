import { z } from "zod";

export const walkLogSchema = z.object({
    walkDate: z.string(),
    duration: z.number().int().min(1),
    keywords: z.array(z.string()).max(3, "최대 3개까지만 선택 가능합니다.").default([]),
});

export type WalkLogInputType = z.infer<typeof walkLogSchema>;
