import type { IFulldayTariffRepository, CreateFulldayTariffDTO } from "../../domain/repositories/IFulldayTariffRepository.js";
import type { FulldayTariff } from "../../domain/entities/FulldayTariff.js";
import { BadRequestError } from "../../domain/errors/AppError.js";

export class CreateFulldayTariffUseCase {
  constructor(private fulldayTariffRepository: IFulldayTariffRepository) {}

  async execute(dto: CreateFulldayTariffDTO): Promise<FulldayTariff> {
    if (dto.schoolUnitId !== 1 && dto.schoolUnitId !== 2) {
      throw new BadRequestError("Program Fullday hanya tersedia untuk unit KB (ID 1) dan RA (ID 2)");
    }

    const existing = await this.fulldayTariffRepository.findByUnitAndYear(
      dto.schoolUnitId,
      dto.enrollmentYear
    );

    if (existing) {
      throw new BadRequestError("Tarif Fullday untuk unit sekolah dan angkatan ini sudah dikonfigurasi");
    }

    return this.fulldayTariffRepository.create(dto);
  }
}
