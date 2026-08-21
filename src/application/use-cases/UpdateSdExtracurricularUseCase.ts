import type { ISdExtracurricularRepository } from "../../domain/repositories/ISdExtracurricularRepository.js";
import { SdExtracurricular } from "../../domain/entities/SdExtracurricular.js";
import { NotFoundError } from "../../domain/errors/AppError.js";

export class UpdateSdExtracurricularUseCase {
  constructor(private sdExtracurricularRepository: ISdExtracurricularRepository) {}

  async execute(id: number, data: { name?: string; fee?: number }): Promise<SdExtracurricular> {
    const existing = await this.sdExtracurricularRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Ekstrakurikuler SD tidak ditemukan");
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.fee !== undefined) updateData.fee = data.fee;

    return await this.sdExtracurricularRepository.update(id, updateData);
  }
}
