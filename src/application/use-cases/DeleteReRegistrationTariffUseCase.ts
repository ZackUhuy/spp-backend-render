import type { IReRegistrationTariffRepository } from "../../domain/repositories/IReRegistrationTariffRepository.js";
import { NotFoundError } from "../../domain/errors/AppError.js";

export class DeleteReRegistrationTariffUseCase {
  constructor(private repo: IReRegistrationTariffRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.repo.findById(id);

    if (!existing) {
      throw new NotFoundError("Tarif daftar ulang tidak ditemukan");
    }

    await this.repo.delete(id);
  }
}
