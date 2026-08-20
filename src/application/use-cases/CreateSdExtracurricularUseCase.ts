import type { ISdExtracurricularRepository } from "../../domain/repositories/ISdExtracurricularRepository.js";
import { SdExtracurricular } from "../../domain/entities/SdExtracurricular.js";
import { BadRequestError } from "../../domain/errors/AppError.js";

export class CreateSdExtracurricularUseCase {
  constructor(private sdExtracurricularRepository: ISdExtracurricularRepository) {}

  async execute(data: { name: string; fee?: number }): Promise<SdExtracurricular> {
    if (!data.name || data.name.trim().length === 0) {
      throw new BadRequestError("Nama ekstrakurikuler wajib diisi");
    }

    return await this.sdExtracurricularRepository.create({
      name: data.name.trim(),
      fee: data.fee ?? 0,
    });
  }
}
