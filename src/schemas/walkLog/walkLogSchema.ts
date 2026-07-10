import { z } from "zod";

export const walkLogSchema = z.object({
    walkDate: z.string(),
    duration: z.number().int().min(1),
    memo: z.string().max(500).optional(),
});

export type WalkLogInputType = z.infer<typeof walkLogSchema>;
