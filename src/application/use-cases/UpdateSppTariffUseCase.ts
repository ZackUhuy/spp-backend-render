import type { ISppTariffRepository } from "../../domain/repositories/ISppTariffRepository.js";
import { SppTariff } from "../../domain/entities/SppTariff.js";
import { NotFoundError } from "../../domain/errors/AppError.js";

export class UpdateSppTariffUseCase {
  constructor(private sppTariffRepository: ISppTariffRepository) {}

  async execute(
    id: number,
    amount: number,
    developmentFee?: number,
    reRegistrationFee?: number,
    equipmentFee?: number,
    extracurricularFee?: number,
    uniformFee?: number
  ): Promise<SppTariff> {
    const existing = await this.sppTariffRepository.findById(id);
 
    if (!existing) {
      throw new NotFoundError("Tarif SPP tidak ditemukan");
    }
 
    return await this.sppTariffRepository.update(
      id,
      amount,
      developmentFee,
      reRegistrationFee,
      equipmentFee,
      extracurricularFee,
      uniformFee
    );
  }
}
