import type { ReRegistrationTariff } from "../entities/ReRegistrationTariff.js";

export interface IReRegistrationTariffRepository {
  create(data: Omit<ReRegistrationTariff, "id">): Promise<ReRegistrationTariff>;
  findAll(filter?: { schoolUnitId?: number }): Promise<ReRegistrationTariff[]>;
  findById(id: number): Promise<ReRegistrationTariff | null>;
  findByUnitAndYear(
    schoolUnitId: number,
    enrollmentYear: number
  ): Promise<ReRegistrationTariff | null>;
  update(
    id: number,
    data: {
      newStudentFee?: number;
      promotionFee?: number;
      repeatFee?: number;
    }
  ): Promise<ReRegistrationTariff>;
  delete(id: number): Promise<void>;
}
