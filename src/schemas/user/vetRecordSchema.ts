import { z } from "zod";

// 1. Create 스키마[cite: 1]
export const CreateVetRecordSchema = z.object({
    visitDate: z.string(),
    hospitalName: z.string(),
    visitPurpose: z.string(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    cost: z.number().int().positive().optional(),
    receiptImage: z.string().optional(),
    memo: z.string().optional(),
    petId: z.number().int().positive(),
});
export type CreateVetRecordInputType = z.infer<typeof CreateVetRecordSchema>;

// 2. Update 스키마 (생성과 동일하게 명시적으로 복사)[cite: 4]
export const UpdateVetRecordSchema = z.object({
    visitDate: z.string(),
    hospitalName: z.string(),
    visitPurpose: z.string(),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    cost: z.number().int().positive().optional(),
    receiptImage: z.string().optional(),
    memo: z.string().optional(),
    petId: z.number().int().positive(),
});
export type UpdateVetRecordInputType = z.infer<typeof UpdateVetRecordSchema>;

// 3. Get 스키마[cite: 3]
export const getVetRecordSchema = z.object({
    id: z.number().positive(),
});
export type GetVetRecordInputType = z.infer<typeof getVetRecordSchema>;

// 4. Delete 스키마[cite: 2]
export const deleteVetRecordSchema = z.object({
    id: z.number().positive(),
});
export type DeleteVetRecordInputType = z.infer<typeof deleteVetRecordSchema>;
