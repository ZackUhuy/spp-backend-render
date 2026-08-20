import type { ExtraEquipmentTariff } from "../entities/ExtraEquipmentTariff.js";

export interface IExtraEquipmentTariffRepository {
  create(data: Omit<ExtraEquipmentTariff, "id">): Promise<ExtraEquipmentTariff>;
  findAll(filter?: { schoolUnitId?: number }): Promise<ExtraEquipmentTariff[]>;
  findById(id: number): Promise<ExtraEquipmentTariff | null>;
  findByUnitYearAndLevel(
    schoolUnitId: number,
    enrollmentYear: number,
    level: string
  ): Promise<ExtraEquipmentTariff | null>;
  update(
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
  ): Promise<ExtraEquipmentTariff>;
  delete(id: number): Promise<void>;
}
