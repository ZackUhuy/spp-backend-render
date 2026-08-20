import type { SdExtracurricular } from "../entities/SdExtracurricular.js";

export interface ISdExtracurricularRepository {
  create(data: Omit<SdExtracurricular, "id">): Promise<SdExtracurricular>;
  findAll(): Promise<SdExtracurricular[]>;
  findById(id: number): Promise<SdExtracurricular | null>;
  update(id: number, data: { name?: string; fee?: number }): Promise<SdExtracurricular>;
  delete(id: number): Promise<void>;
}
