import { z } from "zod";

export const extraEquipmentTariffSchema = z.object({
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
    level: z
      .string({ required_error: "Tingkatan wajib diisi" })
      .min(1)
      .max(50),
    equipmentFeeNew: z.number().int().nonnegative().optional().default(0),
    extracurricularFeeNew: z.number().int().nonnegative().optional().default(0),
    equipmentFeePromotion: z.number().int().nonnegative().optional().default(0),
    extracurricularFeePromotion: z.number().int().nonnegative().optional().default(0),
    equipmentFeeRepeat: z.number().int().nonnegative().optional().default(0),
    extracurricularFeeRepeat: z.number().int().nonnegative().optional().default(0),
    equipmentFee: z.number().int().nonnegative().optional().default(0),
    extracurricularFee: z.number().int().nonnegative().optional().default(0),
  }),
});

export const updateExtraEquipmentTariffSchema = z.object({
  body: z.object({
    equipmentFeeNew: z.number().int().nonnegative().optional(),
    extracurricularFeeNew: z.number().int().nonnegative().optional(),
    equipmentFeePromotion: z.number().int().nonnegative().optional(),
    extracurricularFeePromotion: z.number().int().nonnegative().optional(),
    equipmentFeeRepeat: z.number().int().nonnegative().optional(),
    extracurricularFeeRepeat: z.number().int().nonnegative().optional(),
    equipmentFee: z.number().int().nonnegative().optional(),
    extracurricularFee: z.number().int().nonnegative().optional(),
  }),
});
