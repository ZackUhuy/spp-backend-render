import type { IExtraEquipmentTariffRepository } from "../../domain/repositories/IExtraEquipmentTariffRepository.js";
import { ExtraEquipmentTariff } from "../../domain/entities/ExtraEquipmentTariff.js";
import { NotFoundError } from "../../domain/errors/AppError.js";

export class UpdateExtraEquipmentTariffUseCase {
  constructor(private extraEquipmentTariffRepository: IExtraEquipmentTariffRepository) {}

  async execute(
    id: number,
    data: {
      equipmentFeeNew?: number;
      extracurricularFeeNew?: number;
      equipmentFeePromotion?: number;
      extracurricularFeePromotion?: number;
      equipmentFeeRepeat?: number;
      extracurricularFeeRepeat?: number;
      equipmentFee?: number;
      extracurricularFee?: number;
    }
  ): Promise<ExtraEquipmentTariff> {
    const existing = await this.extraEquipmentTariffRepository.findById(id);

    if (!existing) {
      throw new NotFoundError("Tarif ekstra & peralatan tidak ditemukan");
    }

    return await this.extraEquipmentTariffRepository.update(id, data);
  }
}
