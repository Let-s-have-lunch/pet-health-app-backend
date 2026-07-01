import { z } from "zod";
import { RoleType } from "../../../generated/prisma/enums.ts";

export const adminCreateUserSchema = z.object({
    nickname: z.string().min(2).max(10),
    password: z.string().min(6).optional(),
    email: z.email(),
    birthdate: z.string().optional(),
    role: z.enum(RoleType),
});

export type AdminCreateUserInputType = z.infer<typeof adminCreateUserSchema>;
