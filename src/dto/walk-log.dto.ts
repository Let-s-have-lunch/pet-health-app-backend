import { z } from "zod";

export const createWalkLogSchema = z.object({
    duration: z.number().int().positive(),
    distance: z.number().optional(),
    memo: z.string().optional(),
    petId: z.number().int(),
});

// TODO : 내일 Dto저장 까지헀으니 이어서 gpt한테 하자하면됨
export type CreateWalkLogDto = z.infer<typeof createWalkLogSchema>;