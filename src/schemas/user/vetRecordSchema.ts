import { z } from "zod";

// 1. Create 스키마
export const CreateVetRecordSchema = z.object({
    visitDate: z.string(),
    hospitalName: z.string(),
    visitPurpose: z.string(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    cost: z.coerce.number().int().nonnegative().optional(), // 👈 .nonnegative()로 변경 (0원 허용)
    receiptImage: z.string().optional(),
    memo: z.string().optional(),
    petId: z.coerce.number().int().positive(), // 👈 형변환 유지
});
export type CreateVetRecordInputType = z.infer<typeof CreateVetRecordSchema>;

// 2. Update 스키마 (Create와 동일하게 맞춰줍니다)
export const UpdateVetRecordSchema = z.object({
    visitDate: z.string(),
    hospitalName: z.string(),
    visitPurpose: z.string(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    cost: z.coerce.number().int().nonnegative().optional(), // 👈 z.coerce 및 nonnegative 추가
    receiptImage: z.string().optional(),
    memo: z.string().optional(),
    petId: z.coerce.number().int().positive(), // 👈 z.coerce 추가
});
export type UpdateVetRecordInputType = z.infer<typeof UpdateVetRecordSchema>;

// 3. Get 스키마
export const getVetRecordSchema = z.object({
    id: z.coerce.number().positive(), // URL 파라미터(id)도 문자열로 들어오므로 안전하게 coerce 추가 추천
});
export type GetVetRecordInputType = z.infer<typeof getVetRecordSchema>;

// 4. Delete 스키마
export const deleteVetRecordSchema = z.object({
    id: z.coerce.number().positive(), // 마찬가지로 coerce 추가 추천
});
export type DeleteVetRecordInputType = z.infer<typeof deleteVetRecordSchema>;
