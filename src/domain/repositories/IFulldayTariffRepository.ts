import type { FulldayTariff } from "../entities/FulldayTariff.js";

export interface CreateFulldayTariffDTO {
  schoolUnitId: number;
  enrollmentYear: number;
  monthlyFee: number;
}

export interface UpdateFulldayTariffDTO {
  schoolUnitId?: number | undefined;
  enrollmentYear?: number | undefined;
  monthlyFee?: number | undefined;
}

export interface IFulldayTariffRepository {
  create(data: CreateFulldayTariffDTO): Promise<FulldayTariff>;
  findById(id: number): Promise<FulldayTariff | null>;
  findByUnitAndYear(schoolUnitId: number, enrollmentYear: number): Promise<FulldayTariff | null>;
  findAll(): Promise<FulldayTariff[]>;
  update(id: number, data: UpdateFulldayTariffDTO): Promise<FulldayTariff>;
  delete(id: number): Promise<boolean>;
}
