import { z } from "zod";

export const sdExtracurricularSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Nama ekstrakurikuler wajib diisi" })
      .min(1, "Nama ekstrakurikuler tidak boleh kosong")
      .max(100),
    fee: z.number().int().nonnegative().optional().default(0),
  }),
});

export const updateSdExtracurricularSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    fee: z.number().int().nonnegative().optional(),
  }),
});
