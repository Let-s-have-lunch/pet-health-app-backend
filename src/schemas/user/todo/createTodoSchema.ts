import { z } from "zod";

export const createTodoSchema = z.object({
    title: z.string().trim().min(1, "할 일을 입력해주세요.").max(100, "할 일은 100자를 넘을 수 없습니다."),
    date: z.coerce.date(),
});

export type CreateTodoInputType = z.infer<typeof createTodoSchema>;
