import { z } from "zod";

export const reRegistrationTariffSchema = z.object({
  body: z.object({
    schoolUnitId: z
      .number({ required_error: "ID unit sekolah wajib diisi" })
      .int()
      .positive(),
    enrollmentYear: z
      .number({ required_error: "Tahun angkatan wajib diisi" })
      .int()
      .min(2000)
      .max(9999),
    newStudentFee: z.number().int().nonnegative().optional().default(0),
    promotionFee: z.number().int().nonnegative().optional().default(0),
    repeatFee: z.number().int().nonnegative().optional().default(0),
  }),
});

export const updateReRegistrationTariffSchema = z.object({
  body: z.object({
    newStudentFee: z.number().int().nonnegative().optional(),
    promotionFee: z.number().int().nonnegative().optional(),
    repeatFee: z.number().int().nonnegative().optional(),
  }),
});
