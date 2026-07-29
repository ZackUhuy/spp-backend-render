import type { ISppTariffRepository } from "../../domain/repositories/ISppTariffRepository.js";
import { SppTariff } from "../../domain/entities/SppTariff.js";
import { BadRequestError } from "../../domain/errors/AppError.js";

export class CreateSppTariffUseCase {
  constructor(private sppTariffRepository: ISppTariffRepository) {}

  async execute(data: {
    schoolUnitId: number;
    enrollmentYear: number;
    amount: number;
    developmentFee?: number;
    reRegistrationFee?: number;
    equipmentFee?: number;
    extracurricularFee?: number;
    uniformFee?: number;
  }): Promise<SppTariff> {
    const existing = await this.sppTariffRepository.findByUnitAndYear(
      data.schoolUnitId,
      data.enrollmentYear
    );

    if (existing) {
      throw new BadRequestError(
        "Gagal: Tarif SPP untuk unit dan angkatan tersebut sudah terdaftar"
      );
    }

    return await this.sppTariffRepository.create({
      schoolUnitId: data.schoolUnitId,
      enrollmentYear: data.enrollmentYear,
      amount: data.amount,
      developmentFee: data.developmentFee ?? 0,
      reRegistrationFee: data.reRegistrationFee ?? 0,
      equipmentFee: data.equipmentFee ?? 0,
      extracurricularFee: data.extracurricularFee ?? 0,
      uniformFee: data.uniformFee ?? 0,
    });
  }
}
