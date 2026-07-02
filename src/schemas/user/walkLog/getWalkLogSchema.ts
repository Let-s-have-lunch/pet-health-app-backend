import { z } from "zod";

export const getWalkLogSchema = z.object({
    id: z.number().positive(),
});


export type GetWalkLogInputType = z.infer<typeof getWalkLogSchema>;