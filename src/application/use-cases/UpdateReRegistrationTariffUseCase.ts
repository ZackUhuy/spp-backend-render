import type { IReRegistrationTariffRepository } from "../../domain/repositories/IReRegistrationTariffRepository.js";
import { ReRegistrationTariff } from "../../domain/entities/ReRegistrationTariff.js";
import { NotFoundError } from "../../domain/errors/AppError.js";

export class UpdateReRegistrationTariffUseCase {
  constructor(private repo: IReRegistrationTariffRepository) {}

  async execute(
    id: number,
    data: {
      newStudentFee?: number;
      promotionFee?: number;
      repeatFee?: number;
    }
  ): Promise<ReRegistrationTariff> {
    const existing = await this.repo.findById(id);

    if (!existing) {
      throw new NotFoundError("Tarif daftar ulang tidak ditemukan");
    }

    return await this.repo.update(id, data);
  }
}
