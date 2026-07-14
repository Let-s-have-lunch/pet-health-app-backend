import { z } from "zod";
import { PetGender } from "../../../generated/prisma/enums.ts";

export const petUpdateSchema = z.object({
    species: z.string().min(1, "동물종을 선택해주세요."),

    breed: z.string().optional(),

    name: z
        .string()
        .min(1, "반려동물 이름을 입력해주세요.")
        .max(30, "반려동물 이름은 30자 이하로 입력해주세요."),

    birthdate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "생년월일은 YYYY-MM-DD 형식으로 입력해주세요.")
        .optional()
        .or(z.literal("")),

    registrationNumber: z.string().optional().or(z.literal("")),
    profileImage: z.string().optional(),
    gender: z.enum(PetGender, "성별을 선택해주세요"),

    // FormData에서는 "true" / "false" 문자열이 들어오므로 자동 변환
    neutered: z.coerce.boolean(),
});

export type PetUpdateInputType = z.infer<typeof petUpdateSchema>;
