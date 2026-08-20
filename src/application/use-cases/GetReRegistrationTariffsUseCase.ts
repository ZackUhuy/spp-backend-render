import type { IReRegistrationTariffRepository } from "../../domain/repositories/IReRegistrationTariffRepository.js";
import type { ReRegistrationTariff } from "../../domain/entities/ReRegistrationTariff.js";

export class GetReRegistrationTariffsUseCase {
  constructor(private repo: IReRegistrationTariffRepository) {}

  async execute(filter?: { schoolUnitId?: number }): Promise<ReRegistrationTariff[]> {
    return await this.repo.findAll(filter);
  }
}
