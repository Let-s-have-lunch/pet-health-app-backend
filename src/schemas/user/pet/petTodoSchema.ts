import { z } from "zod";


export const petTodoSchema = z.object({
    title: z.string().min(1, "할일은 1자 이상 입력해주세요."),
    date: z. string(),
    isCompleted: z.boolean(),
})

export type PetTodoInputType = z.infer<typeof petTodoSchema>;