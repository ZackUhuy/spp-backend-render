import prisma from "./prisma.js";
import type { IReRegistrationTariffRepository } from "../../domain/repositories/IReRegistrationTariffRepository.js";
import { ReRegistrationTariff } from "../../domain/entities/ReRegistrationTariff.js";

export class PrismaReRegistrationTariffRepository implements IReRegistrationTariffRepository {
  private prisma = prisma;

  async create(data: Omit<ReRegistrationTariff, "id">): Promise<ReRegistrationTariff> {
    const created = await this.prisma.reRegistrationTariff.create({
      data: {
        schoolUnitId: data.schoolUnitId,
        enrollmentYear: data.enrollmentYear,
        newStudentFee: data.newStudentFee,
        promotionFee: data.promotionFee,
        repeatFee: data.repeatFee,
      },
    });

    return new ReRegistrationTariff(
      created.id,
      created.schoolUnitId,
      created.enrollmentYear,
      created.newStudentFee,
      created.promotionFee,
      created.repeatFee
    );
  }

  async findAll(filter?: { schoolUnitId?: number }): Promise<ReRegistrationTariff[]> {
    const where: any = {};
    if (filter?.schoolUnitId !== undefined) {
      where.schoolUnitId = filter.schoolUnitId;
    }

    const tariffs = await this.prisma.reRegistrationTariff.findMany({
      where,
    });

    return tariffs.map(
      (t) => new ReRegistrationTariff(
        t.id,
        t.schoolUnitId,
        t.enrollmentYear,
        t.newStudentFee,
        t.promotionFee,
        t.repeatFee
      )
    );
  }

  async findById(id: number): Promise<ReRegistrationTariff | null> {
    const tariff = await this.prisma.reRegistrationTariff.findUnique({
      where: { id },
    });

    if (!tariff) return null;

    return new ReRegistrationTariff(
      tariff.id,
      tariff.schoolUnitId,
      tariff.enrollmentYear,
      tariff.newStudentFee,
      tariff.promotionFee,
      tariff.repeatFee
    );
  }

  async findByUnitAndYear(
    schoolUnitId: number,
    enrollmentYear: number
  ): Promise<ReRegistrationTariff | null> {
    const tariff = await this.prisma.reRegistrationTariff.findUnique({
      where: {
        uq_rereg_school_unit_enrollment_year: {
          schoolUnitId,
          enrollmentYear,
        },
      },
    });

    if (!tariff) return null;

    return new ReRegistrationTariff(
      tariff.id,
      tariff.schoolUnitId,
      tariff.enrollmentYear,
      tariff.newStudentFee,
      tariff.promotionFee,
      tariff.repeatFee
    );
  }

  async update(
    id: number,
    data: {
      newStudentFee?: number;
      promotionFee?: number;
      repeatFee?: number;
    }
  ): Promise<ReRegistrationTariff> {
    const dataToUpdate: any = {};
    if (data.newStudentFee !== undefined) dataToUpdate.newStudentFee = data.newStudentFee;
    if (data.promotionFee !== undefined) dataToUpdate.promotionFee = data.promotionFee;
    if (data.repeatFee !== undefined) dataToUpdate.repeatFee = data.repeatFee;

    const updated = await this.prisma.reRegistrationTariff.update({
      where: { id },
      data: dataToUpdate,
    });

    return new ReRegistrationTariff(
      updated.id,
      updated.schoolUnitId,
      updated.enrollmentYear,
      updated.newStudentFee,
      updated.promotionFee,
      updated.repeatFee
    );
  }

  async delete(id: number): Promise<void> {
    await this.prisma.reRegistrationTariff.delete({
      where: { id },
    });
  }
}
