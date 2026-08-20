import type { IExtraEquipmentTariffRepository } from "../../domain/repositories/IExtraEquipmentTariffRepository.js";
import { ExtraEquipmentTariff } from "../../domain/entities/ExtraEquipmentTariff.js";
import { BadRequestError } from "../../domain/errors/AppError.js";

export class CreateExtraEquipmentTariffUseCase {
  constructor(private extraEquipmentTariffRepository: IExtraEquipmentTariffRepository) {}

  async execute(data: {
    schoolUnitId: number;
    enrollmentYear: number;
    level: string;
    equipmentFeeNew?: number;
    extracurricularFeeNew?: number;
    equipmentFeePromotion?: number;
    extracurricularFeePromotion?: number;
    equipmentFeeRepeat?: number;
    extracurricularFeeRepeat?: number;
    equipmentFee?: number;
    extracurricularFee?: number;
  }): Promise<ExtraEquipmentTariff> {
    const existing = await this.extraEquipmentTariffRepository.findByUnitYearAndLevel(
      data.schoolUnitId,
      data.enrollmentYear,
      data.level
    );

    if (existing) {
      throw new BadRequestError(
        "Gagal: Tarif ekstra & peralatan untuk unit, angkatan, dan tingkatan tersebut sudah terdaftar"
      );
    }

    return await this.extraEquipmentTariffRepository.create({
      schoolUnitId: data.schoolUnitId,
      enrollmentYear: data.enrollmentYear,
      level: data.level,
      equipmentFeeNew: data.equipmentFeeNew ?? 0,
      extracurricularFeeNew: data.extracurricularFeeNew ?? 0,
      equipmentFeePromotion: data.equipmentFeePromotion ?? 0,
      extracurricularFeePromotion: data.extracurricularFeePromotion ?? 0,
      equipmentFeeRepeat: data.equipmentFeeRepeat ?? 0,
      extracurricularFeeRepeat: data.extracurricularFeeRepeat ?? 0,
      equipmentFee: data.equipmentFee ?? 0,
      extracurricularFee: data.extracurricularFee ?? 0,
    });
  }
}
