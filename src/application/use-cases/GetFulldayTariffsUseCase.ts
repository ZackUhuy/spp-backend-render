import type { IFulldayTariffRepository } from "../../domain/repositories/IFulldayTariffRepository.js";
import type { FulldayTariff } from "../../domain/entities/FulldayTariff.js";

export class GetFulldayTariffsUseCase {
  constructor(private fulldayTariffRepository: IFulldayTariffRepository) {}

  async execute(): Promise<FulldayTariff[]> {
    return this.fulldayTariffRepository.findAll();
  }
}
