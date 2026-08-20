import type { ISdExtracurricularRepository } from "../../domain/repositories/ISdExtracurricularRepository.js";
import { NotFoundError } from "../../domain/errors/AppError.js";

export class DeleteSdExtracurricularUseCase {
  constructor(private sdExtracurricularRepository: ISdExtracurricularRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.sdExtracurricularRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Ekstrakurikuler SD tidak ditemukan");
    }

    await this.sdExtracurricularRepository.delete(id);
  }
}
