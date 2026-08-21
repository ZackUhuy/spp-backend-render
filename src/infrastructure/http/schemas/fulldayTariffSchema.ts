import { z } from "zod";

export const createFulldayTariffSchema = z.object({
  body: z.object({
    schoolUnitId: z.number().int().min(1).max(2, "Program Fullday hanya untuk unit KB & RA"),
    enrollmentYear: z.number().int().min(2000),
    monthlyFee: z.number().int().min(0, "Biaya bulanan tidak boleh negatif"),
  }),
});

export const updateFulldayTariffSchema = z.object({
  body: z.object({
    schoolUnitId: z.number().int().min(1).max(2, "Program Fullday hanya untuk unit KB & RA").optional(),
    enrollmentYear: z.number().int().min(2000).optional(),
    monthlyFee: z.number().int().min(0, "Biaya bulanan tidak boleh negatif").optional(),
  }),
});
