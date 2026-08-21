import type { IReRegistrationTariffRepository } from "../../domain/repositories/IReRegistrationTariffRepository.js";
import { ReRegistrationTariff } from "../../domain/entities/ReRegistrationTariff.js";
import { BadRequestError } from "../../domain/errors/AppError.js";

export class CreateReRegistrationTariffUseCase {
  constructor(private repo: IReRegistrationTariffRepository) {}

  async execute(data: {
    schoolUnitId: number;
    enrollmentYear: number;
    newStudentFee?: number;
    promotionFee?: number;
    repeatFee?: number;
  }): Promise<ReRegistrationTariff> {
    const existing = await this.repo.findByUnitAndYear(
      data.schoolUnitId,
      data.enrollmentYear
    );

    if (existing) {
      throw new BadRequestError(
        "Gagal: Tarif daftar ulang untuk unit dan angkatan tersebut sudah terdaftar"
      );
    }

    return await this.repo.create({
      schoolUnitId: data.schoolUnitId,
      enrollmentYear: data.enrollmentYear,
      newStudentFee: data.newStudentFee ?? 0,
      promotionFee: data.promotionFee ?? 0,
      repeatFee: data.repeatFee ?? 0,
    });
  }
}
