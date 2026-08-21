import type { IExtraEquipmentTariffRepository } from "../../domain/repositories/IExtraEquipmentTariffRepository.js";
import type { ExtraEquipmentTariff } from "../../domain/entities/ExtraEquipmentTariff.js";

export class GetExtraEquipmentTariffsUseCase {
  constructor(private extraEquipmentTariffRepository: IExtraEquipmentTariffRepository) {}

  async execute(filter?: { schoolUnitId?: number }): Promise<ExtraEquipmentTariff[]> {
    return await this.extraEquipmentTariffRepository.findAll(filter);
  }
}
