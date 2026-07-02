import { z } from "zod";

export const updateWalkLogSchema = z.object({
    walkDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    duration: z.number().int().positive(),
    distance: z.number().optional(),
    memo: z.string().optional(),
    petId: z.number().int().positive(),
});

export type UpdateWalkLogInputType = z.infer<typeof updateWalkLogSchema>;
