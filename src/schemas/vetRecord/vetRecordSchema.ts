import { z } from "zod";

export const CreateVetRecordSchema = z.object({
    visitDate: z.string(),
    hospitalName: z.string(),
    visitPurpose: z.string(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    cost: z.coerce.number().int().nonnegative().optional(),
    memo: z.string().optional(),
    petId: z.coerce.number().int().positive(), // 👈 형변환 유지
});
export type CreateVetRecordInputType = z.infer<typeof CreateVetRecordSchema>;

export const UpdateVetRecordSchema = z.object({
    visitDate: z.string(),
    hospitalName: z.string(),
    visitPurpose: z.string(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    cost: z.coerce.number().int().nonnegative().optional(),
    receiptImage: z.string().optional(),
    memo: z.string().optional(),
    petId: z.coerce.number().int().positive().optional(),
});
export type UpdateVetRecordInputType = z.infer<typeof UpdateVetRecordSchema>;

export const getVetRecordSchema = z.object({
    id: z.coerce.number().positive(), // URL 파라미터(id)도 문자열로 들어오므로 안전하게 coerce 추가 추천
});
export type GetVetRecordInputType = z.infer<typeof getVetRecordSchema>;
