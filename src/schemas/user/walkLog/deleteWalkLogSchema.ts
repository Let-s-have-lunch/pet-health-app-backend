import { z } from "zod";

export const deleteWalkLogSchema = z.object({
    id: z.number().positive(),
});

export type DeleteWalkLogInputType = z.infer<typeof deleteWalkLogSchema>;
