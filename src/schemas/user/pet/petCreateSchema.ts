import { z } from "zod";
import { PetGender } from "../../../generated/prisma/enums.ts";

export const petCreateSchema = z.object({
    species: z.string().min(1, "동물종을 선택해주세요."),
    breed: z.string().optional(),
    name: z
        .string()
        .min(1, "반려동물 이름을 입력해주세요.")
        .max(30, "반려동물 이름은 30자 이하로 입력해주세요."),
    profileImage: z.string().optional(),
    birthdate: z
        .string()
        .regex(/^\d{8}$/, "생년월일은 8자리 숫자(YYYYMMDD)로 입력해주세요") // ""에서 걸림
        .optional() // undefined에 대해서만 통과시킴
        .or(z.literal("")),
    registrationNumber: z.string().optional(),
    gender: z.enum(PetGender, "성별을 선택해주세요"),
    neutered: z.boolean(),
});

export type PetCreateInputType = z.infer<typeof petCreateSchema>;
