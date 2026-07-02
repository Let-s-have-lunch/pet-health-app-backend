import { z } from "zod";

export const petUpdateSchema = z.object({
    profileImage: z.string().optional(),
    neutered: z.boolean(),
});

export type PetUpdateInputType = z.infer<typeof petUpdateSchema>;