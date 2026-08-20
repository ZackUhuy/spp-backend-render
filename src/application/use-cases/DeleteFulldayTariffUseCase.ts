import type { IFulldayTariffRepository } from "../../domain/repositories/IFulldayTariffRepository.js";
import { NotFoundError } from "../../domain/errors/AppError.js";

export class DeleteFulldayTariffUseCase {
  constructor(private fulldayTariffRepository: IFulldayTariffRepository) {}

  async execute(id: number): Promise<boolean> {
    const existing = await this.fulldayTariffRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Tarif Fullday tidak ditemukan");
    }

    return this.fulldayTariffRepository.delete(id);
  }
}
