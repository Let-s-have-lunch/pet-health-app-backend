import { z } from "zod";
import { PetGender } from "../../../generated/prisma/enums.ts";

export const petUpdateSchema = z.object({
    species: z.string(),
    breed: z.string(),
    name: z.string(),
    birthdate: z.string(),
    registrationNumber: z.string(),
    gender: z.enum(PetGender),
    neutered: z.boolean(),
    profileImage: z.string(),
});

export type PetUpdateInputType = z.infer<typeof petUpdateSchema>;