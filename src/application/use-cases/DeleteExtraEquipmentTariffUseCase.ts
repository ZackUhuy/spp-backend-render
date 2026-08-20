import type { IExtraEquipmentTariffRepository } from "../../domain/repositories/IExtraEquipmentTariffRepository.js";
import { NotFoundError } from "../../domain/errors/AppError.js";

export class DeleteExtraEquipmentTariffUseCase {
  constructor(private extraEquipmentTariffRepository: IExtraEquipmentTariffRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.extraEquipmentTariffRepository.findById(id);

    if (!existing) {
      throw new NotFoundError("Tarif ekstra & peralatan tidak ditemukan");
    }

    await this.extraEquipmentTariffRepository.delete(id);
  }
}
