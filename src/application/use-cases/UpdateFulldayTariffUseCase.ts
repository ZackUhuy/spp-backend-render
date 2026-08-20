import type { IFulldayTariffRepository, UpdateFulldayTariffDTO } from "../../domain/repositories/IFulldayTariffRepository.js";
import type { FulldayTariff } from "../../domain/entities/FulldayTariff.js";
import { NotFoundError, BadRequestError } from "../../domain/errors/AppError.js";

export class UpdateFulldayTariffUseCase {
  constructor(private fulldayTariffRepository: IFulldayTariffRepository) {}

  async execute(id: number, dto: UpdateFulldayTariffDTO): Promise<FulldayTariff> {
    const existing = await this.fulldayTariffRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Tarif Fullday tidak ditemukan");
    }

    if (dto.schoolUnitId && dto.schoolUnitId !== 1 && dto.schoolUnitId !== 2) {
      throw new BadRequestError("Program Fullday hanya tersedia untuk unit KB (ID 1) dan RA (ID 2)");
    }

    return this.fulldayTariffRepository.update(id, dto);
  }
}
